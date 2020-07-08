import React from 'react';

import SearchResultsItem from './SearchResultsItem';
import { flatten } from '../utilities';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';

import { Accordion } from 'react-bootstrap';

const App = ({ data }) => {
	const { width } = useWindowDimensions();

	const isMobile = width < 768;

	return (
		<Accordion className={Styles.results_container}>
			{data.map(course => (
				<SearchResultsItem course={flatten(course)} isMobile={isMobile} />
			))}
		</Accordion>
	);
};

export default App;
