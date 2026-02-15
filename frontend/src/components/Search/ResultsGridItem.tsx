import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsEyeSlash } from 'react-icons/bs';
import type { GridChildComponentProps } from 'react-window';
import { useShallow } from 'zustand/react/shallow';

import type { ResultItemData } from './Results';
import { SeasonTag, CourseCode, ratingTypes } from './ResultsItemCommon';
import type { CatalogListing } from '../../queries/api';
import { useStore } from '../../store';
import { generateRandomColor } from '../../utilities/common';
import {
  isInWorksheet,
  toTimesSummary,
  toLocationsSummary,
} from '../../utilities/course';
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
  readonly listing: CatalogListing;
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
            : `${name} (These colors are randomly generated. ${hasEvals === false ? 'Complete the challenge' : 'Sign in'} to see real ratings)`}
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
                    `${listing.crn}${listing.course.season_code}${name}`,
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
  const { user, worksheets } = useStore(
    useShallow((state) => ({ worksheets: state.worksheets, user: state.user })),
  );
  const getRelevantWorksheetNumber = useStore(
    (state) => state.getRelevantWorksheetNumber,
  );

  const inWorksheet = useMemo(
    () =>
      listing &&
      isInWorksheet(
        listing,
        getRelevantWorksheetNumber(listing.course.season_code),
        worksheets,
      ),
    [listing, getRelevantWorksheetNumber, worksheets],
  );

  if (!listing) return null;

  const timesSummary = toTimesSummary(listing.course);
  const locationsSummary = toLocationsSummary(listing.course, user?.hasEvals);

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
            <SeasonTag
              season={listing.course.season_code}
              className={styles.season}
            />
          )}
        </div>
        <div>
          <strong className={styles.oneLine}>{listing.course.title}</strong>
        </div>
        <div className="d-flex justify-content-between">
          <div className={styles.courseInfo}>
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
              {timesSummary === 'TBA' ? 'Times: TBA' : timesSummary}
            </TextComponent>
            <TextComponent
              type="secondary"
              className={clsx(styles.oneLine, styles.smallText)}
            >
              {locationsSummary === 'HIDDEN' ? (
                <OverlayTrigger
                  placement="top"
                  overlay={(props) => (
                    <Tooltip
                      id="results-grid-location-hidden-tooltip"
                      {...props}
                    >
                      Sign in to see location
                    </Tooltip>
                  )}
                >
                  <span>
                    <BsEyeSlash />
                  </span>
                </OverlayTrigger>
              ) : locationsSummary === 'TBA' ? (
                'Location: TBA'
              ) : (
                `Location: ${locationsSummary}`
              )}
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
                  hasEvals={user?.hasEvals}
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
