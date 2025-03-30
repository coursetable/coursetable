import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Button,
  Collapse,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from 'react-bootstrap';
import { MdInfoOutline } from 'react-icons/md';
import chroma from 'chroma-js';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import {
  updateWorksheetMetadata,
  updateWorksheetCourses,
} from '../../queries/api';
import { useStore } from '../../store';
import { ratingColormap } from '../../utilities/constants';
import {
  getOverallRatings,
  getWorkloadRatings,
  isDiscussionSection,
} from '../../utilities/course';
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

const formatter = new Intl.ListFormat('en-US', {
  style: 'long',
  type: 'conjunction',
});

function NoStatsTip({
  coursesWithoutRating,
  coursesWithRating,
}: {
  readonly coursesWithoutRating: string[];
  readonly coursesWithRating: number;
}) {
  return (
    coursesWithoutRating.length > 0 && (
      <OverlayTrigger
        placement="top"
        overlay={(props) => (
          <Tooltip {...props} id="conflict-icon-button-tooltip">
            <small>
              Computed with {coursesWithRating} course
              {coursesWithRating === 1 ? '' : 's'}.{' '}
              {formatter.format(coursesWithoutRating)} ha
              {coursesWithoutRating.length > 1 ? 've' : 's'} no ratings.
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
  const { courses, isExoticWorksheet, exitExoticWorksheet } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      isExoticWorksheet: state.worksheetMemo.getIsExoticWorksheet(state),
      exitExoticWorksheet: state.exitExoticWorksheet,
    })),
  );
  const user = useStore((state) => state.user);
  const countedCourseCodes = new Set();
  let courseCnt = 0;
  let credits = 0;
  let workload = 0;
  let rating = 0;
  const skillsAreas: { courseCode: string; label: string }[] = [];
  const coursesWithoutRating: string[] = [];
  const coursesWithoutWorkload: string[] = [];

  for (const { listing, hidden } of courses) {
    const alreadyCounted = listing.course.listings.some((l) =>
      countedCourseCodes.has(l.course_code),
    );

    // Don't count in one of the following cases:
    // - Cross-listing has been counted
    // - Another section has been counted (we just randomly pick one)
    // - Is discussion section (no ratings or credits)
    // - Is hidden
    if (alreadyCounted || hidden || isDiscussionSection(listing.course))
      continue;

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
    rating += courseRating ?? 0;
    skillsAreas.push(
      ...[...listing.course.skills, ...listing.course.areas].map((x) => ({
        courseCode: listing.course_code,
        label: x,
      })),
    );
  }
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
                    <Tooltip id="login-tooltip">
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
                    <Tooltip id="login-tooltip">
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
              <div className={styles.wide}>
                <dt>Skills & Areas</dt>
                <dd>
                  {skillsAreas
                    .sort((a, b) => a.label.localeCompare(b.label, 'en-US'))
                    .map((x, i) => (
                      <OverlayTrigger
                        key={i}
                        overlay={<Tooltip>{x.courseCode}</Tooltip>}
                      >
                        <span>
                          <SkillBadge skill={x.label} />
                        </span>
                      </OverlayTrigger>
                    ))}
                </dd>
              </div>
            </dl>
            <div className={styles.spacer} />
            <dl>
              {!isExoticWorksheet && (
                <div className={styles.wide}>
                  <dt>Viewing exported worksheet</dt>
                  <div className={styles.buttonGroup}>
                    <Button variant="primary" onClick={exitExoticWorksheet}>
                      Exit
                    </Button>
                    <Dropdown>
                      <Dropdown.Toggle variant="primary" id="import-dropdown">
                        Import Into
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item>Existing worksheet</Dropdown.Item>
                        <Dropdown.Item
                          onClick={async () => {
                            const {
                              viewedSeason,
                              viewedWorksheetNumber,
                              curWorksheet,
                            } = useStore.getState();
                            const season = viewedSeason;
                            const worksheetNumber = viewedWorksheetNumber;
                            const worksheet = curWorksheet
                              .get(season)
                              ?.get(worksheetNumber);

                            console.log(worksheet);

                            if (!worksheet) {
                              toast.error('Could not find current worksheet');
                              return;
                            }

                            const numWorksheets =
                              curWorksheet.get(season)?.size ?? 0;

                            // Create new worksheet
                            const success = await updateWorksheetMetadata({
                              season,
                              action: 'add',
                              name: `${worksheet.name} (Copy)`,
                            });

                            console.log(success);

                            if (!success) {
                              toast.error('Failed to create new worksheet');
                              return;
                            }

                            for (const course of worksheet.courses) {
                              await updateWorksheetCourses({
                                season,
                                crn: course.crn,
                                worksheetNumber: numWorksheets,
                                action: 'add',
                                color: course.color,
                                hidden: course.hidden ?? false,
                              });
                            }

                            toast.success('Worksheet duplicated successfully');
                          }}
                        >
                          New worksheet
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
