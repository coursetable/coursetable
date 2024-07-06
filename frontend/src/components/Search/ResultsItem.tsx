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
import { useWorksheet } from '../../contexts/worksheetContext';
import type { CatalogListing } from '../../queries/api';
import { useStore } from '../../store';
import { generateRandomColor } from '../../utilities/common';
import { getEnrolled, isInWorksheet } from '../../utilities/course';
import { useCourseModalLink } from '../../utilities/display';
import SkillBadge from '../SkillBadge';
import { RatingBubble } from '../Typography';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import colStyles from './ResultsCols.module.css';
import styles from './ResultsItem.module.css';

function Rating({
  listing,
  hasEvals,
  name,
}: {
  readonly listing: CatalogListing;
  readonly hasEvals: boolean | undefined;
  readonly name: 'Class' | 'Professor' | 'Workload';
}) {
  const { getRating, colorMap } = ratingTypes[name];
  if (hasEvals) {
    return (
      <RatingBubble
        className={styles.ratingCell}
        rating={getRating(listing.course, 'stat')}
        colorMap={colorMap}
      >
        {getRating(listing.course, 'display')}
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
        color={generateRandomColor(
          `${listing.crn}${listing.season_code}${name}`,
        )}
        className={styles.ratingCell}
      />
    </OverlayTrigger>
  );
}

function ResultsItem({
  data: { listings, multiSeasons },
  index,
  style,
}: ListChildComponentProps<ResultItemData>) {
  const listing = listings[index]!;
  const user = useStore((state) => state.user);
  const { worksheetNumber } = useWorksheet();

  const { numFriends } = useSearch();
  const friends = numFriends[`${listing.season_code}${listing.crn}`];
  const target = useCourseModalLink(listing);

  const inWorksheet = useMemo(
    () =>
      isInWorksheet(
        listing.season_code,
        listing.crn,
        worksheetNumber,
        user.worksheets,
      ),
    [listing.crn, listing.season_code, worksheetNumber, user.worksheets],
  );

  return (
    <li className={styles.container} style={style}>
      <Link
        to={target}
        className={clsx(
          styles.resultItem,
          inWorksheet && styles.inWorksheetResultItem,
          index % 2 === 1 ? styles.oddResultItem : styles.evenResultItem,
          listing.course.extra_info !== 'ACTIVE' && styles.cancelledClass,
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
                season={listing.season_code}
                className={styles.season}
              />
            </span>
          )}
          <span className={colStyles.codeCol}>
            <span className={clsx(styles.ellipsisText, 'fw-bold')}>
              <CourseCode listing={listing} subdueSection />
            </span>
          </span>
          <CourseInfoPopover listing={listing}>
            <span className={colStyles.titleCol}>
              <span className={styles.ellipsisText}>
                {listing.course.title}
              </span>
            </span>
          </CourseInfoPopover>
          <span className={colStyles.overallCol}>
            <Rating listing={listing} hasEvals={user.hasEvals} name="Class" />
          </span>
          <span className={colStyles.workloadCol}>
            <Rating
              listing={listing}
              hasEvals={user.hasEvals}
              name="Workload"
            />
          </span>
          <span
            className={clsx('d-flex align-items-center', colStyles.profCol)}
          >
            <span className={clsx('me-2 h-100', styles.profRating)}>
              <Rating
                listing={listing}
                hasEvals={user.hasEvals}
                name="Professor"
              />
            </span>
            <span className={styles.ellipsisText}>
              {listing.course.course_professors.length === 0
                ? 'TBA'
                : listing.course.course_professors
                    .map((p) => p.professor.name)
                    .join(' • ')}
            </span>
          </span>
          <span className={clsx('d-flex', colStyles.enrollCol)}>
            <span className="my-auto">
              {getEnrolled(listing.course, 'display')}
            </span>
          </span>
          <span className={clsx('d-flex', colStyles.skillAreaCol)}>
            <span className={styles.skillsAreas}>
              {[...listing.course.skills, ...listing.course.areas].map(
                (skill) => (
                  <SkillBadge skill={skill} className="my-auto" key={skill} />
                ),
              )}
            </span>
          </span>
          <span className={colStyles.meetCol}>
            <span className={styles.ellipsisText}>
              {listing.course.times_summary}
            </span>
          </span>
          <span className={colStyles.locCol}>
            <span className={styles.ellipsisText}>
              {listing.course.locations_summary}
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
          listing={listing}
          modal={false}
          inWorksheet={inWorksheet}
        />
      </div>
    </li>
  );
}

export default ResultsItem;
