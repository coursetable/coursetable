import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { FcCloseUpMode } from 'react-icons/fc';
import { IoMdSunny } from 'react-icons/io';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import styled from 'styled-components';
import {
  ratingColormap,
  workloadColormap,
  subjectOptions,
} from '../../queries/Constants';

import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import CourseConflictIcon from './CourseConflictIcon';
import styles from './ResultsGridItem.module.css';
import tag_styles from './ResultsItem.module.css';
import { TextComponent, StyledIcon } from '../StyledComponents';
import type { Listing } from '../../utilities/common';
import {
  getOverallRatings,
  getWorkloadRatings,
} from '../../utilities/courseUtilities';

import { AiOutlineStar } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import { BiBookOpen } from 'react-icons/bi';
import SkillBadge from '../SkillBadge';

// Grid Item wrapper
const StyledGridItem = styled.div<{ inWorksheet: boolean }>`
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
 * @prop course data for the current course
 * @prop isLoggedIn is the user logged in?
 * @prop num_cols integer that holds how many columns in grid view
 * @prop multiSeasons are we displaying courses across multiple seasons
 */

function ResultsGridItem({
  course,
  isLoggedIn,
  num_cols,
  multiSeasons,
}: {
  course: Listing;
  isLoggedIn: boolean;
  num_cols: number;
  multiSeasons: boolean;
}) {
  const [, setSearchParams] = useSearchParams();
  // Bootstrap column width depending on the number of columns
  const col_width = 12 / num_cols;

  // Season code for this listing
  const { season_code } = course;
  const season = Number(season_code[5]);
  const year = season_code.substring(2, 4);
  // Size of season icons
  const icon_size = 13;
  const seasons = ['spring', 'summer', 'fall'] as const;
  // Determine the icon for this season
  const icon =
    season === 1 ? (
      <FcCloseUpMode className="my-auto" size={icon_size} />
    ) : season === 2 ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={icon_size} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={icon_size} />
    );

  // Fetch overall & workload rating values and string representations
  const course_rating = useMemo(
    () =>
      [
        getOverallRatings(course, false),
        getOverallRatings(course, true),
      ] as const,
    [course],
  );
  const workload_rating = useMemo(
    () =>
      [
        getWorkloadRatings(course, false),
        getWorkloadRatings(course, true),
      ] as const,
    [course],
  );

  // Is the current course in the worksheet?
  const [courseInWorksheet, setCourseInWorksheet] = useState(false);

  const [subject_code, course_code] = course.course_code.split(' ');

  return (
    <Col
      md={col_width}
      className={`${styles.container} px-2 pt-0 pb-3`}
      style={{ overflow: 'hidden' }}
    >
      <StyledGridItem
        onClick={() => {
          setSearchParams((prev) => {
            prev.set('course-modal', `${course.season_code}-${course.crn}`);
            return prev;
          });
        }}
        className={`${styles.one_line} ${styles.item_container} px-3 pb-3`}
        tabIndex={0}
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
                              .find(
                                (subject) => subject.value === subject_code,
                              )!
                              .label.substring(subject_code.length + 2)}
                          </small>
                        </Tooltip>
                      )}
                    >
                      <span>{subject_code}</span>
                    </OverlayTrigger>{' '}
                    {course_code}
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
                      tag_styles[seasons[season - 1]]
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
                  <SkillBadge skill={skill} key={skill} />
                ))}
                {course.areas.map((area) => (
                  <SkillBadge skill={area} key={area} />
                ))}
                {/* Render hidden badge as a spacer if no skills/areas */}
                {course.skills.length === 0 && course.areas.length === 0 && (
                  <SkillBadge skill="Hu" hidden />
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
                      color: course_rating[0]
                        ? ratingColormap(course_rating[0])
                            .darken()
                            .saturate()
                            .css()
                        : '#cccccc',
                    }}
                  >
                    {course_rating[1]}
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
                          ? ratingColormap(Number(course.professor_avg_rating))
                              .darken()
                              .saturate()
                              .css()
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
                        isLoggedIn && workload_rating[0]
                          ? workloadColormap(workload_rating[0])
                              .darken()
                              .saturate()
                              .css()
                          : '#cccccc',
                    }}
                  >
                    {isLoggedIn && workload_rating[1]}
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
          season_code={course.season_code}
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