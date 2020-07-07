import React, { useState } from 'react';
import { Row, Modal } from 'react-bootstrap';

const CourseModal = props => {
  return (
    <div>
      <Modal show={true} onHide={props.hideModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{props.listing['course.title']}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{props.listing['course.description']}</Modal.Body>
      </Modal>
    </div>
  );
};

export default CourseModal;
