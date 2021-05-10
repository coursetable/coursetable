import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Col, Container, Row, Modal } from 'react-bootstrap';

import { IoMdArrowRoundBack } from 'react-icons/io';
import chroma from 'chroma-js';
import posthog from 'posthog-js';
import styled from 'styled-components';
import CourseModalOverview from './CourseModalOverview';
import CourseModalEvaluations from './CourseModalEvaluations';

import WorksheetToggleButton from './WorksheetToggleButton';
import { useWindowDimensions } from './WindowDimensionsProvider';

import styles from './CourseModal.module.css';
import tag_styles from './SearchResultsItem.module.css';
import { skillsAreasColors } from '../queries/Constants';
import { TextComponent, StyledLink } from './StyledComponents';
import { toSeasonString } from '../courseUtilities';

// Course Modal
const StyledModal = styled(Modal)`
  .modal-content {
    background-color: ${({ theme }) => theme.surface[0]};
    .modal-header {
      .close {
        color: ${({ theme }) => theme.text[0]};
      }
    }
  }
`;

// More info button
const StyledMoreInfo = styled.span`
  padding: 3px 5px;
  font-size: 14px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.multivalue};
  color: ${({ theme }) => theme.text[0]};
  font-weight: 500;
  &:hover {
    filter: brightness(80%);
    cursor: pointer;
  }
`;

const extra_info_map = {
  ACTIVE: 'ACTIVE',
  MOVED_TO_SPRING_TERM: 'MOVED TO SPRING',
  CANCELLED: 'CANCELLED',
  MOVED_TO_FALL_TERM: 'MOVED TO FALL',
  CLOSED: 'CLOSED',
  NUMBER_CHANGED: 'NUMBER CHANGED',
};

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
  // Stack for listings that the user has viewed
  const [listings, setListings] = useState([]);
  useEffect(() => {
    setListings([listing]);
  }, [listing]);
  // Current listing that we are viewing overview info for
  const cur_listing =
    listings.length > 0 ? listings[listings.length - 1] : null;

  // Set which evaluation we are viewing
  const setSeason = useCallback((evaluation) => {
    setView([evaluation.season_code, evaluation]);
  }, []);

  // Called when hiding modal
  const handleHide = useCallback(() => {
    posthog.capture('modal-hide');

    // Reset views and filters
    setView(['overview', null]);
    setFilter('both');
    hideModal();
  }, [hideModal]);

  // Called when user requests more info about a course from the eval page.
  const handleMoreInfo = useCallback(() => {
    // Go to overview page of this eval course
    setView(['overview', null]);
    const new_listing = { ...view[1].listing };
    new_listing.eval = view[1];
    setListings([...listings, new_listing]);
  }, [listings, view]);

  // key variable for lists
  let key = 0;

  return (
    <div className="d-flex justify-content-center">
      {cur_listing && (
        <StyledModal
          show={show}
          scrollable
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
                      {cur_listing &&
                        (listings.length === 1 ? (
                          // If this is the initial listing, show worksheet toggle button
                          <WorksheetToggleButton
                            worksheetView={false}
                            crn={cur_listing.crn}
                            season_code={cur_listing.season_code}
                            modal
                          />
                        ) : (
                          // If this is the overview of some other eval course, show back button
                          <StyledLink
                            onClick={() => {
                              // Go back to the evaluations of this course
                              setView([
                                cur_listing.season_code,
                                cur_listing.eval,
                              ]);
                            }}
                            className={styles.back_arrow}
                          >
                            <IoMdArrowRoundBack size={30} />
                          </StyledLink>
                        ))}
                    </Col>
                    <Col className="p-0 ml-3">
                      {/* Course Title */}
                      <Modal.Title>
                        <Row className="mx-auto mt-1 align-items-center">
                          <span
                            className={
                              isMobile ? 'modal-title-mobile' : 'modal-title'
                            }
                          >
                            {cur_listing.extra_info !== 'ACTIVE' ? (
                              <span className={styles.cancelled_text}>
                                {extra_info_map[cur_listing.extra_info]}{' '}
                              </span>
                            ) : (
                              ''
                            )}
                            {cur_listing.title}
                            <TextComponent type={2}>
                              {` (${
                                toSeasonString(cur_listing.season_code)[2]
                              } ${toSeasonString(cur_listing.season_code)[1]})`}
                            </TextComponent>
                          </span>
                        </Row>
                      </Modal.Title>

                      <Row className={`${styles.badges} mx-auto mt-1 `}>
                        {/* Course Codes */}
                        <p className={`${styles.course_codes} my-0 pr-2`}>
                          <TextComponent type={2}>
                            {cur_listing.all_course_codes &&
                              cur_listing.all_course_codes.join(' • ')}
                          </TextComponent>
                        </p>
                        {/* Course Skills and Areas */}
                        {cur_listing.skills &&
                          cur_listing.skills.map((skill) => (
                            <Badge
                              variant="secondary"
                              className={tag_styles.tag}
                              style={{
                                color: skillsAreasColors[skill],
                                backgroundColor: chroma(
                                  skillsAreasColors[skill]
                                )
                                  .alpha(0.16)
                                  .css(),
                              }}
                              key={key++}
                            >
                              {skill}
                            </Badge>
                          ))}
                        {cur_listing.areas &&
                          cur_listing.areas.map((area) => (
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
                      <StyledLink
                        onClick={() => {
                          if (
                            listings.length > 1 &&
                            cur_listing.crn === view[1].crn &&
                            cur_listing.season_code === view[1].season_code
                          ) {
                            // Go to overview of previous listing
                            setListings(listings.slice(0, listings.length - 1));
                          }
                          setView(['overview', null]);
                        }}
                        className={styles.back_arrow}
                      >
                        <IoMdArrowRoundBack size={30} />
                      </StyledLink>
                    </Col>
                    <Col className="p-0 ml-3">
                      {/* Course Title */}
                      <Modal.Title>
                        <Row className="mx-auto mt-1 align-items-center">
                          <span
                            className={
                              isMobile ? 'modal-title-mobile' : 'modal-title'
                            }
                          >
                            {`${view[1].title} `}
                            <TextComponent type={2}>
                              {` (${toSeasonString(view[0])[2]} ${
                                toSeasonString(view[0])[1]
                              })`}
                            </TextComponent>
                            <StyledMoreInfo
                              className="mt-auto ml-2"
                              onClick={handleMoreInfo}
                            >
                              More Info
                            </StyledMoreInfo>
                          </span>
                        </Row>
                      </Modal.Title>

                      <Row className={`${styles.badges} mx-auto mt-1 `}>
                        {/* Course Code */}
                        <p className={`${styles.course_codes}  my-0 pr-2`}>
                          <TextComponent type={2}>
                            {view[1].course_code}
                          </TextComponent>
                        </p>
                        {/* Course Skills and Areas */}
                        {view[1].skills &&
                          view[1].skills.map((skill) => (
                            <Badge
                              variant="secondary"
                              className={tag_styles.tag}
                              style={{
                                color: skillsAreasColors[skill],
                                backgroundColor: chroma(
                                  skillsAreasColors[skill]
                                )
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
                            className={`${styles.course_codes}  my-0 ${
                              view[1].skills.length || view[1].areas.length
                                ? ' pl-2 '
                                : ''
                            }`}
                          >
                            <TextComponent type={2}>
                              {`| ${view[1].professor.join(', ')} | Section ${
                                view[1].section
                              }`}
                            </TextComponent>
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
                listing={cur_listing}
              />
            ) : (
              // Show eval data
              <CourseModalEvaluations
                season_code={view[0]}
                crn={view[1].crn}
                course_code={view[1].course_code}
              />
            ))}
        </StyledModal>
      )}
    </div>
  );
};

export default React.memo(CourseModal);
