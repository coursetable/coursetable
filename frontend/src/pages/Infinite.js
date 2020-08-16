import React, { Fragment, useState } from 'react';

import {
	SEARCH_COURSES,
	SEARCH_COURSES_TEXTLESS,
} from '../queries/QueryStrings';

import { useLazyQuery } from '@apollo/react-hooks';

import { CATALOG_QUERY_SIZE } from '../queries/Constants.js';

import InfiniteWrapper from '../components/InfiniteWrapper';

const Infinite = () => {
	var [items, setItems] = useState([]);

	var [currentPage, setCurrentPage] = useState(0);

	var [searching, setSearching] = useState(false);

	var [hasMoreItems, setHasMoreItems] = useState(true);

	var queryBase = {
		ordering: { title: 'asc' },
		offset: 0,
		limit: CATALOG_QUERY_SIZE,
		seasons: ['201903'],
		areas: null,
		skills: null,
		credits: null,
		schools: null,
		min_rating: 4,
		max_rating: null,
		min_workload: 1,
		max_workload: 2,
		extra_info: null,
	};

	var [
		executeTextlessSearch,
		{
			called: textlessCalled,
			loading: textlessLoading,
			data: textlessData,
			// fetchMore: textlessFetchMore, // Another way to fetch more queries when trying to implement InfiniteLoader
		},
	] = useLazyQuery(
		SEARCH_COURSES_TEXTLESS,
		{ fetchPolicy: 'no-cache' } // Doesn't cache results, so always search results always rerender on new search. Comment this out if implementing fetchMore
	);

	const _loadNextPage = (...args) => {
		// only load the next page if we are already not doing so
		if (!searching) {
			queryBase['offset'] = currentPage * CATALOG_QUERY_SIZE;
			console.log(queryBase);
			executeTextlessSearch({ variables: queryBase });

			console.log('loading next page');
		}
	};

	if (textlessCalled) {
		if (textlessLoading) {
			// we set the searching state here
			// so that the previous textlessData
			// is not repeated

			// if set in _loadNextPage,
			// the items are updated before
			// textlessData is refreshed
			if (!searching) {
				setSearching(true);
			}
			console.log('loading...');
		} else {

			if (textlessData && searching) {
				console.log('appending more courses...');
				console.log('new courses:', textlessData['computed_course_info']);

				var courses = textlessData['computed_course_info'];

				if(courses.length < CATALOG_QUERY_SIZE){
					setHasMoreItems(false);
				}

				setItems(items.concat(courses));
				setCurrentPage(currentPage + 1);
				setSearching(false);
			}
		}
	}

	console.log(textlessData);

	return (
		<InfiniteWrapper
			hasMoreItems={hasMoreItems}
			isNextPageLoading={textlessLoading}
			items={items}
			loadNextPage={_loadNextPage}
		/>
	);
};

export default Infinite;
