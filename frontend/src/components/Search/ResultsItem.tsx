import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsEyeSlash } from 'react-icons/bs';
import type { ListChildComponentProps } from 'react-window';
import { useShallow } from 'zustand/react/shallow';

import type { ResultItemData } from './Results';
import {
  SeasonTag,
  CourseInfoPopover,
  CourseCode,
  ratingTypes,
} from './ResultsItemCommon';
import { useSearch } from '../../contexts/searchContext';
import type { CatalogListing } from '../../queries/api';
import { useStore } from '../../store';
import { generateRandomColor } from '../../utilities/common';
import {
  getEnrolled,
  isInWorksheet,
  toTimesSummary,
  toLocationsSummary,
} from '../../utilities/course';
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
          These colors are randomly generated.{' '}
          {hasEvals === false ? 'Complete the challenge' : 'Sign in'} to see
          real ratings.
        </Tooltip>
      )}
    >
      <RatingBubble
        color={generateRandomColor(
          `${listing.crn}${listing.course.season_code}${name}`,
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
  const { user, worksheets } = useStore(
    useShallow((state) => ({ worksheets: state.worksheets, user: state.user })),
  );
  const getRelevantWorksheetNumber = useStore(
    (state) => state.getRelevantWorksheetNumber,
  );

  const { numFriends } = useSearch();
  const friends = numFriends[`${listing.course.season_code}${listing.crn}`];
  const target = useCourseModalLink(listing);

  const inWorksheet = useMemo(
    () =>
      isInWorksheet(
        listing,
        getRelevantWorksheetNumber(listing.course.season_code),
        worksheets,
      ),
    [listing, getRelevantWorksheetNumber, worksheets],
  );

  const timeAdded = listing.course.time_added
    ? new Date(listing.course.time_added as string).toLocaleDateString()
    : '';

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
                season={listing.course.season_code}
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
            <Rating listing={listing} hasEvals={user?.hasEvals} name="Class" />
          </span>
          <span className={colStyles.workloadCol}>
            <Rating
              listing={listing}
              hasEvals={user?.hasEvals}
              name="Workload"
            />
          </span>
          <span
            className={clsx('d-flex align-items-center', colStyles.profCol)}
          >
            <span className={clsx('me-2 h-100', styles.profRating)}>
              <Rating
                listing={listing}
                hasEvals={user?.hasEvals}
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
              {toTimesSummary(listing.course)}
            </span>
          </span>
          <span className={colStyles.locCol}>
            <span className={styles.ellipsisText}>
              {toLocationsSummary(listing.course, user?.hasEvals) ===
              'HIDDEN' ? (
                <OverlayTrigger
                  placement="top"
                  overlay={(props) => (
                    <Tooltip id="location-hidden-tooltip" {...props}>
                      Sign in to see location
                    </Tooltip>
                  )}
                >
                  <span>
                    <BsEyeSlash />
                  </span>
                </OverlayTrigger>
              ) : (
                toLocationsSummary(listing.course, user?.hasEvals)
              )}
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
          <span className={colStyles.addedCol}>
            <span className={styles.ellipsisText}>{timeAdded}</span>
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
