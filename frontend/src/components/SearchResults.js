import React, { Component, useState } from 'react';

import SearchResultsItem from './SearchResultsItem';
import flatten from '../utilities';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';

import {Container} from 'react-bootstrap';

const App = ({data}) => {
	const { width } = useWindowDimensions();

	const isMobile = width < 768;

	return (
		<div>
			{data.map(course => (
				<SearchResultsItem course={flatten(course)} isMobile={isMobile} />
			))}
		</div>
	);
};

export default App;
