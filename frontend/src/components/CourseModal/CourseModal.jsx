import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Col, Container, Row, Modal } from 'react-bootstrap';

import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import styled from 'styled-components';
import CourseModalOverview from './CourseModalOverview';
import CourseModalEvaluations from './CourseModalEvaluations';

import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';

import styles from './CourseModal.module.css';
import { TextComponent, StyledLink } from '../StyledComponents';
import SkillBadge from '../SkillBadge';
import { toSeasonString } from '../../utilities/courseUtilities';
import { useCourseData } from '../../contexts/ferryContext';
import { toast } from 'react-toastify';

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

function CourseModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const url = window.location.href;

  const courseModal = searchParams.get('course-modal');
  const [seasonCode, crn] = courseModal ? courseModal.split('-') : [null, null];
  const { courses } = useCourseData(seasonCode ? [seasonCode] : []);

  const listing = courses[seasonCode]?.get(Number(crn));

  // share button
  const ShareButton = ({ courseCode, urlToShare }) => {
    const copyToClipboard = () => {
      const textToCopy = `${courseCode} -- CourseTable: ${urlToShare}`;
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          toast.success('Course and URL copied to clipboard!');
        },
        (err) => {
          console.error('Error copying to clipboard: ', err);
        },
      );
    };

    return (
      <FaRegShareFromSquare
        onClick={copyToClipboard}
        size={25}
        color="#007bff"
        style={{ cursor: 'pointer' }}
      />
    );
  };
  // Fetch current device
  const { isMobile } = useWindowDimensions();
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

  return (
    <div className="d-flex justify-content-center">
      {cur_listing && (
        <StyledModal
          show={Boolean(listing)}
          scrollable
          onHide={() => {
            // Reset views and filters
            setView(['overview', null]);
            setFilter('both');
            setSearchParams((prev) => {
              prev.delete('course-modal');
              return prev;
            });
          }}
          dialogClassName="modal-custom-width"
          animation={false}
          centered
        >
          <Modal.Header closeButton className="d-flex justify-content-between">
            <Container className="p-0" fluid>
              {view[0] === 'overview' ? (
                // Viewing Course Overview
                <div>
                  <Row className="m-auto modal-top">
                    <Col xs="auto" className="my-auto p-0">
                      {/* Show worksheet add/remove button */}
                      {cur_listing &&
                        (listings.length === 1 ? (
                          // If this is the initial listing, show worksheet toggle button
                          <WorksheetToggleButton
                            crn={cur_listing.crn}
                            season_code={cur_listing.season_code}
                            modal
                            selectedWorksheet={cur_listing.current_worksheet}
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
                              {` (${toSeasonString(cur_listing.season_code)})`}
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
                            <SkillBadge skill={skill} key={skill} />
                          ))}
                        {cur_listing.areas &&
                          cur_listing.areas.map((area) => (
                            <SkillBadge skill={area} key={area} />
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
                              {` (${toSeasonString(view[0])})`}
                            </TextComponent>
                            <StyledMoreInfo
                              className="mt-auto ml-2"
                              onClick={() => {
                                // Go to overview page of this eval course
                                setView(['overview', null]);
                                const new_listing = { ...view[1].listing };
                                new_listing.eval = view[1];
                                setListings([...listings, new_listing]);
                              }}
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
                            <SkillBadge skill={skill} key={skill} />
                          ))}
                        {view[1].areas &&
                          view[1].areas.map((area) => (
                            <SkillBadge skill={area} key={area} />
                          ))}
                        {/* Course Professors and Section */}
                        {view[1].professor[0] !== 'TBA' && (
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
            {/* Share Button */}
            <div className="align-self-center">
              <ShareButton
                courseCode={cur_listing.course_code}
                urlToShare={url}
              />
            </div>
          </Modal.Header>
          {listing &&
            (view[0] === 'overview' ? (
              // Show overview data
              <CourseModalOverview
                setFilter={setFilter}
                filter={filter}
                setSeason={(evaluation) => {
                  setView([evaluation.season_code, evaluation]);
                }}
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
}

export default CourseModal;
