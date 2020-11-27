import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';
import AsyncLock from 'async-lock';
import { toast } from 'react-toastify';
import { flatten } from '../courseUtilities';
import _seasons from '../generated/seasons.json';

const FerryCtx = createContext(null);
FerryCtx.displayName = 'FerryCtx';

// Preprocess seasons data.
// We need to wrap this inside the "seasons" key of an object
// to maintain compatibility with the previous graphql version.
// TODO: once typescript is added here, we can easily find all
// the usages and remove the enclosing object.
const seasons = {
  seasons: [..._seasons].reverse(),
};

// Preprocess course data.
const preprocess_courses = (listing) => {
  // trim decimal points in ratings floats
  const RATINGS_PRECISION = 1;

  // Combine the list of skills into one string
  if ('course.skills' in listing) {
    listing['skills'] = listing['course.skills'].join(' ');
  }

  // Combine the list of areas into one string
  if ('course.areas' in listing) {
    listing['areas'] = listing['course.areas'].join(' ');
  }

  if ('course.evaluation_statistics' in listing) {
    const ratings = listing['course.evaluation_statistics'];

    if (ratings.length === 1) {
      const rating = ratings[0];
      // Trim ratings to one decimal point
      if ('avg_rating' in rating && rating['avg_rating'] !== null) {
        listing['avg_rating'] = rating['avg_rating'].toFixed(RATINGS_PRECISION);
      }
      if ('avg_workload' in rating && rating['avg_workload'] !== null) {
        listing['avg_workload'] = rating['avg_workload'].toFixed(
          RATINGS_PRECISION
        );
      }

      // Make enrollment data more accessible
      if ('enrollment' in rating) {
        if ('enrolled' in rating['enrollment']) {
          listing['enrolled'] = rating['enrollment']['enrolled'];
        }
      }
    }
  }

  // Combine array of professors into one string
  if ('professor_names' in listing && listing['professor_names'].length > 0) {
    listing['professors'] = listing['professor_names'].join(', ');
    // for the average professor rating, take the first professor
    if ('average_professor' in listing && listing['average_professor'] !== null)
      // Trim professor ratings to one decimal point
      listing['professor_avg_rating'] = listing['average_professor'].toFixed(
        RATINGS_PRECISION
      );
  }
  return listing;
};

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
  // Note that we track requests for force a re-render when
  // courseData changes.
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
      const fetches = seasons.map((season) => {
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
      Promise.all(fetches).catch((err) => {
        toast.error('Failed to fetch course information');
        console.error(err);
        addError(err);
      });
    },
    [diffRequests, addError]
  );

  // If there's any error, we want to immediately stop "loading" and start "erroring".
  const error = errors[0];
  const loading = requests !== 0 && !error;

  const store = useMemo(
    () => ({
      requests,
      loading,
      error: error,
      seasons,
      courses: courseData,
      requestSeasons,
    }),
    [loading, error, requests, requestSeasons]
  );

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
  // But if we hit an error, stop loading immediately.
  const loading = !error && !seasons.every((season) => courses[season]);

  return { loading, error, courses };
};
