import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import type { GridChildComponentProps } from 'react-window';

import type { ResultItemData } from './Results';
import { SeasonTag, CourseCode, ratingTypes } from './ResultsItemCommon';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { generateRandomColor, type Listing } from '../../utilities/common';
import { isInWorksheet } from '../../utilities/course';
import { useCourseModalLink } from '../../utilities/display';
import SkillBadge from '../SkillBadge';
import { TextComponent } from '../Typography';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import styles from './ResultsGridItem.module.css';

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
            color:
              (hasEvals
                ? rating
                  ? colorMap(rating)
                  : undefined
                : generateRandomColor(
                    `${course.crn}${course.season_code}${name}`,
                  )
              )
                ?.darken()
                .saturate()
                .css() ?? '#cccccc',
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
  data: { courses, columnCount, multiSeasons },
  rowIndex,
  columnIndex,
  style,
}: GridChildComponentProps<ResultItemData>) {
  const course = courses[rowIndex * columnCount + columnIndex];
  const target = useCourseModalLink(course);
  const { user } = useUser();
  const { worksheetNumber } = useWorksheet();

  const inWorksheet = useMemo(
    () =>
      course &&
      isInWorksheet(
        course.season_code,
        course.crn,
        worksheetNumber,
        user.worksheets,
      ),
    [course, worksheetNumber, user.worksheets],
  );

  if (!course) return null;

  return (
    <li className={styles.container} style={style}>
      <Link
        to={target}
        className={clsx(
          styles.resultItem,
          inWorksheet && styles.inWorksheetResultItem,
          'px-3 pb-3',
        )}
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
            <div className="ms-auto">
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

export default ResultsGridItem;
