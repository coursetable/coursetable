import React, { createContext, useContext, useState, useEffect } from 'react';

import { GET_SEASON_CODES } from '../queries/QueryStrings';

import { useLazyQuery } from '@apollo/react-hooks';

const SeasonsCtx = createContext(null);

const SeasonsProvider = ({ children }) => {
	var [
		executeGetSeasons,
		{ called: seasonsCalled, loading: seasonsLoading, data: seasonsData },
	] = useLazyQuery(GET_SEASON_CODES);

	useEffect(() => {
		executeGetSeasons();
	}, []);

	return (
		<SeasonsCtx.Provider value={seasonsData ? seasonsData : []}>
			{children}
		</SeasonsCtx.Provider>
	);
};

export default SeasonsProvider;
export const useSeasons = () => useContext(SeasonsCtx);
