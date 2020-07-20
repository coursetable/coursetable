import React from 'react';

import SearchResultsItem from './SearchResultsItem';
import { flatten } from '../utilities';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';

import { Container, Card, Col, Row } from 'react-bootstrap';

import Sticky from 'react-sticky-el';

const App = ({ data }) => {
	const { width } = useWindowDimensions();

	const isMobile = width < 768;

	return (
		<Container className={`shadow-sm ${Styles.results_container}`}>
			{!isMobile && (
				<Sticky>
					<Row className={`px-0 py-2 shadow-sm justify-content-between ${Styles.results_header_row}`}>
						<Col md={4}>Description</Col>
						<Col md={2}>Rating</Col>
						<Col md={2}>Workload</Col>
						<Col md={2}>Areas</Col>
						<Col md={2}></Col>
					</Row>
				</Sticky>
			)}
			<div className="px-2">
				{data.map(course => (
					<SearchResultsItem course={flatten(course)} isMobile={isMobile} />
				))}
			</div>
		</Container>
	);
};

export default App;
