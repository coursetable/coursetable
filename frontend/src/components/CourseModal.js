import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './CourseModal.css';
import CourseModalOverview from './CourseModalOverview';
import CourseModalEvaluations from './CourseModalEvaluations';

const CourseModal = (props) => {
  const listing = props.listing;
  const [view, setView] = useState('overview');

  const setSeason = (season_code) => {
    // console.log(season_code);
    setView(season_code);
  };

  const hideModal = () => {
    setView('overview');
    props.hideModal();
  };

  return (
    <div className="d-flex justify-content-center">
      <Modal
        show={props.show}
        scrollable={true}
        onHide={hideModal}
        dialogClassName="modal-custom-width"
        // size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="modal-title">{listing['course.title']}</span>
          </Modal.Title>
        </Modal.Header>
        {view === 'overview' ? (
          <CourseModalOverview setSeason={setSeason} listing={listing} />
        ) : (
          <CourseModalEvaluations
            season_code={view}
            course_code={listing.course_code}
            setSeason={setSeason}
          />
        )}
      </Modal>
    </div>
  );
};

export default CourseModal;
