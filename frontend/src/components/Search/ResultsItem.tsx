import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OverlayTrigger, Tooltip, Row } from 'react-bootstrap';

import clsx from 'clsx';

import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import SkillBadge from '../SkillBadge';
import {
  SeasonTag,
  CourseInfoPopover,
  CourseCode,
  ratingTypes,
} from './ResultsItemCommon';
import { RatingBubble } from '../Typography';

import styles from './ResultsItem.module.css';
import colStyles from './ResultsCols.module.css';
import { getEnrolled, isInWorksheet } from '../../utilities/course';
import { generateRandomColor, type Listing } from '../../utilities/common';

import { useSearch } from '../../contexts/searchContext';

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
  const { user } = useUser();
  const { worksheetNumber } = useWorksheet();

  const { numFriends } = useSearch();
  const friends = numFriends[`${course.season_code}${course.crn}`];

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
    <div
      role="button"
      className={clsx(
        styles.resultItem,
        inWorksheet && styles.inWorksheetResultItem,
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
      tabIndex={0}
      style={style}
    >
      <Row
        className={clsx(
          styles.resultItemContent,
          'mx-auto pl-4 pr-2 py-0 justify-content-between',
        )}
      >
        {multiSeasons && (
          <div className={clsx('d-flex', colStyles.seasonCol)}>
            <div className="my-auto">
              <SeasonTag
                season={course.season_code}
                className={styles.season}
              />
            </div>
          </div>
        )}
        <div
          className={clsx(
            colStyles.codeCol,
            multiSeasons && colStyles.multiSeasons,
          )}
        >
          <div className={clsx(styles.ellipsisText, 'font-weight-bold')}>
            <CourseCode course={course} subdueSection />
          </div>
        </div>
        <CourseInfoPopover course={course}>
          <div className={colStyles.titleCol}>
            <div className={styles.ellipsisText}>{course.title}</div>
          </div>
        </CourseInfoPopover>
        <div className="d-flex">
          <div className={colStyles.overallCol}>
            <Rating course={course} hasEvals={user.hasEvals} name="Class" />
          </div>
          <div className={colStyles.workloadCol}>
            <Rating course={course} hasEvals={user.hasEvals} name="Workload" />
          </div>
          <div className={clsx('d-flex align-items-center', colStyles.profCol)}>
            <div className={clsx('mr-2 h-100', styles.profRating)}>
              <Rating
                course={course}
                hasEvals={user.hasEvals}
                name="Professor"
              />
            </div>
            <div className={styles.ellipsisText}>
              {course.professor_names.length === 0
                ? 'TBA'
                : course.professor_names.join(' • ')}
            </div>
          </div>
        </div>
        <div className={clsx('d-flex', colStyles.enrollCol)}>
          <span className="my-auto">{getEnrolled(course, 'display')}</span>
        </div>
        <div className={clsx('d-flex', colStyles.skillAreaCol)}>
          <span className={styles.skillsAreas}>
            {[...course.skills, ...course.areas].map((skill, index) => (
              <SkillBadge skill={skill} className="my-auto" key={index} />
            ))}
          </span>
        </div>
        <div className={colStyles.meetCol}>
          <div className={styles.ellipsisText}>{course.times_summary}</div>
        </div>
        <div className={colStyles.locCol}>
          <div className={styles.ellipsisText}>{course.locations_summary}</div>
        </div>
        <div className={clsx('d-flex', colStyles.friendsCol)}>
          {friends && friends.size > 0 ? (
            <OverlayTrigger
              placement="top"
              overlay={(props) => (
                <Tooltip id="button-tooltip" {...props}>
                  {[...friends].join(' • ')}
                </Tooltip>
              )}
            >
              <span className="my-auto">{friends.size}</span>
            </OverlayTrigger>
          ) : (
            <span className="my-auto" />
          )}
        </div>
        <div
          className={styles.worksheetBtn}
          data-tutorial={isFirst && 'catalog-6'}
        >
          <WorksheetToggleButton
            listing={course}
            modal={false}
            inWorksheet={inWorksheet}
          />
        </div>
      </Row>
    </div>
  );
}

export default ResultsItem;
