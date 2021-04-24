import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';
import { expectType, TypeOf } from 'ts-expect';
import AsyncLock from 'async-lock';
import { toast } from 'react-toastify';
import _seasons from '../generated/seasons.json';
import { CatalogBySeasonQuery } from '../generated/graphql';
import { Crn, Season, Weekdays } from '../common';
import * as Sentry from '@sentry/react';

import { API_ENDPOINT } from '../config';

// Preprocess seasons data.
// We need to wrap this inside the "seasons" key of an object
// to maintain compatibility with the previous graphql version.
// TODO: once typescript is fully added, we can easily find all
// the usages and remove the enclosing object.
const seasons = {
  seasons: [..._seasons].reverse(),
};

type _RawListingResponse = CatalogBySeasonQuery['computed_listing_info'][number];
type _ListingOverrides = {
  season_code: Season;

  // Narrow some of the JSON types.
  all_course_codes: string[];
  areas: string[];
  skills: string[];
  professor_names: string[];
  times_by_day: Partial<
    Record<
      Weekdays,
      [
        string, // start time
        string, // end time
        string, // location
        string // location URL
      ][] // an array because there could by multiple times per day
    >
  >;
};
type _ListingAugments = {
  // Add a couple types created by the preprocessing step.
  professors?: string;
  professor_avg_rating?: string;
  color?: string;
  border?: string;
};
expectType<
  // Make sure we don't override a key that wasn't there originally.
  TypeOf<keyof _RawListingResponse, keyof _ListingOverrides>
>(true);
export type Listing = Omit<_RawListingResponse, keyof _ListingOverrides> &
  _ListingOverrides &
  _ListingAugments;

// Preprocess course data.
const preprocessCourses = (listing: Listing) => {
  // trim decimal points in ratings floats
  const RATINGS_PRECISION = 1;

  // Combine array of professors into one string
  if ('professor_names' in listing && listing.professor_names.length > 0) {
    listing.professors = listing.professor_names.join(', ');
    // for the average professor rating, take the first professor
    if ('average_professor' in listing && listing.average_professor !== null)
      // Trim professor ratings to one decimal point
      listing.professor_avg_rating = listing.average_professor.toFixed(
        RATINGS_PRECISION
      );
  }
  return listing;
};

// Global course data cache.
const courseDataLock = new AsyncLock();
let courseLoadAttempted: Record<Season, boolean> = {};
let courseData: Record<Season, Map<Crn, Listing>> = {};
const addToCache = (season: Season): Promise<void> => {
  return courseDataLock.acquire(`load-${season}`, () => {
    if (season in courseData || season in courseLoadAttempted) {
      // Skip if already loaded, or if we previously tried to load it.
      return Promise.resolve();
    }

    // Log that we attempted to load this.
    courseLoadAttempted = {
      ...courseLoadAttempted,
      [season]: true,
    };

    return axios
      .get(`${API_ENDPOINT}/api/static/catalogs/${season}.json`, {
        withCredentials: true,
      })
      .then((res) => {
        // Convert season list into a crn lookup table.
        const data = res.data as Listing[];
        const info = new Map<Crn, Listing>();
        for (const rawListing of data) {
          const listing = preprocessCourses(rawListing);
          info.set(listing.crn, listing);
        }

        // Save in global cache. Here we force the creation of a new object.
        courseData = {
          ...courseData,
          [season]: info,
        };
      });
  });
};

type Store = {
  requests: number;
  loading: boolean;
  error: string | null;
  seasons: typeof seasons;
  courses: typeof courseData;
  requestSeasons(seasons: Season[]): void;
};

const FerryCtx = createContext<Store | undefined>(undefined);
FerryCtx.displayName = 'FerryCtx';

const FerryProvider: React.FC = ({ children }) => {
  // Note that we track requests for force a re-render when
  // courseData changes.
  const [requests, setRequests] = useState(0);
  const diffRequests = useCallback(
    (diff) => {
      setRequests((requests) => requests + diff);
    },
    [setRequests]
  );

  const [errors, setErrors] = useState<string[]>([]);
  const addError = useCallback(
    (err) => {
      setErrors((errors) => [...errors, err]);
    },
    [setErrors]
  );

  const requestSeasons = useCallback(
    (seasons: Season[]) => {
      const fetches = seasons.map((season) => {
        // Racy preemptive check of cache.
        // We cannot check courseLoadAttempted here, since that is set prior
        // to the data actually being loaded.
        if (season in courseData) {
          return Promise.resolve();
        }

        // Add to cache.
        diffRequests(+1);
        return addToCache(season).finally(() => {
          diffRequests(-1);
        });
      });
      Promise.all(fetches).catch((err) => {
        toast.error('Failed to fetch course information');
        Sentry.captureException(err);
        addError(err);
      });
    },
    [diffRequests, addError]
  );

  // If there's any error, we want to immediately stop "loading" and start "erroring".
  const error = errors[0] ?? null;
  const loading = requests !== 0 && !error;

  const store: Store = useMemo(
    () => ({
      requests,
      loading,
      error,
      seasons,
      courses: courseData,
      requestSeasons,
    }),
    [loading, error, requests, requestSeasons]
  );

  return <FerryCtx.Provider value={store}>{children}</FerryCtx.Provider>;
};

export default FerryProvider;
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
