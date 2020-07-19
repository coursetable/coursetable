import React, { useState } from 'react';
import { Badge, Col, Container, Row, Modal } from 'react-bootstrap';
import './CourseModal.css';
import CourseModalOverview from './CourseModalOverview';
import CourseModalEvaluations from './CourseModalEvaluations';
import tagStyles from './SearchResultsItem.module.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import styles from './CourseModal.module.css';
import { toSeasonString } from '../utilities';

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
          <Container className="p-0" fluid>
            <Row className="m-auto">
              <Modal.Title>
                <Row className={'mx-auto mt-1 align-items-center'}>
                  {view !== 'overview' ? (
                    <Row className="mx-auto mb-2">
                      <div
                        onClick={() => setSeason('overview')}
                        className={styles.back_arrow}
                      >
                        <IoMdArrowRoundBack size={30} />
                      </div>
                      <span className="modal-title ml-3">
                        {/*listing.course_code + ' '*/} Student Evaluations
                        <span className="text-muted">
                          {' (' +
                            toSeasonString(view)[2] +
                            ' ' +
                            toSeasonString(view)[1] +
                            ')'}
                        </span>
                      </span>
                    </Row>
                  ) : (
                    <span className="modal-title">
                      {listing['course.title']}
                    </span>
                  )}
                </Row>
              </Modal.Title>
            </Row>
            {view === 'overview' && (listing.skills || listing.areas) && (
              <Row className={styles.badges + ' mx-auto mt-1'}>
                {!listing.skills || (
                  <Badge
                    variant="secondary"
                    className={tagStyles.tag + ' ' + tagStyles[listing.skills]}
                  >
                    {listing.skills}
                  </Badge>
                )}
                {!listing.areas || (
                  <Badge
                    variant="secondary"
                    className={tagStyles.tag + ' ' + tagStyles[listing.areas]}
                  >
                    {listing.areas}
                  </Badge>
                )}
              </Row>
            )}
          </Container>
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
