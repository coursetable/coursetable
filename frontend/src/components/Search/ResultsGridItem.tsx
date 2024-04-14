import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

import clsx from 'clsx';

import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import SkillBadge from '../SkillBadge';
import { SeasonTag, CourseCode, ratingTypes } from './ResultsItemCommon';
import { TextComponent } from '../Typography';

import styles from './ResultsGridItem.module.css';
import { generateRandomColor, type Listing } from '../../utilities/common';
import { isInWorksheet } from '../../utilities/course';

function Rating({
  course,
  hasEvals,
  name,
}: {
  readonly course: Listing;
  readonly hasEvals: boolean | undefined;
  readonly name: 'Class' | 'Professor' | 'Workload';
}) {
  const { Icon, getRating, colorMap } = ratingTypes[name];
  const rating = getRating(course, 'stat');
  return (
    <OverlayTrigger
      placement="top"
      overlay={(props) => (
        <Tooltip id={`${name}-tooltip`} {...props}>
          {hasEvals
            ? name
            : `${name} (These colors are randomly generated. Sign in to see real ratings)`}
        </Tooltip>
      )}
    >
      <div className="d-flex justify-content-end">
        <div
          className={styles.rating}
          style={{
            color: hasEvals
              ? rating
                ? colorMap(rating).darken().saturate().css()
                : '#cccccc'
              : generateRandomColor(
                  `${course.crn}${course.season_code}${name}`,
                ),
          }}
        >
          {hasEvals ? getRating(course, 'display') : '???'}
        </div>
        <div className={styles.iconContainer}>
          <Icon className={styles.icon} />
        </div>
      </div>
    </OverlayTrigger>
  );
}

function ResultsGridItem({
  course,
  numCols,
  multiSeasons,
}: {
  readonly course: Listing;
  readonly numCols: number;
  readonly multiSeasons: boolean;
}) {
  const [, setSearchParams] = useSearchParams();
  // Bootstrap column width depending on the number of columns
  const colWidth = 12 / numCols;
  const { user } = useUser();
  const { worksheetNumber } = useWorksheet();

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
    <Col md={colWidth} className={styles.container}>
      <div
        role="button"
        onClick={() => {
          setSearchParams((prev) => {
            prev.set('course-modal', `${course.season_code}-${course.crn}`);
            return prev;
          });
        }}
        className={clsx(
          styles.oneLine,
          styles.resultItem,
          inWorksheet && styles.inWorksheetResultItem,
          'px-3 pb-3',
        )}
        tabIndex={0}
      >
        <div className="d-flex justify-content-between">
          <div className={styles.courseCodes}>
            <CourseCode course={course} subdueSection={false} />
          </div>
          {multiSeasons && (
            <SeasonTag season={course.season_code} className={styles.season} />
          )}
        </div>
        <div>
          <strong className={styles.oneLine}>{course.title}</strong>
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <TextComponent
              type="secondary"
              className={clsx(styles.oneLine, styles.professors)}
            >
              {course.professor_names.length > 0
                ? course.professor_names.join(' • ')
                : 'Professor: TBA'}
            </TextComponent>
            <TextComponent
              type="secondary"
              className={clsx(styles.oneLine, styles.smallText)}
            >
              {course.times_summary === 'TBA'
                ? 'Times: TBA'
                : course.times_summary}
            </TextComponent>
            <TextComponent
              type="secondary"
              className={clsx(styles.oneLine, styles.smallText)}
            >
              {course.locations_summary === 'TBA'
                ? 'Location: TBA'
                : course.locations_summary}
            </TextComponent>
            <div className={styles.skillsAreas}>
              {[...course.skills, ...course.areas].map((skill) => (
                <SkillBadge skill={skill} key={skill} />
              ))}
            </div>
          </div>
          <div className="d-flex align-items-end">
            <div className="ml-auto">
              {(['Class', 'Professor', 'Workload'] as const).map((name) => (
                <Rating
                  key={name}
                  course={course}
                  hasEvals={user.hasEvals}
                  name={name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.worksheetBtn}>
        <WorksheetToggleButton
          listing={course}
          modal={false}
          inWorksheet={inWorksheet}
        />
      </div>
    </Col>
  );
}

export default ResultsGridItem;
