import React, { useState } from 'react';
import { Badge, Col, Container, Row, Modal } from 'react-bootstrap';
import './CourseModal.css';
import CourseModalOverview from './CourseModalOverview';
import CourseModalEvaluations from './CourseModalEvaluations';
import tagStyles from './SearchResultsItem.module.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import styles from './CourseModal.module.css';
import { toSeasonString } from '../utilities';
import WorksheetToggleButton from './WorksheetToggleButton';

const CourseModal = (props) => {
  const listing = props.listing;
  const [view, setView] = useState(['overview', null]);
  const [filter, setFilter] = useState('both');
  let course_codes, course_codes_str;
  if (listing) {
    course_codes = listing['course.computed_course_infos'][0].course_codes;
    course_codes_str = '';
    for (let i = 0; i < course_codes.length; i++) {
      if (i) course_codes_str += ' | ';
      course_codes_str += course_codes[i];
    }
  }

  const setSeason = (evaluation) => {
    setView([evaluation.season_code, evaluation]);
  };

  const hideModal = () => {
    setView(['overview', null]);
    setFilter('both');
    props.hideModal();
  };

  return (
    <div className="d-flex justify-content-center">
      <Modal
        show={props.show}
        scrollable={true}
        onHide={hideModal}
        dialogClassName="modal-custom-width"
        centered
      >
        <Modal.Header closeButton>
          <Container className="p-0" fluid>
            {view[0] === 'overview' ? (
              <div>
                <Row className="m-auto">
                  <Col xs="auto" className="my-auto p-0">
                    {listing && (
                      <WorksheetToggleButton
                        alwaysRed={false}
                        crn={listing.crn}
                        season_code={listing.season_code}
                        bookmark={true}
                        hasSeason={props.hasSeason}
                        className="p-0"
                      />
                    )}
                  </Col>
                  <Col className="p-0">
                    <Modal.Title>
                      <Row className={'mx-auto mt-1 align-items-center'}>
                        <span className="modal-title ml-3">
                          {listing['course.title']}
                        </span>
                      </Row>
                    </Modal.Title>

                    <Row className={styles.badges + ' mx-auto mt-1 '}>
                      <p
                        className={
                          styles.course_codes + ' text-muted ml-3 my-0 pr-2'
                        }
                      >
                        {course_codes_str}
                      </p>
                      {!listing.skills || (
                        <Badge
                          variant="secondary"
                          className={
                            tagStyles.tag + ' ' + tagStyles[listing.skills]
                          }
                        >
                          {listing.skills}
                        </Badge>
                      )}
                      {!listing.areas || (
                        <Badge
                          variant="secondary"
                          className={
                            tagStyles.tag + ' ' + tagStyles[listing.areas]
                          }
                        >
                          {listing.areas}
                        </Badge>
                      )}
                    </Row>
                  </Col>
                </Row>
              </div>
            ) : (
              <div>
                <Row className="m-auto">
                  <Col xs="auto" className="my-auto p-0">
                    <div
                      onClick={() => setView(['overview', null])}
                      className={styles.back_arrow}
                    >
                      <IoMdArrowRoundBack size={30} />
                    </div>
                  </Col>
                  <Col className="p-0">
                    <Modal.Title>
                      <Row className={'mx-auto mt-1 align-items-center'}>
                        <span className="modal-title ml-3">
                          {view[1].course_code + ' '} Evaluations
                          <span className="text-muted">
                            {' (' +
                              toSeasonString(view[0])[2] +
                              ' ' +
                              toSeasonString(view[0])[1] +
                              ')'}
                          </span>
                        </span>
                      </Row>
                    </Modal.Title>

                    {view[1].professor !== '' && (
                      <Row className={styles.badges + ' mx-auto mt-1 '}>
                        <p
                          className={
                            styles.course_codes + ' ml-3 my-0 text-muted'
                          }
                        >
                          {view[1].professor + ' | Section ' + view[1].section}
                        </p>
                      </Row>
                    )}
                  </Col>
                </Row>
              </div>
            )}
          </Container>
        </Modal.Header>
        {props.show &&
          (view[0] === 'overview' ? (
            <CourseModalOverview
              setFilter={setFilter}
              filter={filter}
              setSeason={setSeason}
              listing={listing}
            />
          ) : (
            <CourseModalEvaluations
              season_code={view[0]}
              crn={view[1].crn}
              course_code={view[1].course_code}
              setSeason={setSeason}
            />
          ))}
      </Modal>
    </div>
  );
};

export default CourseModal;
