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

import { fetchCatalog } from '../utilities/api';
import { useUser, type UserWorksheets } from './userContext';
import seasonsData from '../generated/seasons.json';
import type { WorksheetCourse } from './worksheetContext';
import type { Crn, Season, Listing } from '../utilities/common';

export const seasons = seasonsData as Season[];

// Global course data cache.
const courseDataLock = new AsyncLock();
const courseLoadAttempted = new Set<Season>();
let courseData: { [seasonCode: Season]: Map<Crn, Listing> } = {};
const addToCache = (season: Season): Promise<void> =>
  courseDataLock.acquire(`load-${season}`, async () => {
    if (courseLoadAttempted.has(season)) {
      // Skip if already loaded, or if we previously tried to load it.
      return;
    }

    // Log that we attempted to load this.
    courseLoadAttempted.add(season);

    const info = await fetchCatalog(season);
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
      if (!user.hasEvals) return; // Not logged in / doesn't have evals
      const fetches = seasons.map(async (season) => {
        // As long as there is one request in progress, don't fire another
        if (courseLoadAttempted.has(season)) return;

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
        setErrors((e) => [...e, err as {}]);
      });
    },
    [user.hasEvals],
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
  worksheets: UserWorksheets | undefined,
  season: Season | Season[],
  worksheetNumber = 0,
) {
  const requiredSeasons = useMemo(() => {
    if (!worksheets) return [];
    if (Array.isArray(season)) return season.filter((x) => worksheets[x]);
    if (season in worksheets) return [season];
    return [];
  }, [season, worksheets]);

  const { loading, error, courses } = useCourseData(requiredSeasons);

  const data = useMemo(() => {
    const dataReturn: WorksheetCourse[] = [];
    if (!worksheets) return [];
    if (loading || error) return [];

    // Resolve the worksheet items.
    for (const seasonCode of requiredSeasons) {
      // Guaranteed to exist because of how requiredSeasons is constructed.
      const seasonWorksheets = worksheets[seasonCode]!;
      const worksheet = seasonWorksheets[worksheetNumber];
      if (!worksheet) continue;
      for (const { crn, color } of worksheet) {
        const listing = courses[seasonCode]!.get(crn);
        if (!listing) {
          // This error is unactionable.
          // https://github.com/coursetable/coursetable/pull/1508
          // Sentry.captureException(
          //   new Error(
          //     `failed to resolve worksheet course ${seasonCode} ${crn}`,
          //   ),
          // );
        } else {
          dataReturn.push({
            crn,
            color,
            listing,
          });
        }
      }
    }
    return dataReturn.sort((a, b) =>
      a.listing.course_code.localeCompare(b.listing.course_code, 'en-US'),
    );
  }, [requiredSeasons, courses, worksheets, worksheetNumber, loading, error]);
  return { loading, error, data };
}
