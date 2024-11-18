import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as Sentry from '@sentry/react';
import AsyncLock from 'async-lock';
import { toast } from 'react-toastify';

import { useShallow } from 'zustand/react/shallow';
import type { WorksheetCourse } from './worksheetContext';
import seasonsData from '../generated/seasons.json';
import {
  fetchCatalogMetadata,
  fetchCatalog,
  fetchEvals,
  type UserWorksheets,
  type CatalogMetadata,
  type CatalogListing,
} from '../queries/api';
import type { Crn, Season } from '../queries/graphql-types';
import { useStore } from '../store';

export const seasons = seasonsData as Season[];

// Global course data cache.
const courseDataLock = new AsyncLock();
const catalogLoadAttempted = new Set<Season>();
const evalsLoadAttempted = new Set<Season>();

type CourseData = {
  [seasonCode: Season]: {
    metadata: CatalogMetadata;
    data: Map<Crn, CatalogListing>;
  };
};

let courseData: CourseData = {};
const loadCatalog = (season: Season, includeEvals: boolean): Promise<void> =>
  courseDataLock.acquire(`load-${season}`, async () => {
    // Both data have been loaded; nothing to do
    if (
      catalogLoadAttempted.has(season) &&
      (!includeEvals || evalsLoadAttempted.has(season))
    )
      return;
    const catalogPromise = (async () => {
      if (catalogLoadAttempted.has(season)) return null;
      catalogLoadAttempted.add(season);
      const [data, metadata] = await Promise.all([
        fetchCatalog(season),
        fetchCatalogMetadata(),
      ]);
      if (!data || !metadata) return null;
      // TODO: directly use the course-indexed data in frontend
      const catalogOldFormat = new Map<Crn, CatalogListing>();
      for (const course of data.values()) {
        for (const listing of course.listings)
          catalogOldFormat.set(listing.crn, { ...listing, course });
      }
      return { metadata, data: catalogOldFormat };
    })();
    const evalsPromise = (() => {
      if (evalsLoadAttempted.has(season) || !includeEvals)
        return Promise.resolve(null);
      evalsLoadAttempted.add(season);
      return fetchEvals(season);
    })();
    const [catalog, evals] = await Promise.all([catalogPromise, evalsPromise]);
    // Note! If we are fetching evals without fetching catalog, then a
    // previous request must have already fetched the catalog. This is
    // because we use async lock so two requests for the same season
    // cannot race. The only case where this happens is if the catalog
    // request fails because of network; in this case, the user should
    // refresh anyway
    const seasonCatalog = catalog ?? courseData[season];
    if (!seasonCatalog) return;
    if (evals) {
      const courseById = new Map<number, CatalogListing['course']>();
      for (const listing of seasonCatalog.data.values())
        courseById.set(listing.course.course_id, listing.course);
      for (const [courseId, ratings] of evals) {
        // All listings share the same reference to this object, so this will
        // affect the original catalog
        const course = courseById.get(courseId);
        if (course) {
          Object.assign(course, ratings);
        } else {
          // Unactionable error, courses may have failed to load
        }
      }
    }
    // Save in global cache. Here we force the creation of a new object.
    courseData = {
      ...courseData,
      [season]: seasonCatalog,
    };
  });

type Store = {
  requests: number;
  loading: boolean;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  error: {} | null;
  courses: CourseData;
  requestSeasons: (requestedSeasons: Season[]) => Promise<void>;
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

  const {
    authStatus,
    user: { hasEvals },
  } = useStore(
    useShallow((state) => ({
      authStatus: state.authStatus,
      user: state.user,
    })),
  );

  const requestSeasons = useCallback(
    async (requestedSeasons: Season[]) => {
      const fetches = requestedSeasons.map(async (season) => {
        // No data; this can happen if the course-modal query is invalid
        if (!seasons.includes(season)) return;
        const includeEvals = Boolean(
          authStatus === 'authenticated' && hasEvals,
        );
        // As long as there is one request in progress, don't fire another
        if (
          catalogLoadAttempted.has(season) &&
          (!includeEvals || evalsLoadAttempted.has(season))
        )
          return;

        // Add to cache.
        setRequests((r) => r + 1);
        try {
          await loadCatalog(season, includeEvals);
        } finally {
          setRequests((r) => r - 1);
        }
      });
      await Promise.all(fetches).catch((err: unknown) => {
        Sentry.captureException(err);
        toast.error('Failed to fetch course information');
        setErrors((e) => [...e, err as {}]);
      });
    },
    [authStatus, hasEvals],
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
export const useCourseData = (requestedSeasons: Season[]) => {
  const { error, courses, requestSeasons } = useFerry();

  useEffect(() => {
    void requestSeasons(requestedSeasons);
  }, [requestSeasons, requestedSeasons]);

  // If not everything is loaded, we're still loading.
  // But if we hit an error, stop loading immediately.
  const loading =
    !error && !requestedSeasons.every((season) => courses[season]);

  return { loading, error, courses };
};

export function useWorksheetInfo(
  worksheets: UserWorksheets | undefined,
  season: Season | Season[],
  worksheetNumber = 0,
) {
  const requestedSeasons = useMemo(() => {
    if (!worksheets) return [];
    if (Array.isArray(season)) return season.filter((x) => worksheets[x]);
    if (season in worksheets) return [season];
    return [];
  }, [season, worksheets]);

  const { loading, error, courses } = useCourseData(requestedSeasons);

  const data = useMemo(() => {
    const dataReturn: WorksheetCourse[] = [];
    if (!worksheets) return [];
    if (loading || error) return [];

    for (const seasonCode of requestedSeasons) {
      // Guaranteed to exist because of how requestedSeasons is constructed.
      const seasonWorksheets = worksheets[seasonCode]!;
      const worksheet = seasonWorksheets[worksheetNumber];
      if (!worksheet) continue;
      for (const { crn, color, hidden } of worksheet.courses) {
        const listing = courses[seasonCode]!.data.get(crn);
        if (listing) {
          dataReturn.push({
            crn,
            color,
            listing,
            hidden,
          });
        } else {
          // Unactionable error, courses may have failed to load
        }
      }
    }
    return dataReturn.sort((a, b) =>
      a.listing.course_code.localeCompare(b.listing.course_code, 'en-US'),
    );
  }, [requestedSeasons, courses, worksheets, worksheetNumber, loading, error]);
  return { loading, error, data };
}
