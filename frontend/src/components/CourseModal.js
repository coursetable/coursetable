import React, { useState } from 'react';
import { Badge, Col, Container, Row, Modal } from 'react-bootstrap';

import CourseModalOverview from './CourseModalOverview';
import CourseModalEvaluations from './CourseModalEvaluations';

import { IoMdArrowRoundBack } from 'react-icons/io';
import { toSeasonString } from '../utilities';
import WorksheetToggleButton from './WorksheetToggleButton';
import { useWindowDimensions } from '../components/WindowDimensionsProvider';

import styles from './CourseModal.module.css';
import tag_styles from './SearchResultsItem.module.css';
import { skillsAreasColors } from '../queries/Constants.js';
import chroma from 'chroma-js';
import posthog from 'posthog-js';

/**
 * Displays course modal when clicking on a course
 * @prop listing - dictionary that holds listing info
 * @prop hideModal - function to hide modal
 * @prop show - boolean that determines when to show modal

 */

const CourseModal = ({ listing, hideModal, show }) => {
  // Fetch width of window
  const { width } = useWindowDimensions();
  // Switch to mobile view?
  const isMobile = width < 768;
  // Viewing overview or an evaluation? List contains [season code, listing info] for evaluations
  const [view, setView] = useState(['overview', null]);
  // Current evaluation filter (both, course, professor)
  const [filter, setFilter] = useState('both');

  // Set which evaluation we are viewing
  const setSeason = (evaluation) => {
    setView([evaluation.season_code, evaluation]);
  };

  // Called when hiding modal
  const handleHide = () => {
    posthog.capture('modal-hide');

    // Reset views and filters
    setView(['overview', null]);
    setFilter('both');
    hideModal();
  };
  // key variable for lists
  let key = 0;

  return (
    <div className="d-flex justify-content-center">
      <Modal
        show={show}
        scrollable={true}
        onHide={handleHide}
        dialogClassName="modal-custom-width"
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Container className="p-0" fluid>
            {view[0] === 'overview' ? (
              // Viewing Course Overview
              <div>
                <Row className="m-auto">
                  <Col xs="auto" className="my-auto p-0">
                    {/* Show worksheet add/remove button */}
                    {listing && (
                      <WorksheetToggleButton
                        worksheetView={false}
                        crn={listing.crn ? listing.crn : listing['listing.crn']}
                        season_code={listing.season_code}
                        modal={true}
                      />
                    )}
                  </Col>
                  <Col className="p-0 ml-3">
                    {/* Course Title */}
                    <Modal.Title>
                      <Row className={'mx-auto mt-1 align-items-center'}>
                        <span
                          className={
                            isMobile ? 'modal-title-mobile' : 'modal-title'
                          }
                        >
                          {listing.extra_info !== 'ACTIVE' ? (
                            <span className={styles.cancelled_text}>
                              CANCELLED{' '}
                            </span>
                          ) : (
                            ''
                          )}
                          {listing.title}
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
                      {/* Course Codes */}
                      <p
                        className={
                          styles.course_codes + ' text-muted my-0 pr-2'
                        }
                      >
                        {listing.all_course_codes &&
                          listing.all_course_codes.join(' • ')}
                      </p>
                      {/* Course Skills and Areas */}
                      {listing.skills &&
                        listing.skills.map((skill) => (
                          <Badge
                            variant="secondary"
                            className={tag_styles.tag}
                            style={{
                              color: skillsAreasColors[skill],
                              backgroundColor: chroma(skillsAreasColors[skill])
                                .alpha(0.16)
                                .css(),
                            }}
                            key={key++}
                          >
                            {skill}
                          </Badge>
                        ))}
                      {listing.areas &&
                        listing.areas.map((area) => (
                          <Badge
                            variant="secondary"
                            className={tag_styles.tag}
                            style={{
                              color: skillsAreasColors[area],
                              backgroundColor: chroma(skillsAreasColors[area])
                                .alpha(0.16)
                                .css(),
                            }}
                            key={key++}
                          >
                            {area}
                          </Badge>
                        ))}
                    </Row>
                  </Col>
                </Row>
              </div>
            ) : (
              // Viewing course evaluation
              <div>
                <Row className="m-auto">
                  <Col xs="auto" className="my-auto p-0">
                    {/* Back to overview arrow */}
                    <div
                      onClick={() => {
                        setView(['overview', null]);
                      }}
                      className={styles.back_arrow}
                    >
                      <IoMdArrowRoundBack size={30} />
                    </div>
                  </Col>
                  <Col className="p-0 ml-3">
                    {/* Course Title */}
                    <Modal.Title>
                      <Row className={'mx-auto mt-1 align-items-center'}>
                        <span
                          className={
                            isMobile ? 'modal-title-mobile' : 'modal-title'
                          }
                        >
                          {view[1].title + ' '}
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

                    <Row className={styles.badges + ' mx-auto mt-1 '}>
                      {/* Course Code */}
                      <p
                        className={
                          styles.course_codes + '  my-0 text-muted pr-2'
                        }
                      >
                        {view[1].course_code}
                      </p>
                      {/* Course Skills and Areas */}
                      {view[1].skills &&
                        view[1].skills.map((skill) => (
                          <Badge
                            variant="secondary"
                            className={tag_styles.tag}
                            style={{
                              color: skillsAreasColors[skill],
                              backgroundColor: chroma(skillsAreasColors[skill])
                                .alpha(0.16)
                                .css(),
                            }}
                            key={key++}
                          >
                            {skill}
                          </Badge>
                        ))}
                      {view[1].areas &&
                        view[1].areas.map((area) => (
                          <Badge
                            variant="secondary"
                            className={tag_styles.tag}
                            style={{
                              color: skillsAreasColors[area],
                              backgroundColor: chroma(skillsAreasColors[area])
                                .alpha(0.16)
                                .css(),
                            }}
                            key={key++}
                          >
                            {area}
                          </Badge>
                        ))}
                      {/* Course Professors and Section */}
                      {view[1].professor !== ['TBA'] && (
                        <p
                          className={
                            styles.course_codes +
                            '  my-0 text-muted' +
                            (view[1].skills.length || view[1].areas.length
                              ? ' pl-2 '
                              : '')
                          }
                        >
                          {'| ' +
                            view[1].professor.join(', ') +
                            ' | Section ' +
                            view[1].section}
                        </p>
                      )}
                    </Row>
                  </Col>
                </Row>
              </div>
            )}
          </Container>
        </Modal.Header>
        {show &&
          (view[0] === 'overview' ? (
            // Show overview data
            <CourseModalOverview
              setFilter={setFilter}
              filter={filter}
              setSeason={setSeason}
              listing={listing}
            />
          ) : (
            // Show eval data
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

export default React.memo(CourseModal);
