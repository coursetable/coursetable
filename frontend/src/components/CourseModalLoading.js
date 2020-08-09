import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const CourseModalLoading = props => {
	return (
		<Modal.Body
			className="text-center"
			style={{ paddingTop: '8rem', paddingBottom: '8rem' }}
		>
			<Spinner animation="border" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
		</Modal.Body>
	);
};

export default CourseModalLoading;
