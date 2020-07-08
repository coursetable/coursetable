import React from 'react';

import SearchResultsItem from './SearchResultsItem';
import { flatten } from '../utilities';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';

import { Accordion, Card, Col, Row } from 'react-bootstrap';

const App = ({ data }) => {
	const { width } = useWindowDimensions();

	const isMobile = width < 768;

	return (
		<Accordion className={Styles.results_container}>
			{!isMobile && (
				<div className={'m-0 pl-2 pr-3 ' + Styles.results_header}>
					<Card key={-1} className={'pl-3 pr-3 ' + Styles.results_header_card}>
						<Card.Header className={Styles.results_header_inner}>
							<Row className={'px-0 justify-content-between'}>
								<Col md={4}>Description</Col>
								<Col md={2}>Rating</Col>
								<Col md={2}>Workload</Col>
								<Col md={2}>Areas</Col>
								<Col md={2}></Col>
							</Row>
						</Card.Header>
					</Card>
				</div>
			)}
			<div style={{paddingTop:'2rem'}}>
				{data.map(course => (
					<SearchResultsItem course={flatten(course)} isMobile={isMobile} />
				))}
			</div>
		</Accordion>
	);
};

export default App;
