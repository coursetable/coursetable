import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants';
import chroma from 'chroma-js';

import WorksheetToggleButton from './WorksheetToggleButton';
import CourseConflictIcon from './CourseConflictIcon';
import styles from './SearchResultsGridItem.module.css';
import tag_styles from './SearchResultsItem.module.css';
import { FcCloseUpMode } from 'react-icons/fc';
import { IoMdSunny } from 'react-icons/io';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { TextComponent, StyledIcon } from './StyledComponents';
import { ReactComponent as Star } from '../images/catalog_icons/star.svg';
import { ReactComponent as Teacher } from '../images/catalog_icons/teacher.svg';
import { ReactComponent as Book } from '../images/catalog_icons/book.svg';
import styled from 'styled-components';
import { getOverallRatings } from '../courseUtilities';

const StyledGridItem = styled.div`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgb(245, 245, 245)' : theme.surface[1]};
  transition: background-color 0.2s linear;
  &:hover {
    background-color: ${({ theme }) => theme.select_hover};
  }
`;

/**
 * Renders a grid item for a search result
 * @prop course - listing data for the current course
 * @prop showModal - function that shows the course modal for this listing
 * @prop isLoggedIn - boolean | is the user logged in?
 * @prop num_cols - integer that holds how many columns in grid view
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 */

const SearchResultsGridItem = ({
  course,
  showModal,
  isLoggedIn,
  num_cols,
  multiSeasons,
}) => {
  // How many decimal points to use in ratings
  const RATINGS_PRECISION = 1;
  // Bootstrap column width depending on the number of columns
  const col_width = 12 / num_cols;
  // Season code for this listing
  const season_code = course.season_code;
  const season = season_code[5];
  const year = season_code.substr(2, 2);
  // Size of season icons
  const icon_size = 13;
  const seasons = ['spring', 'summer', 'fall'];
  // Determine the icon for this season
  const icon = useMemo(() => {
    return season === '1' ? (
      <FcCloseUpMode className="my-auto" size={icon_size} />
    ) : season === '2' ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={icon_size} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={icon_size} />
    );
  }, [season]);

  // Fetch overall rating value and string representation
  const course_rating = useMemo(() => getOverallRatings(course), [course]);

  // Has the component been mounted yet?
  const [mounted, setMounted] = useState(false);

  // Set mounted on mount
  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  // Variable used in list keys
  let key = 0;

  // Tooltip for hovering over season
  const season_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>
        {seasons[season - 1].charAt(0).toUpperCase() +
          seasons[season - 1].slice(1) +
          ' ' +
          season_code.substr(0, 4)}
      </small>
    </Tooltip>
  );

  // Tooltip for hovering over class rating
  const class_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Class</span>
    </Tooltip>
  );

  // Tooltip for hovering over professor rating
  const prof_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Professor</span>
    </Tooltip>
  );

  // Tooltip for hovering over workload rating
  const workload_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Workload</span>
    </Tooltip>
  );

  return (
    <Col
      md={col_width}
      className={styles.container + ' px-2 pt-0 pb-3'}
      style={{ overflow: 'hidden' }}
    >
      <StyledGridItem
        onClick={() => {
          showModal(course);
        }}
        className={styles.one_line + ' ' + styles.item_container + ' px-3 pb-3'}
        tabIndex="0"
      >
        <Row className="m-auto">
          {/* Course Code */}
          <Col xs={multiSeasons ? 8 : 12} className="p-0">
            <Row className="mx-auto mt-3">
              <small className={styles.course_codes}>
                {course.course_code ? course.course_code : ''}
                {course.section
                  ? ' ' +
                    (course.section.length > 1 ? '' : '0') +
                    course.section
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
                  delay={{ show: 500, hide: 250 }}
                  overlay={season_tooltip}
                >
                  <div
                    className={
                      styles.season_tag +
                      ' ml-auto px-1 pb-0 ' +
                      tag_styles[seasons[parseInt(season) - 1]]
                    }
                  >
                    <Row className="m-auto">
                      {icon}
                      <small style={{ fontWeight: 550 }}>
                        &nbsp;{"'" + year}
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
                className={styles.one_line + ' ' + styles.professors}
              >
                {course.professor_names.length > 0
                  ? course.professor_names.join(' • ')
                  : 'Professor: TBA'}
              </TextComponent>
            </Row>
            {/* Course Times */}
            <Row className="m-auto">
              <small className={styles.one_line + ' ' + styles.small_text}>
                <TextComponent type={1}>
                  {course.times_summary === 'TBA'
                    ? 'Times: TBA'
                    : course.times_summary}
                </TextComponent>
              </small>
            </Row>
            {/* Course Location */}
            <Row className="m-auto">
              <small className={styles.one_line + ' ' + styles.small_text}>
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
                      color: skillsAreasColors['Hu'],
                      backgroundColor: chroma(skillsAreasColors['Hu'])
                        .alpha(0.16)
                        .css(),
                      opacity: 0,
                    }}
                  >
                    {'Hu'}
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
                delay={{ show: 500, hide: 250 }}
                overlay={class_tooltip}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    // Only show eval data when user is signed in
                    className={styles.rating + ' mr-1'}
                    style={{
                      color: course_rating
                        ? ratingColormap(course_rating).darken().saturate()
                        : '#cccccc',
                    }}
                  >
                    {
                      // String representation of rating to be displayed
                      course.average_rating_same_professors
                        ? course_rating // Use same professor if possible. Displayed as is
                        : course.average_rating
                        ? `~${course_rating}` // Use all professors otherwise and add tilda ~
                        : 'N/A' // No ratings at all
                    }
                  </div>
                  <StyledIcon>
                    <Star className={styles.icon} />
                  </StyledIcon>
                </Row>
              </OverlayTrigger>
              {/* Professor Rating */}
              <OverlayTrigger
                placement="right"
                delay={{ show: 500, hide: 250 }}
                overlay={prof_tooltip}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    // Only show eval data when user is signed in
                    className={styles.rating + ' mr-1'}
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
                    <Teacher className={styles.prof_icon} />
                  </StyledIcon>
                </Row>
              </OverlayTrigger>
              {/* Workload Rating */}
              <OverlayTrigger
                placement="right"
                delay={{ show: 500, hide: 250 }}
                overlay={workload_tooltip}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    // Only show eval data when user is signed in
                    className={styles.rating + ' mr-1'}
                    style={{
                      color:
                        course.average_workload && isLoggedIn
                          ? workloadColormap(course.average_workload)
                              .darken()
                              .saturate()
                          : '#cccccc',
                    }}
                  >
                    {course.average_workload && isLoggedIn
                      ? course.average_workload.toFixed(RATINGS_PRECISION)
                      : 'N/A'}
                  </div>
                  <StyledIcon>
                    <Book className={styles.icon} />
                  </StyledIcon>
                </Row>
              </OverlayTrigger>
            </div>
          </Col>
        </Row>
      </StyledGridItem>
      {/* Bookmark Button */}
      <div className={styles.worksheet_btn}>
        {
          <WorksheetToggleButton
            worksheetView={false}
            crn={course.crn}
            season_code={course.season_code}
            modal={false}
          />
        }
      </div>
      {/* Render conflict icon only when component has been mounted */}
      {mounted && (
        <div className={styles.conflict_error}>
          <CourseConflictIcon course={course} />
        </div>
      )}
    </Col>
  );
};

export default SearchResultsGridItem;
