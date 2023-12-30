import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncLock from 'async-lock';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';

import { useUser, type Worksheet } from './userContext';
import seasonsData from '../generated/seasons.json';
import type { Crn, Season, Listing } from '../utilities/common';

import { API_ENDPOINT } from '../config';

// Global course data cache.
const courseDataLock = new AsyncLock();
const courseLoadAttempted = new Set<Season>();
let courseData: { [seasonCode: Season]: Map<Crn, Listing> } = {};
const addToCache = (season: Season): Promise<void> =>
  courseDataLock.acquire(`load-${season}`, async () => {
    if (season in courseData || courseLoadAttempted.has(season)) {
      // Skip if already loaded, or if we previously tried to load it.
      return;
    }

    // Log that we attempted to load this.
    courseLoadAttempted.add(season);

    const res = await fetch(
      `${API_ENDPOINT}/api/static/catalogs/${season}.json`,
      { credentials: 'include' },
    );
    if (!res.ok) {
      // TODO: better error handling here; we may want to get rid of async-lock
      // first
      throw new Error(
        `failed to fetch course data for ${season}. ${res.statusText}`,
      );
    }
    const data = (await res.json()) as Listing[];
    const info = new Map<Crn, Listing>();
    for (const listing of data) info.set(listing.crn, listing);
    // Save in global cache. Here we force the creation of a new object.
    courseData = {
      ...courseData,
      [season]: info,
    };
  });

type Store = {
  requests: number;
  loading: boolean;

  error: {} | null;
  seasons: Season[];
  courses: typeof courseData;
  requestSeasons: (seasons: Season[]) => void;
};

const FerryCtx = createContext<Store | undefined>(undefined);
FerryCtx.displayName = 'FerryCtx';

export function FerryProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Note that we track requests for force a re-render when
  // courseData changes.
  const [requests, setRequests] = useState(0);

  const [errors, setErrors] = useState<{}[]>([]);

  const { user } = useUser();

  const requestSeasons = useCallback(
    async (seasons: Season[]) => {
      if (!user.worksheet) return; // Not logged in
      const fetches = seasons.map(async (season) => {
        // Racy preemptive check of cache.
        // We cannot check courseLoadAttempted here, since that is set prior
        // to the data actually being loaded.
        if (season in courseData) return;

        // Add to cache.
        setRequests((r) => r + 1);
        try {
          await addToCache(season);
        } finally {
          setRequests((r) => r - 1);
        }
      });
      await Promise.all(fetches).catch((err) => {
        Sentry.captureException(err);
        toast.error('Failed to fetch course information');
        setErrors((e) => [...e, err]);
      });
    },
    [user.worksheet],
  );

  // If there's any error, we want to immediately stop "loading" and start
  // "erroring".
  const error = errors[0] ?? null;
  const loading = requests !== 0 && !error;

  const store: Store = useMemo(
    () => ({
      requests,
      loading,
      error,
      seasons: seasonsData as Season[],
      courses: courseData,
      requestSeasons,
    }),
    [loading, error, requests, requestSeasons],
  );

  return <FerryCtx.Provider value={store}>{children}</FerryCtx.Provider>;
}

export const useFerry = () => useContext(FerryCtx)!;
export const useCourseData = (seasons: Season[]) => {
  const { error, courses, requestSeasons } = useFerry();

  useEffect(() => {
    requestSeasons(seasons);
  }, [requestSeasons, seasons]);

  // If not everything is loaded, we're still loading.
  // But if we hit an error, stop loading immediately.
  const loading = !error && !seasons.every((season) => courses[season]);

  return { loading, error, courses };
};

export function useWorksheetInfo(
  worksheet: Worksheet | undefined,
  season: Season | null = null,
  worksheetNumber = '0',
) {
  const requiredSeasons = useMemo(() => {
    if (!worksheet || worksheet.length === 0) {
      // If the worksheet is empty, we don't want to request data for any
      // seasons, even if a specific season is requested.
      return [];
    }
    const seasons = new Set<Season>();
    worksheet.forEach((item) => {
      seasons.add(item[0]);
    });
    if (season !== null) {
      if (seasons.has(season)) return [season];
      return [];
    }
    return Array.from(seasons); // Idk just need to return something i think
  }, [season, worksheet]);

  const { loading, error, courses } = useCourseData(requiredSeasons);

  const data = useMemo(() => {
    const dataReturn: Listing[] = [];
    if (!worksheet) return dataReturn;

    // Resolve the worksheet items.
    for (const [seasonCode, crn, worksheetNumberCourse] of worksheet) {
      if (season !== null && season !== seasonCode) continue;

      if (
        courses &&
        seasonCode in courses &&
        worksheetNumberCourse === worksheetNumber
      ) {
        const course = courses[seasonCode].get(parseInt(crn, 10) as Crn);
        if (!course) {
          // This error is unactionable.
          // https://github.com/coursetable/coursetable/pull/1508
          // Sentry.captureException(
          //   new Error(
          //     `failed to resolve worksheet course ${seasonCode} ${crn}`,
          //   ),
          // );
        } else {
          dataReturn.push(course);
        }
      }
    }
    return dataReturn;
  }, [season, courses, worksheet, worksheetNumber]);
  return { loading, error, data };
}
