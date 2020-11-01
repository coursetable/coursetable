import React, { createContext, useCallback, useContext, useState } from 'react';

import { GET_SEASON_CODES } from '../queries/QueryStrings';

import { useQuery } from '@apollo/react-hooks';
import { axios } from 'axios';

const FerryCtx = createContext(null);
FerryCtx.displayName = 'FerryCtx';

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

  const [courseData, setCourseData] = useState({});

  const requestSeasons = useCallback(
    (seasons) => {
      const requests = seasons.map(async (season) => {
        diffRequests(+1);
        const res = await axios.get(`/api/static/catalogs/${season}.json`);
        const info = res.data;
        setCourseData((courseData) => {
          return {
            ...courseData,
            season: info,
          };
        });
        diffRequests(-1);
      });
      requests.forEach((request) => {
        request.catch((err) => addError(err));
      });
    },
    [diffRequests, setCourseData, addError]
  );

  const store = {
    seasons: seasonsData || [],
    loading: seasonsLoading || requests !== 0,
    errors: [...[seasonsError ? [seasonsError] : []], ...errors],
    courses: courseData,
    requestSeasons,
  };

  return <FerryCtx.Provider value={store}>{children}</FerryCtx.Provider>;
};

export default FerryProvider;
export const useFerry = () => useContext(FerryCtx);
