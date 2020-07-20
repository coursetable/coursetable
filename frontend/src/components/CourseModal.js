import React, { useState } from 'react';
import { Badge, Col, Container, Row, Modal } from 'react-bootstrap';
import './CourseModal.css';
import CourseModalOverview from './CourseModalOverview';
import CourseModalEvaluations from './CourseModalEvaluations';
import tagStyles from './SearchResultsItem.module.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import styles from './CourseModal.module.css';
import { toSeasonString } from '../utilities';
import { SEARCH_AVERAGE_ACROSS_SEASONS } from '../queries/QueryStrings';
import { useQuery } from '@apollo/react-hooks';

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

  // CACHE PROFESSOR COURSES
  // const { loading, error, data } = useQuery(SEARCH_AVERAGE_ACROSS_SEASONS, {
  //   variables: {
  //     course_code: null,
  //     professor_name: listing.professors,
  //   },
  // });
  // if (loading || error)
  //   return (
  //     <Modal>
  //       <Modal.Body>Loading..</Modal.Body>
  //     </Modal>
  //   );

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
            {view[0] === 'overview' ? (
              <div>
                <Row className="m-auto">
                  <Modal.Title>
                    <Row className={'mx-auto mt-1 align-items-center'}>
                      <span className="modal-title">
                        {listing['course.title']}
                      </span>
                    </Row>
                  </Modal.Title>
                </Row>
                {(listing.skills || listing.areas) && (
                  <Row className={styles.badges + ' mx-auto mt-1 '}>
                    <p className={styles.course_codes + ' text-muted m-0 pr-2'}>
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
                )}
              </div>
            ) : (
              <div>
                <Row className="mx-auto mb-1">
                  <Col md="auto" className="my-auto p-0">
                    <div
                      onClick={() => setView(['overview', null])}
                      className={styles.back_arrow}
                    >
                      <IoMdArrowRoundBack size={30} />
                    </div>
                  </Col>
                  <Col className="p-0">
                    <Row className="m-auto">
                      <Modal.Title>
                        <Row className={'mx-auto mt-1 align-items-center'}>
                          <Row className="mx-auto mb-0">
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
                        </Row>
                      </Modal.Title>
                    </Row>
                    {view[1].professor !== '' && (
                      <Row className={styles.badges + ' mx-auto my-0 '}>
                        <p className={styles.course_codes + ' ml-3 text-muted'}>
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
        {view[0] === 'overview' ? (
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
        )}
      </Modal>
    </div>
  );
};

export default CourseModal;
