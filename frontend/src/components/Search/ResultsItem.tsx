import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge, OverlayTrigger, Popover, Tooltip, Row } from 'react-bootstrap';
import * as Sentry from '@sentry/react';

import chroma from 'chroma-js';
import { IoMdSunny } from 'react-icons/io';
import { FcCloseUpMode } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import styled from 'styled-components';
import clsx from 'clsx';

import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
  subjects,
} from '../../utilities/constants';

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
  toSeasonString,
  truncatedText,
} from '../../utilities/course';
import { breakpoints } from '../../utilities/display';
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
    inWorksheet ? theme.primaryLight : 'inherit'};

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.selectHover};
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
  readonly course: Listing;
  readonly multiSeasons: boolean;
  readonly isFirst: boolean;
  // This can be more exact, but I'm too lazy to type everything out :)
  readonly COL_SPACING: { [prop: string]: number };
  readonly isScrolling: boolean;
  readonly friends: string[];
}) {
  const [, setSearchParams] = useSearchParams();
  // Has the component been mounted?
  const [mounted, setMounted] = useState(false);

  // Set mounted on mount
  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  // Season code for this listing
  const seasons = ['spring', 'summer', 'fall'] as const;
  const season = Number(course.season_code[5]);
  const year = course.season_code.substring(2, 4);
  // Size of season icons
  const iconSize = 10;
  // Determine the icon for this season
  const icon =
    season === 1 ? (
      <FcCloseUpMode className="my-auto" size={iconSize} />
    ) : season === 2 ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={iconSize} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={iconSize} />
    );

  // Is the current course in the worksheet?
  const [courseInWorksheet, setCourseInWorksheet] = useState(false);

  // Column width styles
  const sznStyle: React.CSSProperties = {
    width: `${COL_SPACING.SZN_WIDTH}px`,
    paddingLeft: '15px',
  };
  const codeStyle: React.CSSProperties = {
    width: `${COL_SPACING.CODE_WIDTH}px`,
    paddingLeft: !multiSeasons ? '15px' : '0px',
  };
  const titleStyle: React.CSSProperties = {
    width: `${COL_SPACING.TITLE_WIDTH}px`,
  };
  const rateOverallStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_OVERALL_WIDTH}px`,
  };
  const rateWorkloadStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_WORKLOAD_WIDTH}px`,
  };
  const rateProfStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    minWidth: `${COL_SPACING.RATE_PROF_WIDTH}px`,
  };
  const profStyle: React.CSSProperties = {
    width: `${COL_SPACING.PROF_WIDTH}px`,
  };
  const meetStyle: React.CSSProperties = {
    width: `${COL_SPACING.MEET_WIDTH}px`,
  };
  const locStyle: React.CSSProperties = {
    width: `${COL_SPACING.LOC_WIDTH}px`,
  };
  const enrollStyle: React.CSSProperties = {
    width: `${COL_SPACING.ENROLL_WIDTH}px`,
  };
  const friendsStyle: React.CSSProperties = {
    width: `${COL_SPACING.FRIENDS_WIDTH}px`,
  };
  const saStyle: React.CSSProperties = { width: `${COL_SPACING.SA_WIDTH}px` };

  const [subjectCode, courseCode] = course.course_code.split(' ') as [
    string,
    string,
  ];

  return (
    <StyledSpacer
      className={clsx(
        isFirst && styles.first_search_result_item,
        course.extra_info !== 'ACTIVE' && styles.cancelled_class,
      )}
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
          <div style={sznStyle} className="d-flex">
            <OverlayTrigger
              placement="top"
              overlay={(props) => (
                <Tooltip id="button-tooltip" {...props}>
                  <small>{toSeasonString(course.season_code)}</small>
                </Tooltip>
              )}
            >
              <div className={clsx(styles.skills_areas, 'my-auto')}>
                <Tag
                  variant="secondary"
                  className={styles[seasons[(season - 1) as 0 | 1 | 2]]}
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
          style={codeStyle}
          className={clsx(styles.ellipsis_text, 'font-weight-bold')}
        >
          <OverlayTrigger
            placement="top"
            overlay={(props) => {
              const subjectName = subjects[subjectCode];
              if (!subjectName) {
                Sentry.captureException(
                  new Error(`Subject ${subjectCode} has no label`),
                );
              }
              return (
                <Tooltip id="button-tooltip" {...props}>
                  <small>{subjectName ?? '[unknown]'}</small>
                </Tooltip>
              );
            }}
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
                    <span className={styles.cancelled_text}>CANCELLED </span>
                  ) : (
                    ''
                  )}
                  {course.title}
                </strong>
              </Popover.Title>
              <Popover.Content>
                {truncatedText(course.description, 500, 'no description')}
                <br />
                <div className="text-danger">
                  {truncatedText(course.requirements, 250, '')}
                </div>
              </Popover.Content>
            </StyledPopover>
          )}
        >
          {/* Course Title */}
          <div style={titleStyle}>
            <div className={styles.ellipsis_text}>{course.title}</div>
          </div>
        </OverlayTrigger>
        <div className="d-flex">
          {/* Overall Rating */}
          <RatingCell
            rating={getOverallRatings(course, 'stat')}
            colormap={ratingColormap}
            style={rateOverallStyle}
          >
            {getOverallRatings(course, 'display')}
          </RatingCell>
          {/* Workload Rating */}
          <RatingCell
            rating={getWorkloadRatings(course, 'stat')}
            colormap={workloadColormap}
            style={rateWorkloadStyle}
          >
            {getWorkloadRatings(course, 'display')}
          </RatingCell>
          {/* Professor Rating & Course Professors */}
          <div style={profStyle} className="d-flex align-items-center">
            <div style={rateProfStyle} className="mr-2 h-100">
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
        <div style={enrollStyle} className="d-flex">
          <span className="my-auto">{getEnrolled(course, 'display')}</span>
        </div>
        {/* Skills and Areas */}
        <div style={saStyle} className="d-flex">
          <span className={styles.skills_areas}>
            {course.skills.map((skill, index) => (
              <Tag
                variant="secondary"
                className="my-auto"
                key={index}
                style={{
                  color: skillsAreasColors[skill],
                  backgroundColor: chroma(skillsAreasColors[skill]!)
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
                  backgroundColor: chroma(skillsAreasColors[area]!)
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
        <div style={meetStyle}>
          <div className={styles.ellipsis_text}>{course.times_summary}</div>
        </div>
        {/* Course Location */}
        <div style={locStyle}>
          <div className={styles.ellipsis_text}>{course.locations_summary}</div>
        </div>
        {/* # Friends also shopping */}
        <div style={friendsStyle} className="d-flex ">
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
            seasonCode={course.season_code}
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

export default ResultsItem;
