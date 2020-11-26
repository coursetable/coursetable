import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { GET_SEASON_CODES } from '../queries/QueryStrings';

import { useQuery } from '@apollo/client';
import axios from 'axios';
import AsyncLock from 'async-lock';
import { toast } from 'react-toastify';
import { flatten, preprocess_courses } from '../utilities';

const FerryCtx = createContext(null);
FerryCtx.displayName = 'FerryCtx';

// Global course data cache.
const courseDataLock = new AsyncLock();
let courseLoadAttempted = {};
let courseData = {};
const addToCache = (season) => {
  return courseDataLock.acquire(`load-${season}`, () => {
    if (season in courseData || season in courseLoadAttempted) {
      // Skip if already loaded, or if we previously tried to load it.
      return;
    }

    // Log that we attempted to load this.
    courseLoadAttempted = {
      ...courseLoadAttempted,
      [season]: true,
    };

    return axios.get(`/api/static/catalogs/${season}.json`).then((res) => {
      // Convert season list into a crn lookup table.
      const data = res.data;
      const info = new Map();
      for (const raw_listing of data) {
        const listing = preprocess_courses(flatten(raw_listing));
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

// Fetch all seasons present in the database
export const FerryProvider = ({ children }) => {
  // Initialize season query function
  const {
    loading: seasonsLoading,
    data: seasonsData,
    error: seasonsError,
  } = useQuery(GET_SEASON_CODES);

  const [requests, setRequests] = useState(0);
  const diffRequests = useCallback(
    (diff) => {
      setRequests((requests) => requests + diff);
    },
    [setRequests]
  );

  const [errors, setErrors] = useState([]);
  const addError = useCallback(
    (err) => {
      setErrors((errors) => [...errors, err]);
    },
    [setErrors]
  );

  const requestSeasons = useCallback(
    (seasons) => {
      const requests = seasons.map((season) => {
        // Racy preemptive check of cache.
        // We cannot check courseLoadAttempted here, since that is set prior
        // to the data actually being loaded.
        if (season in courseData) {
          return true;
        }

        // Add to cache.
        diffRequests(+1);
        return addToCache(season).finally(() => {
          diffRequests(-1);
        });
      });
      Promise.all(requests).catch((err) => {
        toast.error('Failed to fetch course information');
        console.error(err);
        addError(err);
      });
    },
    [diffRequests, addError]
  );

  const error = seasonsError ? seasonsError : errors[0];

  const store = {
    seasonsLoading,
    // If there's any error, we want to immediately stop "loading" and start "erroring".
    loading: (seasonsLoading || requests !== 0) && !error,
    error: error,
    seasons: seasonsData || { seasons: [] },
    courses: courseData,
    requestSeasons,
  };

  return <FerryCtx.Provider value={store}>{children}</FerryCtx.Provider>;
};

export default FerryProvider;
export const useFerry = () => useContext(FerryCtx);
export const useCourseData = (seasons) => {
  const { error, courses, requestSeasons } = useFerry();

  useEffect(() => {
    requestSeasons(seasons);
  }, [requestSeasons, seasons]);

  // If not everything is loaded, we're still loading.
  const loading = !seasons.every((season) => courses[season]);

  return { loading, error, courses };
};
