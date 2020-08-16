import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const CourseModalLoading = () => {
  return (
    <Modal.Body className="d-flex">
      <Spinner className="m-auto" animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Modal.Body>
  );
};

export default CourseModalLoading;
