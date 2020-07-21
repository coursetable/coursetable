import React from 'react';

import SearchResultsItem from './SearchResultsItem';

import CourseModal from '../components/CourseModal';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';

import { Container, Card, Col, Row } from 'react-bootstrap';

import Sticky from 'react-sticky-el';

import { useLazyQuery } from '@apollo/react-hooks';
import { GET_COURSE_MODAL } from '../queries/QueryStrings';
import { preprocess_courses, flatten } from '../utilities';

const SearchResults = ({ data }) => {
	const { width } = useWindowDimensions();

	const isMobile = width < 768;

	const [showModal, setShowModal] = React.useState(false);
	// const [modalCalled, setModalCalled] = React.useState(false);

	var [
		executeGetCourseModal,
		{ called: modalCalled, loading: modalLoading, data: modalData },
	] = useLazyQuery(GET_COURSE_MODAL);

	const hideModal = () => {
		setShowModal(false);
	};

	var modal;

	if (modalCalled) {
		if (modalLoading) {
			modal = <div>Loading...</div>;
		} else {
			if (modalData) {
				modal = (
					<CourseModal
						hideModal={hideModal}
						show={showModal}
						listing={preprocess_courses(flatten(modalData.listings[0]))}
					/>
				);
			}
		}
	}

	return (
		<div>
			<Container className={`shadow-sm ${Styles.results_container}`}>
				{!isMobile && (
					<Sticky>
						<Row
							className={`px-0 py-2 shadow-sm justify-content-between ${Styles.results_header_row}`}
						>
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
						<SearchResultsItem
							course={flatten(course)}
							isMobile={isMobile}
							setShowModal={setShowModal}
							executeGetCourseModal={executeGetCourseModal}
						/>
					))}
				</div>
			</Container>
			{modal}
		</div>
	);
};

export default SearchResults;
