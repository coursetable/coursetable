import React, { useMemo, useState } from 'react';
import { Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

import chroma from 'chroma-js';
import { FcCloseUpMode } from 'react-icons/fc';
import { IoMdSunny } from 'react-icons/io';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import styled from 'styled-components';
import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
  subjectOptions,
} from '../../queries/Constants';

import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import CourseConflictIcon from './CourseConflictIcon';
import styles from './ResultsGridItem.module.css';
import tag_styles from './ResultsItem.module.css';
import { TextComponent, StyledIcon } from '../StyledComponents';
import {
  getOverallRatings,
  getWorkloadRatings,
} from '../../utilities/courseUtilities';

import { AiOutlineStar } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import { BiBookOpen } from 'react-icons/bi';

// Grid Item wrapper
const StyledGridItem = styled.div`
  background-color: ${({ theme, inWorksheet }) =>
    inWorksheet
      ? theme.primary_light
      : theme.theme === 'light'
      ? 'rgb(245, 245, 245)'
      : theme.surface[1]};
  transition:
    border-color ${({ theme }) => theme.trans_dur},
    background-color ${({ theme }) => theme.trans_dur},
    color ${({ theme }) => theme.trans_dur};
  &:hover {
    background-color: ${({ theme }) => theme.select_hover};
  }
`;

/**
 * Renders a grid item for a search result
 * @prop course - object | listing data for the current course
 * @prop isLoggedIn - boolean | is the user logged in?
 * @prop num_cols - number | integer that holds how many columns in grid view
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 * @prop showModal - function | to display course modal
 */

function ResultsGridItem({
  course,
  isLoggedIn,
  numCols,
  multiSeasons,
  showModal,
}) {
  // Bootstrap column width depending on the number of columns
  const colWidth = 12 / numCols;

  const season = course.season_code[5];
  const year = course.season_code.substr(2, 2);
  const seasons = ['spring', 'summer', 'fall'];
  // Determine the icon for this season
  const icon =
    season === '1' ? (
      <FcCloseUpMode className="my-auto" size={13} />
    ) : season === '2' ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={13} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={13} />
    );

  // Fetch overall & workload rating values and string representations
  const courseRating = useMemo(
    () => [
      String(getOverallRatings(course, false)),
      getOverallRatings(course, true),
    ],
    [course],
  );
  const workloadRating = useMemo(
    () => [
      String(getWorkloadRatings(course, false)),
      getWorkloadRatings(course, true),
    ],
    [course],
  );

  // Variable used in list keys
  let key = 0;

  // Is the current course in the worksheet?
  const [courseInWorksheet, setCourseInWorksheet] = useState(false);

  const subjectCode = course.course_code
    ? course.course_code.split(' ')[0]
    : '';
  const courseCode = course.course_code ? course.course_code.split(' ')[1] : '';

  return (
    <Col
      md={colWidth}
      className={`${styles.container} px-2 pt-0 pb-3`}
      style={{ overflow: 'hidden' }}
    >
      <StyledGridItem
        onClick={() => {
          showModal(course);
        }}
        className={`${styles.one_line} ${styles.item_container} px-3 pb-3`}
        tabIndex="0"
        inWorksheet={courseInWorksheet}
      >
        <Row className="m-auto">
          {/* Course Code */}
          <Col xs={multiSeasons ? 8 : 12} className="p-0">
            <Row className="mx-auto mt-3">
              <small className={styles.course_codes}>
                {course.course_code && (
                  <>
                    <OverlayTrigger
                      placement="top"
                      overlay={(props) => (
                        <Tooltip id="button-tooltip" {...props}>
                          <small>
                            {subjectOptions
                              .find((subject) => subject.value === subjectCode)
                              .label.substring(subjectCode.length + 2)}
                          </small>
                        </Tooltip>
                      )}
                    >
                      <span>{subjectCode}</span>
                    </OverlayTrigger>{' '}
                    {courseCode}
                  </>
                )}
                {course.section
                  ? ` ${course.section.length > 1 ? '' : '0'}${course.section}`
                  : ''}
              </small>
            </Row>
          </Col>
          {/* Season tag */}
          {multiSeasons && (
            <Col xs={4} className="p-0">
              <Row className="m-auto">
                <OverlayTrigger
                  placement="top"
                  overlay={(props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      <small>
                        {`${
                          seasons[season - 1].charAt(0).toUpperCase() +
                          seasons[season - 1].slice(1)
                        } ${season_code.substr(0, 4)}`}
                      </small>
                    </Tooltip>
                  )}
                >
                  <div
                    className={`${styles.season_tag} ml-auto px-1 pb-0 ${
                      tag_styles[seasons[parseInt(season, 10) - 1]]
                    }`}
                  >
                    <Row className="m-auto">
                      {icon}
                      <small style={{ fontWeight: 550 }}>
                        &nbsp;{`'${year}`}
                      </small>
                    </Row>
                  </div>
                </OverlayTrigger>
              </Row>
            </Col>
          )}
        </Row>
        {/* Course Title */}
        <Row className="m-auto">
          <strong className={styles.one_line}>{course.title}</strong>
        </Row>
        <Row className="m-auto justify-content-between">
          <Col xs={7} className="p-0">
            {/* Course Professors */}
            <Row className="m-auto">
              <TextComponent
                type={1}
                className={`${styles.one_line} ${styles.professors}`}
              >
                {course.professor_names.length > 0
                  ? course.professor_names.join(' • ')
                  : 'Professor: TBA'}
              </TextComponent>
            </Row>
            {/* Course Times */}
            <Row className="m-auto">
              <small className={`${styles.one_line} ${styles.small_text}`}>
                <TextComponent type={1}>
                  {course.times_summary === 'TBA'
                    ? 'Times: TBA'
                    : course.times_summary}
                </TextComponent>
              </small>
            </Row>
            {/* Course Location */}
            <Row className="m-auto">
              <small className={`${styles.one_line} ${styles.small_text}`}>
                <TextComponent type={1}>
                  {course.locations_summary === 'TBA'
                    ? 'Location: TBA'
                    : course.locations_summary}
                </TextComponent>
              </small>
            </Row>
            {/* Course Skills and Areas */}
            <Row className="m-auto">
              <div className={tag_styles.skills_areas}>
                {course.skills.map((skill) => (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag}
                    key={key++}
                    style={{
                      color: skillsAreasColors[skill],
                      backgroundColor: chroma(skillsAreasColors[skill])
                        .alpha(0.16)
                        .css(),
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
                {course.areas.map((area) => (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag}
                    key={key++}
                    style={{
                      color: skillsAreasColors[area],
                      backgroundColor: chroma(skillsAreasColors[area])
                        .alpha(0.16)
                        .css(),
                    }}
                  >
                    {area}
                  </Badge>
                ))}
                {/* Render hidden badge as a spacer if no skills/areas */}
                {course.skills.length === 0 && course.areas.length === 0 && (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag}
                    key={key++}
                    style={{
                      color: skillsAreasColors.Hu,
                      backgroundColor: chroma(skillsAreasColors.Hu)
                        .alpha(0.16)
                        .css(),
                      opacity: 0,
                    }}
                  >
                    Hu
                  </Badge>
                )}
              </div>
            </Row>
          </Col>
          <Col xs={5} className="p-0 d-flex align-items-end">
            <div className="ml-auto">
              {/* Class Rating */}
              <OverlayTrigger
                placement="right"
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    <span>Class</span>
                  </Tooltip>
                )}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    // Only show eval data when user is signed in
                    className={`${styles.rating} mr-1`}
                    style={{
                      color: courseRating[0]
                        ? ratingColormap(courseRating[0]).darken().saturate()
                        : '#cccccc',
                    }}
                  >
                    {courseRating[1]}
                  </div>
                  <StyledIcon>
                    <AiOutlineStar className={styles.icon} />
                  </StyledIcon>
                </Row>
              </OverlayTrigger>
              {/* Professor Rating */}
              <OverlayTrigger
                placement="right"
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    <span>Professor</span>
                  </Tooltip>
                )}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    // Only show eval data when user is signed in
                    className={`${styles.rating} mr-1`}
                    style={{
                      color:
                        course.professor_avg_rating && isLoggedIn
                          ? ratingColormap(course.professor_avg_rating)
                              .darken()
                              .saturate()
                          : '#cccccc',
                    }}
                  >
                    {course.professor_avg_rating && isLoggedIn
                      ? course.professor_avg_rating
                      : 'N/A'}
                  </div>
                  <StyledIcon>
                    <IoPersonOutline className={styles.prof_icon} />
                  </StyledIcon>
                </Row>
              </OverlayTrigger>
              {/* Workload Rating */}
              <OverlayTrigger
                placement="right"
                overlay={(props) => (
                  <Tooltip id="button-tooltip" {...props}>
                    <span>Workload</span>
                  </Tooltip>
                )}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    // Only show eval data when user is signed in
                    className={`${styles.rating} mr-1`}
                    style={{
                      color:
                        isLoggedIn && workloadRating[0]
                          ? workloadColormap(workloadRating[0])
                              .darken()
                              .saturate()
                          : '#cccccc',
                    }}
                  >
                    {isLoggedIn && workloadRating[1]}
                  </div>
                  <StyledIcon>
                    <BiBookOpen className={styles.icon} />
                  </StyledIcon>
                </Row>
              </OverlayTrigger>
            </div>
          </Col>
        </Row>
      </StyledGridItem>
      {/* Add/remove from worksheet button */}
      <div className={styles.worksheet_btn}>
        <WorksheetToggleButton
          crn={course.crn}
          seasonCode={course.season_code}
          modal={false}
          setCourseInWorksheet={setCourseInWorksheet}
        />
      </div>
      {/* Render conflict icon */}
      <div className={styles.conflict_error}>
        <CourseConflictIcon course={course} />
      </div>
    </Col>
  );
}

export default ResultsGridItem;
