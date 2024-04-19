import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  SeasonTag,
  CourseInfoPopover,
  CourseCode,
  ratingTypes,
} from './ResultsItemCommon';
import { useSearch } from '../../contexts/searchContext';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { generateRandomColor, type Listing } from '../../utilities/common';
import { getEnrolled, isInWorksheet } from '../../utilities/course';
import { useCourseModalLink } from '../../utilities/display';
import SkillBadge from '../SkillBadge';
import { RatingBubble } from '../Typography';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import colStyles from './ResultsCols.module.css';
import styles from './ResultsItem.module.css';

function Rating({
  course,
  hasEvals,
  name,
}: {
  readonly course: Listing;
  readonly hasEvals: boolean | undefined;
  readonly name: 'Class' | 'Professor' | 'Workload';
}) {
  const { getRating, colorMap } = ratingTypes[name];
  if (hasEvals) {
    return (
      <RatingBubble
        className={styles.ratingCell}
        rating={getRating(course, 'stat')}
        colorMap={colorMap}
      >
        {getRating(course, 'display')}
      </RatingBubble>
    );
  }
  return (
    <OverlayTrigger
      placement="top"
      overlay={(props) => (
        <Tooltip id="blur-rating-tooltip" {...props}>
          These colors are randomly generated. Sign in to see real ratings.
        </Tooltip>
      )}
    >
      <div
        className={styles.ratingCell}
        style={{
          backgroundColor: generateRandomColor(
            `${course.crn}${course.season_code}${name}`,
          ),
        }}
      >
        {/* Maybe put number here */}
      </div>
    </OverlayTrigger>
  );
}

function ResultsItem({
  course,
  multiSeasons,
  index,
  style,
}: {
  readonly course: Listing;
  readonly multiSeasons: boolean;
  readonly index: number;
  readonly style?: React.CSSProperties;
}) {
  const { user } = useUser();
  const { worksheetNumber } = useWorksheet();

  const { numFriends } = useSearch();
  const friends = numFriends[`${course.season_code}${course.crn}`];
  const target = useCourseModalLink(course);

  const inWorksheet = useMemo(
    () =>
      isInWorksheet(
        course.season_code,
        course.crn,
        worksheetNumber,
        user.worksheets,
      ),
    [course.crn, course.season_code, worksheetNumber, user.worksheets],
  );

  return (
    <Link
      to={target}
      className={clsx(
        styles.resultItem,
        inWorksheet && styles.inWorksheetResultItem,
        index % 2 === 1 ? styles.oddResultItem : styles.evenResultItem,
        course.extra_info !== 'ACTIVE' && styles.cancelledClass,
      )}
      style={style}
    >
      <div className={styles.resultItemContent}>
        <span
          className={colStyles.controlCol}
          data-tutorial={index === 0 && 'catalog-6'}
        >
          <WorksheetToggleButton
            listing={course}
            modal={false}
            inWorksheet={inWorksheet}
          />
        </span>
        {multiSeasons && (
          <span className={colStyles.seasonCol}>
            <SeasonTag season={course.season_code} className={styles.season} />
          </span>
        )}
        <span className={colStyles.codeCol}>
          <span className={clsx(styles.ellipsisText, 'fw-bold')}>
            <CourseCode course={course} subdueSection />
          </span>
        </span>
        <CourseInfoPopover course={course}>
          <span className={colStyles.titleCol}>
            <span className={styles.ellipsisText}>{course.title}</span>
          </span>
        </CourseInfoPopover>
        <span className={colStyles.overallCol}>
          <Rating course={course} hasEvals={user.hasEvals} name="Class" />
        </span>
        <span className={colStyles.workloadCol}>
          <Rating course={course} hasEvals={user.hasEvals} name="Workload" />
        </span>
        <span className={clsx('d-flex align-items-center', colStyles.profCol)}>
          <span className={clsx('me-2 h-100', styles.profRating)}>
            <Rating course={course} hasEvals={user.hasEvals} name="Professor" />
          </span>
          <span className={styles.ellipsisText}>
            {course.professor_names.length === 0
              ? 'TBA'
              : course.professor_names.join(' • ')}
          </span>
        </span>
        <span className={clsx('d-flex', colStyles.enrollCol)}>
          <span className="my-auto">{getEnrolled(course, 'display')}</span>
        </span>
        <span className={clsx('d-flex', colStyles.skillAreaCol)}>
          <span className={styles.skillsAreas}>
            {[...course.skills, ...course.areas].map((skill) => (
              <SkillBadge skill={skill} className="my-auto" key={skill} />
            ))}
          </span>
        </span>
        <span className={colStyles.meetCol}>
          <span className={styles.ellipsisText}>{course.times_summary}</span>
        </span>
        <span className={colStyles.locCol}>
          <span className={styles.ellipsisText}>
            {course.locations_summary}
          </span>
        </span>
        <span className={colStyles.friendsCol}>
          {friends && friends.size > 0 && (
            <OverlayTrigger
              placement="top"
              overlay={(props) => (
                <Tooltip id="button-tooltip" {...props}>
                  {[...friends].join(' • ')}
                </Tooltip>
              )}
            >
              <span>{friends.size}</span>
            </OverlayTrigger>
          )}
        </span>
      </div>
    </Link>
  );
}

export default ResultsItem;
