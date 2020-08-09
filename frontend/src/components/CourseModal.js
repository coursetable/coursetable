import React, { useState } from 'react';
import { Badge, Col, Container, Row, Modal, Spinner } from 'react-bootstrap';

import CourseModalOverview from './CourseModalOverview';
import CourseModalEvaluations from './CourseModalEvaluations';
import CourseModalLoading from './CourseModalLoading';

import { IoMdArrowRoundBack } from 'react-icons/io';
import { toSeasonString } from '../utilities';
import WorksheetToggleButton from './WorksheetToggleButton';
import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import { unflattenTimesModal } from '../utilities';

import styles from './CourseModal.module.css';
import tag_styles from './SearchResultsItem.module.css';
import { skillsAreasColors } from '../queries/Constants.js';
import chroma from 'chroma-js';

const CourseModal = props => {
  const is_partial = props.listing === null;
  const listing = !is_partial ? props.listing : props.partial_listing;
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [view, setView] = useState(['overview', null]);
  const [filter, setFilter] = useState('both');
  let course_codes, course_codes_str;
  if (listing) {
    course_codes = is_partial
      ? listing.course_codes
      : listing['course.computed_course_infos'][0].course_codes;
    course_codes_str = '';
    for (let i = 0; i < course_codes.length; i++) {
      if (i) course_codes_str += ' | ';
      course_codes_str += course_codes[i];
    }
  }

  const setSeason = evaluation => {
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
                        crn={is_partial ? 69420 : listing.crn}
                        season_code={listing.season_code}
                        modal={true}
                        hasSeason={props.hasSeason}
                        className="p-0"
                        times={unflattenTimesModal(props.listing)}
                      />
                    )}
                  </Col>
                  <Col className="p-0 ml-3">
                    <Modal.Title>
                      <Row className={'mx-auto mt-1 align-items-center'}>
                        <span
                          className={
                            isMobile ? 'modal-title-mobile' : 'modal-title'
                          }
                        >
                          {is_partial ? listing.title : listing['course.title']}
                          <span className="text-muted">
                            {' (' +
                              toSeasonString(listing.season_code)[2] +
                              ' ' +
                              toSeasonString(listing.season_code)[1] +
                              ')'}
                          </span>
                        </span>
                      </Row>
                    </Modal.Title>

                    <Row className={styles.badges + ' mx-auto mt-1 '}>
                      <p
                        className={
                          styles.course_codes + ' text-muted my-0 pr-2'
                        }
                      >
                        {course_codes_str}
                      </p>
                      {listing['course.skills'] &&
                        listing['course.skills'].map(skill => (
                          <Badge
                            variant="secondary"
                            className={tag_styles.tag}
                            style={{
                              color: skillsAreasColors[skill.toUpperCase()],
                              backgroundColor: chroma(
                                skillsAreasColors[skill.toUpperCase()]
                              )
                                .alpha(0.16)
                                .css(),
                            }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      {listing['course.areas'] &&
                        listing['course.areas'].map(area => (
                          <Badge
                            variant="secondary"
                            className={tag_styles.tag}
                            style={{
                              color: skillsAreasColors[area.toUpperCase()],
                              backgroundColor: chroma(
                                skillsAreasColors[area.toUpperCase()]
                              )
                                .alpha(0.16)
                                .css(),
                            }}
                          >
                            {area}
                          </Badge>
                        ))}
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
                  <Col className="p-0 ml-3">
                    <Modal.Title>
                      <Row className={'mx-auto mt-1 align-items-center'}>
                        <span
                          className={
                            isMobile ? 'modal-title-mobile' : 'modal-title'
                          }
                        >
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
                          className={styles.course_codes + '  my-0 text-muted'}
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
            is_partial ? (
              <CourseModalLoading/>
            ) : (
              <CourseModalOverview
                setFilter={setFilter}
                filter={filter}
                setSeason={setSeason}
                listing={listing}
              />
            )
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
