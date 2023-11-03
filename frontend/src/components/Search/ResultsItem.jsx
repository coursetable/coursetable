import React, { useState, useEffect, useMemo } from 'react';

import { Badge, OverlayTrigger, Popover, Tooltip, Row } from 'react-bootstrap';

import chroma from 'chroma-js';
import { IoMdSunny } from 'react-icons/io';
import { FcCloseUpMode } from 'react-icons/fc';
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
import {
  TextComponent,
  StyledPopover,
  StyledRating,
} from '../StyledComponents';

import Styles from './ResultsItem.module.css';
import {
  getEnrolled,
  getOverallRatings,
  getWorkloadRatings,
} from '../../utilities/courseUtilities';
import { breakpoints } from '../../utilities';

// Row for results item
const StyledResultsItem = styled(Row)`
  max-width: 1600px;
  user-select: none;
  overflow: hidden;
  position: relative;
  font-size: 13px;
  ${breakpoints('font-size', 'px', [{ 1320: 11 }])};
  line-height: 32px;
  ${breakpoints('line-height', 'px', [{ 1320: 28 }])};
`;

// Wrapper for row
const StyledSpacer = styled.div`
  outline: none !important;
  background-color: ${({ theme, inWorksheet }) =>
    inWorksheet ? theme.primary_light : 'inherit'};

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.select_hover};
  }
`;

// Rating cell within the row
const RatingCell = styled(StyledRating)`
  width: 100%;
  height: 100%;
  padding: 3px 10px;
  line-height: 1.5;
  ${breakpoints('font-size', 'px', [{ 1320: 11 }])};
`;

// Season and skills/areas tag
const Tag = styled(Badge)`
  margin: 1px;
  font-size: 13px;
  ${breakpoints('font-size', 'px', [{ 1320: 11 }])};
  font-weight: 600 !important;
  padding: 4px 6px !important;
  border-radius: 6px !important;
`;

/**
 * Renders a list item for a search result
 * @prop course - object | listing data for the current course
 * @prop showModal - function | shows the course modal for this listing
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 * @prop isFirst - boolean | is this the first course of the results?
 * @prop COL_SPACING - object | with widths of each column
 * @prop isScrolling - boolean | is the user scrolling? if so, hide bookmark and conflict icon
 * @prop fb_friends - array | of fb friends also taking this course
 */

function ResultsItem({
  course,
  showModal,
  multiSeasons,
  isFirst,
  COL_SPACING,
  isScrolling = false,
  fbFriends,
}) {
  // Has the component been mounted?
  const [mounted, setMounted] = useState(false);

  // Set mounted on mount
  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  const season = course.season_code[5];
  const year = course.season_code.substr(2, 2);
  const seasons = ['spring', 'summer', 'fall'];
  // Determine the icon for this season
  const icon =
    season === '1' ? (
      <FcCloseUpMode className="my-auto" size={10} />
    ) : season === '2' ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={10} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={10} />
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

  // Is the current course in the worksheet?
  const [courseInWorksheet, setCourseInWorksheet] = useState(false);

  const [subjectCode, courseCode] = course.course_code.split(' ');

  return (
    <StyledSpacer
      className={`${isFirst ? Styles.first_search_result_item : ''} ${
        course.extra_info !== 'ACTIVE' ? ` ${Styles.cancelled_class}` : ''
      }`}
      onClick={() => {
        showModal(course);
      }}
      tabIndex="0"
      inWorksheet={courseInWorksheet}
    >
      {/* Search Row Item */}
      <StyledResultsItem className="mx-auto pl-4 pr-2 py-0 justify-content-between">
        {/* Season */}
        {multiSeasons && (
          <div
            style={{
              width: `${COL_SPACING.SZN_WIDTH}px`,
              paddingLeft: '15px',
            }}
            className="d-flex"
          >
            <OverlayTrigger
              placement="top"
              overlay={(props) => (
                <Tooltip id="button-tooltip" {...props}>
                  <small>
                    {`${
                      seasons[season - 1].charAt(0).toUpperCase() +
                      seasons[season - 1].slice(1)
                    } ${course.season_code.substr(0, 4)}`}
                  </small>
                </Tooltip>
              )}
            >
              <div className={`${Styles.skills_areas} my-auto`}>
                <Tag
                  variant="secondary"
                  className={Styles[seasons[parseInt(season, 10) - 1]]}
                  key={season}
                >
                  <div style={{ display: 'inline-block' }}>{icon}</div>
                  &nbsp;{`'${year}`}
                </Tag>
              </div>
            </OverlayTrigger>
          </div>
        )}
        {/* Course Code */}
        <div
          style={{
            width: `${COL_SPACING.CODE_WIDTH}px`,
            paddingLeft: !multiSeasons ? '15px' : '0px',
          }}
          className={`${Styles.ellipsis_text} font-weight-bold`}
        >
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip id="button-tooltip" {...props}>
                <small>
                  {subjectOptions
                    .filter((subject) => {
                      return subject.value === subjectCode;
                    })[0]
                    .label.substring(subjectCode.length + 2)}
                </small>
              </Tooltip>
            )}
          >
            <span>{subjectCode}</span>
          </OverlayTrigger>{' '}
          {courseCode}
          <TextComponent type={1}>
            {course.section
              ? ` ${course.section.length > 1 ? '' : '0'}${course.section}`
              : ''}
          </TextComponent>
        </div>
        <OverlayTrigger
          placement="right"
          overlay={(props) => (
            <StyledPopover {...props} id="title_popover">
              <Popover.Title>
                <strong>
                  {course.extra_info !== 'ACTIVE' ? (
                    <span className={Styles.cancelled_text}>CANCELLED </span>
                  ) : (
                    ''
                  )}
                  {course.title}
                </strong>
              </Popover.Title>
              <Popover.Content>
                {course.description
                  ? course.description.length <= 500
                    ? course.description
                    : `${course.description.slice(0, 500)}...`
                  : 'no description'}
                <br />
                <div className="text-danger">
                  {course.requirements &&
                    (course.requirements.length <= 250
                      ? course.requirements
                      : `${course.requirements.slice(0, 250)}...`)}
                </div>
              </Popover.Content>
            </StyledPopover>
          )}
        >
          {/* Course Title */}
          <div style={{ width: `${COL_SPACING.TITLE_WIDTH}px` }}>
            <div className={Styles.ellipsis_text}>{course.title}</div>
          </div>
        </OverlayTrigger>
        <div className="d-flex">
          {/* Overall Rating */}
          <RatingCell
            rating={courseRating[0]}
            colormap={ratingColormap}
            style={{
              whiteSpace: 'nowrap',
              width: `${COL_SPACING.RATE_OVERALL_WIDTH}px`,
            }}
          >
            {courseRating[1]}
          </RatingCell>
          {/* Workload Rating */}
          <RatingCell
            rating={workloadRating[0]}
            colormap={workloadColormap}
            style={{
              whiteSpace: 'nowrap',
              width: `${COL_SPACING.RATE_WORKLOAD_WIDTH}px`,
            }}
          >
            {workloadRating[1]}
          </RatingCell>
          {/* Professor Rating & Course Professors */}
          <div
            style={{ width: `${COL_SPACING.PROF_WIDTH}px` }}
            className="d-flex align-items-center"
          >
            <div
              style={{
                whiteSpace: 'nowrap',
                minWidth: `${COL_SPACING.RATE_PROF_WIDTH}px`,
              }}
              className="mr-2 h-100"
            >
              <RatingCell
                rating={course.average_professor}
                colormap={ratingColormap}
              >
                {course.average_professor
                  ? course.average_professor.toFixed(1)
                  : 'N/A'}
              </RatingCell>
            </div>
            <div className={Styles.ellipsis_text}>
              {course.professor_names.length === 0
                ? 'TBA'
                : course.professor_names.join(' • ')}
            </div>
          </div>
        </div>
        {/* Previous Enrollment */}
        <div
          style={{ width: `${COL_SPACING.ENROLL_WIDTH}px` }}
          className="d-flex"
        >
          <span className="my-auto">{getEnrolled(course, true)}</span>
        </div>
        {/* Skills and Areas */}
        <div style={{ width: `${COL_SPACING.SA_WIDTH}px` }} className="d-flex">
          <span className={`${Styles.skills_areas} `}>
            {course.skills.map((skill, index) => (
              <Tag
                variant="secondary"
                className="my-auto"
                key={index}
                style={{
                  color: skillsAreasColors[skill],
                  backgroundColor: chroma(skillsAreasColors[skill])
                    .alpha(0.16)
                    .css(),
                }}
              >
                {skill}
              </Tag>
            ))}
            {course.areas.map((area, index) => (
              <Tag
                variant="secondary"
                className="my-auto"
                key={index}
                style={{
                  color: skillsAreasColors[area],
                  backgroundColor: chroma(skillsAreasColors[area])
                    .alpha(0.16)
                    .css(),
                }}
              >
                {area}
              </Tag>
            ))}
          </span>
        </div>
        {/* Course Meeting Days & Times */}
        <div style={{ width: `${COL_SPACING.MEET_WIDTH}px` }}>
          <div className={Styles.ellipsis_text}>{course.times_summary}</div>
        </div>
        {/* Course Location */}
        <div style={{ width: `${COL_SPACING.LOC_WIDTH}px` }}>
          <div className={Styles.ellipsis_text}>{course.locations_summary}</div>
        </div>
        {/* # FB Friends also shopping */}
        <div style={{ width: `${COL_SPACING.FB_WIDTH}px` }} className="d-flex ">
          <OverlayTrigger
            placement="top"
            overlay={(props) =>
              fbFriends.length > 0 ? (
                <Tooltip id="button-tooltip" {...props}>
                  {fbFriends.join(' • ')}
                </Tooltip>
              ) : (
                <div />
              )
            }
          >
            <span className="my-auto">
              {fbFriends.length > 0 ? fbFriends.length : ''}
            </span>
          </OverlayTrigger>
        </div>
        {/* Add/remove from worksheet button */}
        <div
          className={Styles.worksheet_btn}
          data-tutorial={isFirst && 'catalog-6'}
        >
          <WorksheetToggleButton
            crn={course.crn}
            seasonCode={course.season_code}
            modal={false}
            setCourseInWorksheet={setCourseInWorksheet}
          />
        </div>
        {/* Render conflict icon only when component has been mounted */}
        {mounted && !isScrolling && (
          <div className={Styles.conflict_error}>
            <CourseConflictIcon course={course} />
          </div>
        )}
      </StyledResultsItem>
    </StyledSpacer>
  );
}

export default React.memo(ResultsItem);
