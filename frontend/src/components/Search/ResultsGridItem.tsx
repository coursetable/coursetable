import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import type { GridChildComponentProps } from 'react-window';

import type { ResultItemData } from './Results';
import { SeasonTag, CourseCode, ratingTypes } from './ResultsItemCommon';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { Listing } from '../../queries/api';
import { generateRandomColor } from '../../utilities/common';
import { isInWorksheet } from '../../utilities/course';
import { useCourseModalLink } from '../../utilities/display';
import SkillBadge from '../SkillBadge';
import { TextComponent } from '../Typography';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import styles from './ResultsGridItem.module.css';

function Rating({
  listing,
  hasEvals,
  name,
}: {
  readonly listing: Listing;
  readonly hasEvals: boolean | undefined;
  readonly name: 'Class' | 'Professor' | 'Workload';
}) {
  const { Icon, getRating, colorMap } = ratingTypes[name];
  const rating = getRating(listing.course, 'stat');
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
                    `${listing.crn}${listing.season_code}${name}`,
                  )
              )
                ?.darken()
                .saturate()
                .css() ?? '#cccccc',
          }}
        >
          {hasEvals ? getRating(listing.course, 'display') : '???'}
        </div>
        <div className={styles.iconContainer}>
          <Icon className={styles.icon} />
        </div>
      </div>
    </OverlayTrigger>
  );
}

function ResultsGridItem({
  data: { listings, columnCount, multiSeasons },
  rowIndex,
  columnIndex,
  style,
}: GridChildComponentProps<ResultItemData>) {
  const listing = listings[rowIndex * columnCount + columnIndex];
  const target = useCourseModalLink(listing);
  const { user } = useUser();
  const { worksheetNumber } = useWorksheet();

  const inWorksheet = useMemo(
    () =>
      listing &&
      isInWorksheet(
        listing.season_code,
        listing.crn,
        worksheetNumber,
        user.worksheets,
      ),
    [listing, worksheetNumber, user.worksheets],
  );

  if (!listing) return null;

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
            <CourseCode listing={listing} subdueSection={false} />
          </div>
          {multiSeasons && (
            <SeasonTag season={listing.season_code} className={styles.season} />
          )}
        </div>
        <div>
          <strong className={styles.oneLine}>{listing.course.title}</strong>
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <TextComponent
              type="secondary"
              className={clsx(styles.oneLine, styles.professors)}
            >
              {listing.course.course_professors.length > 0
                ? listing.course.course_professors
                    .map((p) => p.professor.name)
                    .join(' • ')
                : 'Professor: TBA'}
            </TextComponent>
            <TextComponent
              type="secondary"
              className={clsx(styles.oneLine, styles.smallText)}
            >
              {listing.course.times_summary === 'TBA'
                ? 'Times: TBA'
                : listing.course.times_summary}
            </TextComponent>
            <TextComponent
              type="secondary"
              className={clsx(styles.oneLine, styles.smallText)}
            >
              {listing.course.locations_summary === 'TBA'
                ? 'Location: TBA'
                : listing.course.locations_summary}
            </TextComponent>
            <div className={styles.skillsAreas}>
              {[...listing.course.skills, ...listing.course.areas].map(
                (skill) => (
                  <SkillBadge skill={skill} key={skill} />
                ),
              )}
            </div>
          </div>
          <div className="d-flex align-items-end">
            <div className="ms-auto">
              {(['Class', 'Professor', 'Workload'] as const).map((name) => (
                <Rating
                  key={name}
                  listing={listing}
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
          listing={listing}
          modal={false}
          inWorksheet={inWorksheet}
        />
      </div>
    </li>
  );
}

export default ResultsGridItem;
