import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

/**
 * Displays loading page for course modal
 */

const CourseModalLoading: React.VFC = () => {
  return (
    <Modal.Body className="d-flex">
      <Spinner className="m-auto" animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Modal.Body>
  );
};

export default CourseModalLoading;
