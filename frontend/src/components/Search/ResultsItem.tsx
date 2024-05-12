import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import type { ListChildComponentProps } from 'react-window';

import type { ResultItemData } from './Results';
import {
  SeasonTag,
  CourseInfoPopover,
  CourseCode,
  ratingTypes,
} from './ResultsItemCommon';
import { useSearch } from '../../contexts/searchContext';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { Listing } from '../../queries/api';
import { generateRandomColor } from '../../utilities/common';
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
      <RatingBubble
        color={generateRandomColor(`${course.crn}${course.season_code}${name}`)}
        className={styles.ratingCell}
      />
    </OverlayTrigger>
  );
}

function ResultsItem({
  data: { courses, multiSeasons },
  index,
  style,
}: ListChildComponentProps<ResultItemData>) {
  const course = courses[index]!;
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
    <li className={styles.container} style={style}>
      <Link
        to={target}
        className={clsx(
          styles.resultItem,
          inWorksheet && styles.inWorksheetResultItem,
          index % 2 === 1 ? styles.oddResultItem : styles.evenResultItem,
          course.extra_info !== 'ACTIVE' && styles.cancelledClass,
        )}
      >
        <div className={styles.resultItemContent}>
          <span
            className={colStyles.controlCol}
            data-tutorial={index === 0 && 'catalog-6'}
          />
          {multiSeasons && (
            <span className={colStyles.seasonCol}>
              <SeasonTag
                season={course.season_code}
                className={styles.season}
              />
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
          <span
            className={clsx('d-flex align-items-center', colStyles.profCol)}
          >
            <span className={clsx('me-2 h-100', styles.profRating)}>
              <Rating
                course={course}
                hasEvals={user.hasEvals}
                name="Professor"
              />
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
      {/* Don't this inside the link because interactive elements can't be
        nested */}
      <div className={styles.worksheetBtn}>
        <WorksheetToggleButton
          listing={course}
          modal={false}
          inWorksheet={inWorksheet}
        />
      </div>
    </li>
  );
}

export default ResultsItem;
