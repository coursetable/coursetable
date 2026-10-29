import React, { useId, useState } from 'react';
import clsx from 'clsx';
import { Button, Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdInfoOutline } from 'react-icons/md';
import chroma from 'chroma-js';
import { useShallow } from 'zustand/react/shallow';
import type { CatalogListing } from '../../queries/api';
import { usePastCourseMeetingsQuery } from '../../queries/graphql-queries';
import { useStore } from '../../store';
import {
  getWeeklyMeetingHours,
  summarizeClassHours,
} from '../../utilities/classHours';
import { ratingColormap } from '../../utilities/constants';
import {
  getOverallRatings,
  getWorkloadRatings,
  isDiscussionSection,
  toSeasonString,
  toTimesSummary,
} from '../../utilities/course';
import { getWeightedWorkload, WORKLOAD_PIVOT } from '../../utilities/workload';
import BetaPill from '../BetaPill';
import SkillBadge from '../SkillBadge';

import styles from './WorksheetStats.module.css';

function StatPill({
  colorMap,
  stat,
  children,
}: {
  readonly colorMap: chroma.Scale;
  readonly stat: number;
  readonly children: React.ReactNode;
}) {
  const theme = useStore((state) => state.theme);
  return (
    <dd
      className={styles.statPill}
      style={{
        backgroundColor: colorMap(stat)
          .alpha(theme === 'light' ? 1 : 0.75)
          .css(),
      }}
    >
      {children}
    </dd>
  );
}

const courseNumberColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([4, 6]);
const creditColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([4, 5.5]);
const workloadColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([12, 20]);
const classHoursColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([8, 20]);
// Neutral while estimates load, so the color doesn't jump once they arrive
const pendingColormap = chroma.scale(['#bdbdbd', '#bdbdbd']);

const formatHours = (hours: number) => String(Number(hours.toFixed(2)));

const formatter = new Intl.ListFormat('en-US', {
  style: 'long',
  type: 'conjunction',
});

function NoStatsTip({
  coursesWithoutRating,
  coursesWithRating,
  missingLabel = 'ratings',
}: {
  readonly coursesWithoutRating: string[];
  readonly coursesWithRating: number;
  readonly missingLabel?: string;
}) {
  const id = useId();
  return (
    coursesWithoutRating.length > 0 && (
      <OverlayTrigger
        placement="top"
        overlay={(props) => (
          <Tooltip {...props} id={`worksheet-stats-missing-tooltip-${id}`}>
            <small>
              Computed with {coursesWithRating} course
              {coursesWithRating === 1 ? '' : 's'}.{' '}
              {formatter.format(coursesWithoutRating)} ha
              {coursesWithoutRating.length > 1 ? 've' : 's'} no {missingLabel}.
            </small>
          </Tooltip>
        )}
      >
        <span>
          <MdInfoOutline className={styles.infoIcon} />
        </span>
      </OverlayTrigger>
    )
  );
}

export default function WorksheetStats() {
  const [shown, setShown] = useState(true);
  const {
    courses,
    isExoticWorksheet,
    exoticWorksheet,
    exitExoticWorksheet,
    isMobile,
  } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      isExoticWorksheet: state.worksheetMemo.getIsExoticWorksheet(state),
      exoticWorksheet: state.exoticWorksheet,
      exitExoticWorksheet: state.exitExoticWorksheet,
      isMobile: state.isMobile,
    })),
  );
  const user = useStore((state) => state.user);
  const seasonCode = courses[0]?.listing.course.season_code;
  const sameCourseIdsWithoutMeetings = [
    ...new Set(
      courses
        .filter(
          (c) =>
            !c.hidden &&
            getWeeklyMeetingHours(c.listing.course.course_meetings) === 0,
        )
        .map((c) => c.listing.course.same_course_id),
    ),
  ];
  const {
    data: pastMeetingsData,
    loading: pastMeetingsLoading,
    error: pastMeetingsError,
  } = usePastCourseMeetingsQuery({
    variables: {
      sameCourseIds: sameCourseIdsWithoutMeetings,
      seasonCode: seasonCode ?? '',
    },
    skip: !seasonCode || sameCourseIdsWithoutMeetings.length === 0,
  });
  const pastOfferings = pastMeetingsData?.courses ?? [];
  const countedCourseCodes = new Set();
  const countedDiscussionCodes = new Set();
  let courseCnt = 0;
  let credits = 0;
  let workload = 0;
  let weightedWorkload = 0;
  let heaviestCourse: { courseCode: string; workload: number } | undefined =
    undefined;
  let rating = 0;
  const skillsAreas: { courseCode: string; label: string }[] = [];
  const coursesWithoutRating: string[] = [];
  const coursesWithoutWorkload: string[] = [];
  // Listings that count toward class hours, after deduplication
  const classHoursListings: CatalogListing[] = [];

  for (const { listing, hidden } of courses) {
    if (hidden) continue;
    const alreadyCounted = listing.course.listings.some((l) =>
      countedCourseCodes.has(l.course_code),
    );

    // Discussion sections have no ratings or credits, but they still meet, so
    // they only count toward class hours (one section per course, like below)
    if (isDiscussionSection(listing.course)) {
      if (
        !listing.course.listings.some((l) =>
          countedDiscussionCodes.has(l.course_code),
        )
      ) {
        listing.course.listings.forEach((l) => {
          countedDiscussionCodes.add(l.course_code);
        });
        classHoursListings.push(listing);
      }
      continue;
    }

    // Don't count in one of the following cases:
    // - Cross-listing has been counted
    // - Another section has been counted (we just randomly pick one)
    if (alreadyCounted) continue;

    // Mark codes as counted, no double counting
    listing.course.listings.forEach((l) => {
      countedCourseCodes.add(l.course_code);
    });
    const courseRating = getOverallRatings(listing.course, 'stat');
    const courseWorkload = getWorkloadRatings(listing.course, 'stat');
    if (!courseRating) coursesWithoutRating.push(listing.course_code);
    if (!courseWorkload) coursesWithoutWorkload.push(listing.course_code);
    courseCnt++;
    credits += listing.course.credits ?? 0;
    workload += courseWorkload ?? 0;
    weightedWorkload += getWeightedWorkload(courseWorkload ?? 0);
    if (courseWorkload && courseWorkload > (heaviestCourse?.workload ?? 0)) {
      heaviestCourse = {
        courseCode: listing.course_code,
        workload: courseWorkload,
      };
    }
    rating += courseRating ?? 0;
    classHoursListings.push(listing);
    skillsAreas.push(
      ...[...listing.course.skills, ...listing.course.areas].map((x) => ({
        courseCode: listing.course_code,
        label: x,
      })),
    );
  }
  const classHours = summarizeClassHours(
    classHoursListings,
    pastOfferings,
    pastMeetingsLoading,
  );
  const coursesWithWorkload = courseCnt - coursesWithoutWorkload.length;
  const coursesWithRating = courseCnt - coursesWithoutRating.length;

  const avgRating = coursesWithRating === 0 ? 0 : rating / coursesWithRating;
  return (
    <div className={clsx(shown ? 'dropdown' : 'dropup', styles.statsContainer)}>
      <div className={styles.toggleButton}>
        <button
          type="button"
          className="dropdown-toggle"
          onClick={() => setShown(!shown)}
        >
          Summary
        </button>
      </div>
      <Collapse in={shown}>
        <div>
          <div className={styles.stats}>
            {isExoticWorksheet && exoticWorksheet?.data && (
              <div className={styles.worksheetInfo}>
                <div className={styles.worksheetName}>
                  {exoticWorksheet.data.name}
                </div>
                {exoticWorksheet.data.creatorName && (
                  <div className={styles.creatorName}>
                    by {exoticWorksheet.data.creatorName}
                  </div>
                )}
              </div>
            )}
            <dl>
              <div>
                <dt>Total courses</dt>
                <StatPill colorMap={courseNumberColormap} stat={courseCnt}>
                  {courseCnt}
                </StatPill>
              </div>
              <div>
                <dt>Total credits</dt>
                <StatPill colorMap={creditColormap} stat={credits}>
                  {credits}
                </StatPill>
              </div>
              <div>
                <dt>
                  Hours in class
                  <NoStatsTip
                    coursesWithoutRating={classHours.missing}
                    coursesWithRating={classHours.courseCount}
                    missingLabel={
                      pastMeetingsError
                        ? "meeting times (we couldn't look up past semesters)"
                        : 'meeting times'
                    }
                  />
                </dt>
                <StatPill
                  colorMap={
                    pastMeetingsLoading ? pendingColormap : classHoursColormap
                  }
                  stat={classHours.hours}
                >
                  {pastMeetingsLoading ? (
                    '…'
                  ) : classHours.estimates.length > 0 ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={(props) => (
                        <Tooltip
                          {...props}
                          id="worksheet-stats-class-hours-tooltip"
                        >
                          <small>
                            Estimated weekly hours.{' '}
                            {classHours.estimates.map((e) => (
                              <React.Fragment key={e.label}>
                                {e.label} has no meeting times yet, so we used{' '}
                                {toSeasonString(e.pastOffering.season_code)} (
                                {toTimesSummary(e.pastOffering)},{' '}
                                {formatHours(e.hours)} hrs/week).{' '}
                              </React.Fragment>
                            ))}
                          </small>
                        </Tooltip>
                      )}
                    >
                      <span className={styles.hoverHint}>
                        ~{formatHours(classHours.hours)}
                      </span>
                    </OverlayTrigger>
                  ) : (
                    formatHours(classHours.hours)
                  )}
                </StatPill>
              </div>
              {user?.hasEvals ? (
                <div>
                  <dt>
                    Average rating
                    <NoStatsTip
                      coursesWithoutRating={coursesWithoutRating}
                      coursesWithRating={coursesWithRating}
                    />
                  </dt>
                  <StatPill colorMap={ratingColormap} stat={avgRating}>
                    {avgRating.toFixed(2)}
                  </StatPill>
                </div>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="worksheet-stats-rating-login-tooltip">
                      <small>
                        {user ? 'Complete the challenge' : 'Sign in'} to see
                        ratings
                      </small>
                    </Tooltip>
                  }
                >
                  <div>
                    <dt>Average rating</dt>
                    <dd
                      className={styles.statPill}
                      style={{
                        backgroundColor: 'var(--color-primary)',
                      }}
                    />
                  </div>
                </OverlayTrigger>
              )}
              {user?.hasEvals ? (
                <div>
                  <dt>
                    Total workload
                    <NoStatsTip
                      coursesWithoutRating={coursesWithoutWorkload}
                      coursesWithRating={coursesWithWorkload}
                    />
                  </dt>
                  <StatPill colorMap={workloadColormap} stat={workload}>
                    {workload.toFixed(2)}
                  </StatPill>
                </div>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="worksheet-stats-workload-login-tooltip">
                      <small>
                        {user ? 'Complete the challenge' : 'Sign in'} to see
                        ratings
                      </small>
                    </Tooltip>
                  }
                >
                  <div>
                    <dt>Total workload</dt>
                    <dd
                      className={styles.statPill}
                      style={{
                        backgroundColor: 'var(--color-primary)',
                      }}
                    />
                  </div>
                </OverlayTrigger>
              )}
              {user?.hasEvals ? (
                <div>
                  <dt>
                    Weighted workload
                    <BetaPill className={styles.betaPill} />
                    <NoStatsTip
                      coursesWithoutRating={coursesWithoutWorkload}
                      coursesWithRating={coursesWithWorkload}
                    />
                  </dt>
                  <StatPill colorMap={workloadColormap} stat={weightedWorkload}>
                    <OverlayTrigger
                      placement="top"
                      overlay={(props) => (
                        <Tooltip
                          {...props}
                          id="worksheet-stats-weighted-workload-tooltip"
                        >
                          <small>
                            An experimental estimate of how heavy your worksheet
                            feels: one demanding course weighs more than two
                            light ones. Each course counts as workload ×
                            (workload ÷ {WORKLOAD_PIVOT}), so a typical course (
                            {WORKLOAD_PIVOT}) counts as itself, lighter courses
                            count less, and heavier ones more.
                            {heaviestCourse &&
                              ` Heaviest: ${heaviestCourse.courseCode} (${heaviestCourse.workload.toFixed(2)}).`}
                          </small>
                        </Tooltip>
                      )}
                    >
                      <span className={styles.hoverHint}>
                        {weightedWorkload.toFixed(2)}
                      </span>
                    </OverlayTrigger>
                  </StatPill>
                </div>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="worksheet-stats-weighted-workload-login-tooltip">
                      <small>
                        {user ? 'Complete the challenge' : 'Sign in'} to see
                        ratings
                      </small>
                    </Tooltip>
                  }
                >
                  <div>
                    <dt>
                      Weighted workload
                      <BetaPill className={styles.betaPill} />
                    </dt>
                    <dd
                      className={styles.statPill}
                      style={{
                        backgroundColor: 'var(--color-primary)',
                      }}
                    />
                  </div>
                </OverlayTrigger>
              )}
              <div className={styles.wide}>
                <dt>Skills & Areas</dt>
                <dd>
                  {skillsAreas
                    .sort((a, b) => a.label.localeCompare(b.label, 'en-US'))
                    .map((x, i) => (
                      <OverlayTrigger
                        key={i}
                        overlay={
                          <Tooltip id={`worksheet-stats-skill-${i}-tooltip`}>
                            {x.courseCode}
                          </Tooltip>
                        }
                      >
                        <span>
                          <SkillBadge skill={x.label} />
                        </span>
                      </OverlayTrigger>
                    ))}
                </dd>
              </div>
            </dl>
            {isExoticWorksheet && isMobile && (
              <>
                <div className={styles.spacer} />
                <dl>
                  <div className={styles.wide}>
                    <dt>Viewing exported worksheet</dt>
                    <Button variant="primary" onClick={exitExoticWorksheet}>
                      Exit
                    </Button>
                  </div>
                </dl>
              </>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
}
