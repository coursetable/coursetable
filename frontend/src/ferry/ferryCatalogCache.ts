import AsyncLock from 'async-lock';

import {
  fetchCatalogMetadata,
  fetchCatalog,
  fetchEvals,
  type CatalogMetadata,
  type CatalogListing,
} from '../queries/api';
import type { Crn, Season } from '../queries/graphql-types';

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

const catalogListeners = new Set<() => void>();

export function subscribeToCatalogCache(listener: () => void): () => void {
  catalogListeners.add(listener);
  return () => {
    catalogListeners.delete(listener);
  };
}

function notifyCatalogCacheUpdated() {
  for (const listener of catalogListeners) listener();
}

export function getCourseData(): CourseData {
  return courseData;
}

export const resetCatalogCache = () => {
  courseData = {};
  catalogLoadAttempted.clear();
  evalsLoadAttempted.clear();
  notifyCatalogCacheUpdated();
};

const loadCatalog = (season: Season, includeEvals: boolean): Promise<void> =>
  courseDataLock.acquire(`load-${season}`, async () => {
    if (
      catalogLoadAttempted.has(season) &&
      (!includeEvals || evalsLoadAttempted.has(season))
    )
      return;

    const catalogPromise = (async () => {
      if (catalogLoadAttempted.has(season)) {
        if (courseData[season]) return null;
        catalogLoadAttempted.delete(season);
      }
      catalogLoadAttempted.add(season);
      try {
        const [data, metadata] = await Promise.all([
          fetchCatalog(season),
          fetchCatalogMetadata(),
        ]);
        if (!data || !metadata) {
          catalogLoadAttempted.delete(season);
          evalsLoadAttempted.delete(season);
          throw new Error('Failed to load catalog or metadata');
        }
        const catalogOldFormat = new Map<Crn, CatalogListing>();
        for (const course of data.values()) {
          for (const listing of course.listings)
            catalogOldFormat.set(listing.crn, { ...listing, course });
        }
        return { metadata, data: catalogOldFormat };
      } catch (err: unknown) {
        catalogLoadAttempted.delete(season);
        evalsLoadAttempted.delete(season);
        throw err;
      }
    })();

    const evalsPromise = (() => {
      if (evalsLoadAttempted.has(season) || !includeEvals)
        return Promise.resolve(null);
      evalsLoadAttempted.add(season);
      return fetchEvals(season)
        .then((evalsData) => {
          if (!evalsData) evalsLoadAttempted.delete(season);
          return evalsData;
        })
        .catch((err: unknown) => {
          evalsLoadAttempted.delete(season);
          throw err;
        });
    })();

    try {
      const [catalog, evals] = await Promise.all([
        catalogPromise,
        evalsPromise,
      ]);
      const seasonCatalog = catalog ?? courseData[season];
      if (!seasonCatalog) {
        catalogLoadAttempted.delete(season);
        evalsLoadAttempted.delete(season);
        throw new Error('No catalog data available for season');
      }
      if (evals) {
        const courseById = new Map<number, CatalogListing['course']>();
        for (const listing of seasonCatalog.data.values())
          courseById.set(listing.course.course_id, listing.course);
        for (const [courseId, ratings] of evals) {
          const course = courseById.get(courseId);
          if (course) Object.assign(course, ratings);
        }
      }
      courseData = {
        ...courseData,
        [season]: seasonCatalog,
      };
      notifyCatalogCacheUpdated();
    } catch (err: unknown) {
      if (!courseData[season]) {
        catalogLoadAttempted.delete(season);
        evalsLoadAttempted.delete(season);
      }
      throw err;
    }
  });

export function loadCatalogSeason(
  season: Season,
  includeEvals: boolean,
): Promise<void> {
  return loadCatalog(season, includeEvals);
}

export function shouldSkipCatalogRequest(
  season: Season,
  includeEvals: boolean,
): boolean {
  return (
    catalogLoadAttempted.has(season) &&
    (!includeEvals || evalsLoadAttempted.has(season))
  );
}
