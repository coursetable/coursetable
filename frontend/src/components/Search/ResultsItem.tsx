import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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

import styles from './ResultsItem.module.css';
import {
  getEnrolled,
  getOverallRatings,
  getWorkloadRatings,
} from '../../utilities/courseUtilities';
import { breakpoints } from '../../utilities';
import type { Listing } from '../../utilities/common';

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
const StyledSpacer = styled.div<{ inWorksheet: boolean }>`
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
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 * @prop isFirst - boolean | is this the first course of the results?
 * @prop COL_SPACING - object | with widths of each column
 * @prop isScrolling - boolean | is the user scrolling? if so, hide bookmark and conflict icon
 * @prop friends - array | of friends also taking this course
 */

function ResultsItem({
  course,
  multiSeasons,
  isFirst,
  COL_SPACING,
  isScrolling = false,
  friends,
}: {
  course: Listing;
  multiSeasons: boolean;
  isFirst: boolean;
  COL_SPACING: any;
  isScrolling: boolean;
  friends: string[];
}) {
  const [, setSearchParams] = useSearchParams();
  // Has the component been mounted?
  const [mounted, setMounted] = useState(false);

  // Set mounted on mount
  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  // Season code for this listing
  const { season_code } = course;
  const season = Number(season_code[5]);
  const year = season_code.substring(2, 4);
  // Size of season icons
  const icon_size = 10;
  const seasons = ['spring', 'summer', 'fall'] as const;
  // Determine the icon for this season
  const icon = useMemo(() => {
    return season === 1 ? (
      <FcCloseUpMode className="my-auto" size={icon_size} />
    ) : season === 2 ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={icon_size} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={icon_size} />
    );
  }, [season]);

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

  // Column width styles
  const szn_style: React.CSSProperties = {
    width: `${COL_SPACING.SZN_WIDTH}px`,
    paddingLeft: '15px',
  };
  const code_style: React.CSSProperties = {
    width: `${COL_SPACING.CODE_WIDTH}px`,
    paddingLeft: !multiSeasons ? '15px' : '0px',
  };
  const title_style: React.CSSProperties = {
    width: `${COL_SPACING.TITLE_WIDTH}px`,
  };
  const rate_overall_style: React.CSSProperties = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_OVERALL_WIDTH}px`,
  };
  const rate_workload_style: React.CSSProperties = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_WORKLOAD_WIDTH}px`,
  };
  const rate_prof_style: React.CSSProperties = {
    whiteSpace: 'nowrap',
    minWidth: `${COL_SPACING.RATE_PROF_WIDTH}px`,
  };
  const prof_style: React.CSSProperties = {
    width: `${COL_SPACING.PROF_WIDTH}px`,
  };
  const meet_style: React.CSSProperties = {
    width: `${COL_SPACING.MEET_WIDTH}px`,
  };
  const loc_style: React.CSSProperties = {
    width: `${COL_SPACING.LOC_WIDTH}px`,
  };
  const enroll_style: React.CSSProperties = {
    width: `${COL_SPACING.ENROLL_WIDTH}px`,
  };
  const fb_style: React.CSSProperties = { width: `${COL_SPACING.FB_WIDTH}px` };
  const sa_style: React.CSSProperties = { width: `${COL_SPACING.SA_WIDTH}px` };

  const [subject_code, course_code] = course.course_code.split(' ');

  return (
    <StyledSpacer
      className={`${isFirst ? styles.first_search_result_item : ''} ${
        course.extra_info !== 'ACTIVE' ? ` ${styles.cancelled_class}` : ''
      }`}
      onClick={() => {
        setSearchParams((prev) => {
          prev.set('course-modal', `${course.season_code}-${course.crn}`);
          return prev;
        });
      }}
      tabIndex={0}
      inWorksheet={courseInWorksheet}
    >
      {/* Search Row Item */}
      <StyledResultsItem className="mx-auto pl-4 pr-2 py-0 justify-content-between">
        {/* Season */}
        {multiSeasons && (
          <div style={szn_style} className="d-flex">
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
              <div className={`${styles.skills_areas} my-auto`}>
                <Tag
                  variant="secondary"
                  className={styles[seasons[season - 1]]}
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
          style={code_style}
          className={`${styles.ellipsis_text} font-weight-bold`}
        >
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip id="button-tooltip" {...props}>
                <small>
                  {subjectOptions
                    .find((subject) => subject.value === subject_code)!
                    .label.substring(subject_code.length + 2)}
                </small>
              </Tooltip>
            )}
          >
            <span>{subject_code}</span>
          </OverlayTrigger>{' '}
          {course_code}
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
                    <span className={styles.cancelled_text}>CANCELLED </span>
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
          <div style={title_style}>
            <div className={styles.ellipsis_text}>{course.title}</div>
          </div>
        </OverlayTrigger>
        <div className="d-flex">
          {/* Overall Rating */}
          <RatingCell
            rating={course_rating[0]}
            colormap={ratingColormap}
            style={rate_overall_style}
          >
            {course_rating[1]}
          </RatingCell>
          {/* Workload Rating */}
          <RatingCell
            rating={workload_rating[0]}
            colormap={workloadColormap}
            style={rate_workload_style}
          >
            {workload_rating[1]}
          </RatingCell>
          {/* Professor Rating & Course Professors */}
          <div style={prof_style} className="d-flex align-items-center">
            <div style={rate_prof_style} className="mr-2 h-100">
              <RatingCell
                rating={course.average_professor}
                colormap={ratingColormap}
              >
                {course.average_professor
                  ? course.average_professor.toFixed(1)
                  : 'N/A'}
              </RatingCell>
            </div>
            <div className={styles.ellipsis_text}>
              {course.professor_names.length === 0
                ? 'TBA'
                : course.professor_names.join(' • ')}
            </div>
          </div>
        </div>
        {/* Previous Enrollment */}
        <div style={enroll_style} className="d-flex">
          <span className="my-auto">{getEnrolled(course, true)}</span>
        </div>
        {/* Skills and Areas */}
        <div style={sa_style} className="d-flex">
          <span className={`${styles.skills_areas} `}>
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
        <div style={meet_style}>
          <div className={styles.ellipsis_text}>{course.times_summary}</div>
        </div>
        {/* Course Location */}
        <div style={loc_style}>
          <div className={styles.ellipsis_text}>{course.locations_summary}</div>
        </div>
        {/* # FB Friends also shopping */}
        <div style={fb_style} className="d-flex ">
          <OverlayTrigger
            placement="top"
            overlay={(props) =>
              friends.length > 0 ? (
                <Tooltip id="button-tooltip" {...props}>
                  {friends.join(' • ')}
                </Tooltip>
              ) : (
                <div />
              )
            }
          >
            <span className="my-auto">
              {friends.length > 0 ? friends.length : ''}
            </span>
          </OverlayTrigger>
        </div>
        {/* Add/remove from worksheet button */}
        <div
          className={styles.worksheet_btn}
          data-tutorial={isFirst && 'catalog-6'}
        >
          <WorksheetToggleButton
            crn={course.crn}
            season_code={course.season_code}
            modal={false}
            setCourseInWorksheet={setCourseInWorksheet}
          />
        </div>
        {/* Render conflict icon only when component has been mounted */}
        {mounted && !isScrolling && (
          <div className={styles.conflict_error}>
            <CourseConflictIcon course={course} />
          </div>
        )}
      </StyledResultsItem>
    </StyledSpacer>
  );
}

const ResultsItemMemo = React.memo(ResultsItem);
// ResultsItemMemo.whyDidYouRender = true;
export default ResultsItemMemo;