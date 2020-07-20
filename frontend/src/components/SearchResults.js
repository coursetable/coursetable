import React from 'react';

import SearchResultsItem from './SearchResultsItem';
import { flatten } from '../utilities';

import CourseModal from '../components/CourseModal';

import { useWindowDimensions } from './WindowDimensionsProvider';

import Styles from './SearchResults.module.css';

import { Container, Card, Col, Row } from 'react-bootstrap';

import Sticky from 'react-sticky-el';

import GetCourseModal from '../queries/GetCourseModal';

const SearchResults = ({ data }) => {
	const { width } = useWindowDimensions();

	const isMobile = width < 768;

	const [courseModal, setCourseModal] = React.useState([false, '']);
	const [modalCalled, setModalCalled] = React.useState(false);

	var {
		executeGetCourseModal,
		called: _,
		loading: modalLoading,
		data: modalData,
	} = GetCourseModal();

	const hideModal = () => {
		setCourseModal([false, '']);
	};

	if (modalCalled) {
		if (modalLoading) {
			// setCourseModal([false, '']);
		} else {
			if (modalData) {
				setCourseModal([true, modalData[0]]);
				setModalCalled(false);
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
							setModalCalled={setModalCalled}
							executeGetCourseModal={executeGetCourseModal}
						/>
					))}
				</div>
			</Container>
			<CourseModal
				hideModal={hideModal}
				show={courseModal[0]}
				listing={courseModal[1]}
			/>
		</div>
	);
};

export default SearchResults;
