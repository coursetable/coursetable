import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge, OverlayTrigger, Popover, Tooltip, Row } from 'react-bootstrap';
import * as Sentry from '@sentry/react';

import { IoMdSunny } from 'react-icons/io';
import { FcCloseUpMode } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import clsx from 'clsx';

import {
  ratingColormap,
  workloadColormap,
  subjects,
} from '../../utilities/constants';

import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import CourseConflictIcon from './CourseConflictIcon';
import SkillBadge from '../SkillBadge';
import { TextComponent, InfoPopover, RatingBubble } from '../Typography';

import styles from './ResultsItem.module.css';
import colStyles from './ResultsCols.module.css';
import {
  getEnrolled,
  getOverallRatings,
  getWorkloadRatings,
  getProfessorRatings,
  toSeasonString,
  truncatedText,
} from '../../utilities/course';
import type { Listing } from '../../utilities/common';

import { useSearch } from '../../contexts/searchContext';

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
  isOdd,
  style,
}: {
  readonly course: Listing;
  readonly multiSeasons: boolean;
  readonly isFirst: boolean;
  readonly isOdd: boolean;
  readonly style?: React.CSSProperties;
}) {
  const [, setSearchParams] = useSearchParams();
  // Has the component been mounted?
  const [mounted, setMounted] = useState(false);

  // Set mounted on mount
  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  const { numFriends } = useSearch();
  const friends = numFriends[course.season_code + course.crn];

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

  const [subjectCode, courseCode] = course.course_code.split(' ') as [
    string,
    string,
  ];

  return (
    // TODO
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(
        styles.resultItem,
        courseInWorksheet && styles.inWorksheetResultItem,
        isFirst && styles.firstResultItem,
        isOdd ? styles.oddResultItem : styles.evenResultItem,
        course.extra_info !== 'ACTIVE' && styles.cancelledClass,
      )}
      onClick={() => {
        setSearchParams((prev) => {
          prev.set('course-modal', `${course.season_code}-${course.crn}`);
          return prev;
        });
      }}
      // TODO
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      style={style}
    >
      {/* Search Row Item */}
      <Row
        className={clsx(
          styles.resultItemContent,
          'mx-auto pl-4 pr-2 py-0 justify-content-between',
        )}
      >
        {/* Season */}
        {multiSeasons && (
          <div className={clsx('d-flex', colStyles.seasonCol)}>
            <OverlayTrigger
              placement="top"
              overlay={(props) => (
                <Tooltip id="button-tooltip" {...props}>
                  <small>{toSeasonString(course.season_code)}</small>
                </Tooltip>
              )}
            >
              <div className={clsx(styles.skillsAreas, 'my-auto')}>
                <Badge
                  variant="secondary"
                  className={clsx(
                    styles.tag,
                    styles[seasons[(season - 1) as 0 | 1 | 2]],
                  )}
                  key={season}
                >
                  <div style={{ display: 'inline-block' }}>{icon}</div>
                  &nbsp;{`'${year}`}
                </Badge>
              </div>
            </OverlayTrigger>
          </div>
        )}
        {/* Course Code */}
        <div
          className={clsx(
            colStyles.codeCol,
            multiSeasons && colStyles.multiSeasons,
          )}
        >
          <div className={clsx(styles.ellipsisText, 'font-weight-bold')}>
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
            <TextComponent type="secondary">
              {course.section
                ? ` ${course.section.length > 1 ? '' : '0'}${course.section}`
                : ''}
            </TextComponent>
          </div>
        </div>
        <OverlayTrigger
          placement="right"
          overlay={(props) => (
            <InfoPopover {...props} id="title-popover">
              <Popover.Title>
                <strong>
                  {course.extra_info !== 'ACTIVE' ? (
                    <span className={styles.cancelledText}>CANCELLED</span>
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
            </InfoPopover>
          )}
        >
          {/* Course Title */}
          <div className={colStyles.titleCol}>
            <div className={styles.ellipsisText}>{course.title}</div>
          </div>
        </OverlayTrigger>
        <div className="d-flex">
          <div className={colStyles.overallCol}>
            <RatingBubble
              className={styles.ratingCell}
              rating={getOverallRatings(course, 'stat')}
              colorMap={ratingColormap}
            >
              {getOverallRatings(course, 'display')}
            </RatingBubble>
          </div>
          <div className={colStyles.workloadCol}>
            <RatingBubble
              className={clsx(styles.ratingCell, colStyles.workloadCol)}
              rating={getWorkloadRatings(course, 'stat')}
              colorMap={workloadColormap}
            >
              {getWorkloadRatings(course, 'display')}
            </RatingBubble>
          </div>
          <div className={clsx('d-flex align-items-center', colStyles.profCol)}>
            <div className={clsx('mr-2 h-100', styles.profRating)}>
              <RatingBubble
                className={styles.ratingCell}
                rating={getProfessorRatings(course, 'stat')}
                colorMap={ratingColormap}
              >
                {getProfessorRatings(course, 'display')}
              </RatingBubble>
            </div>
            <div className={styles.ellipsisText}>
              {course.professor_names.length === 0
                ? 'TBA'
                : course.professor_names.join(' • ')}
            </div>
          </div>
        </div>
        {/* Previous Enrollment */}
        <div className={clsx('d-flex', colStyles.enrollCol)}>
          <span className="my-auto">{getEnrolled(course, 'display')}</span>
        </div>
        {/* Skills and Areas */}
        <div className={clsx('d-flex', colStyles.skillAreaCol)}>
          <span className={styles.skillsAreas}>
            {[...course.skills, ...course.areas].map((skill, index) => (
              <SkillBadge skill={skill} className="my-auto" key={index} />
            ))}
          </span>
        </div>
        {/* Course Meeting Days & Times */}
        <div className={colStyles.meetCol}>
          <div className={styles.ellipsisText}>{course.times_summary}</div>
        </div>
        {/* Course Location */}
        <div className={colStyles.locCol}>
          <div className={styles.ellipsisText}>{course.locations_summary}</div>
        </div>
        {/* # Friends also shopping */}
        <div className={clsx('d-flex', colStyles.friendsCol)}>
          <OverlayTrigger
            placement="top"
            overlay={(props) =>
              friends && friends.size > 0 ? (
                <Tooltip id="button-tooltip" {...props}>
                  {[...friends].join(' • ')}
                </Tooltip>
              ) : (
                <div />
              )
            }
          >
            <span className="my-auto">
              {friends && friends.size > 0 ? friends.size : ''}
            </span>
          </OverlayTrigger>
        </div>
        {/* Add/remove from worksheet button */}
        <div
          className={styles.worksheetBtn}
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
        {mounted && (
          <div className={styles.conflictError}>
            <CourseConflictIcon course={course} />
          </div>
        )}
      </Row>
    </div>
  );
}

export default ResultsItem;
