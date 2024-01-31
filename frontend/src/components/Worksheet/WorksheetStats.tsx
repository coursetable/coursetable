import React, { useState } from 'react';
import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdInfoOutline } from 'react-icons/md';
import clsx from 'clsx';
import chroma from 'chroma-js';
import SkillBadge from '../SkillBadge';
import { useTheme } from '../../contexts/themeContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { ratingColormap } from '../../utilities/constants';
import { getOverallRatings, getWorkloadRatings } from '../../utilities/course';
import styles from './WorksheetStats.module.css';

function StatPill({
  colorMap,
  stat,
  children,
}: (
  | {
      readonly colorMap: chroma.Scale;
      readonly stat: number;
    }
  | {
      readonly colorMap?: never;
      readonly stat?: never;
    }
) & { readonly children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <span
      className={clsx(styles.statPill, colorMap && styles.hasStat)}
      style={{
        backgroundColor: colorMap
          ? colorMap(stat)
              .alpha(theme === 'light' ? 1 : 0.75)
              .css()
          : undefined,
      }}
    >
      {children}
    </span>
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
export default function WorksheetStats() {
  const [shown, setShown] = useState(true);
  const { courses, hiddenCourses, curSeason } = useWorksheet();
  const countedCourseCodes = new Set();
  let courseCnt = 0;
  let credits = 0;
  let workload = 0;
  let rating = 0;
  const skillsAreas: string[] = [];
  const coursesWithoutRating: string[] = [];
  const coursesWithoutWorkload: string[] = [];

  for (const { listing: course } of courses) {
    // See if any of the course's codes have already been counted or if it's
    // hidden so we don't double count
    const alreadyCounted = course.all_course_codes.some((code) =>
      countedCourseCodes.has(code),
    );
    const isHidden = Boolean(hiddenCourses[curSeason]?.[course.crn]);

    if (alreadyCounted || isHidden || !course.credits) continue;

    // Mark codes as counted, no double counting
    course.all_course_codes.forEach((code) => {
      countedCourseCodes.add(code);
    });
    const courseRating = getOverallRatings(course, 'stat');
    const courseWorkload = getWorkloadRatings(course, 'stat');
    if (!courseRating) coursesWithoutRating.push(course.course_code);
    if (!courseWorkload) coursesWithoutWorkload.push(course.course_code);
    courseCnt++;
    credits += course.credits;
    workload += courseWorkload ?? 0;
    rating += courseRating ?? 0;
    skillsAreas.push(...course.skills, ...course.areas);
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
            <ul>
              <li>
                <StatPill>Total courses</StatPill>
                <StatPill colorMap={courseNumberColormap} stat={courseCnt}>
                  {courseCnt}
                </StatPill>
              </li>
              <li>
                <StatPill>Total credits</StatPill>
                <StatPill colorMap={creditColormap} stat={credits}>
                  {credits}
                </StatPill>
              </li>
              <li>
                <StatPill>
                  Total workload
                  {coursesWithoutWorkload.length > 0 && (
                    <OverlayTrigger
                      placement="top"
                      overlay={(props) => (
                        <Tooltip {...props} id="conflict-icon-button-tooltip">
                          <small style={{ fontWeight: 500 }}>
                            Computed with {coursesWithWorkload} course
                            {coursesWithWorkload === 1 ? '' : 's'}.{' '}
                            {formatter.format(coursesWithoutWorkload)} ha
                            {coursesWithoutWorkload.length > 1 ? 've' : 's'} no
                            ratings.
                          </small>
                        </Tooltip>
                      )}
                    >
                      <MdInfoOutline className={styles.infoIcon} />
                    </OverlayTrigger>
                  )}
                </StatPill>
                <StatPill colorMap={workloadColormap} stat={workload}>
                  {workload.toFixed(2)}
                </StatPill>
              </li>
              <li>
                <StatPill>
                  Average rating
                  {coursesWithoutRating.length > 0 && (
                    <OverlayTrigger
                      placement="top"
                      overlay={(props) => (
                        <Tooltip {...props} id="conflict-icon-button-tooltip">
                          <small style={{ fontWeight: 500 }}>
                            Computed with {coursesWithRating} course
                            {coursesWithRating === 1 ? '' : 's'}.{' '}
                            {formatter.format(coursesWithoutRating)} ha
                            {coursesWithoutRating.length > 1 ? 've' : 's'} no
                            ratings.
                          </small>
                        </Tooltip>
                      )}
                    >
                      <MdInfoOutline className={styles.infoIcon} />
                    </OverlayTrigger>
                  )}
                </StatPill>
                <StatPill colorMap={ratingColormap} stat={avgRating}>
                  {avgRating.toFixed(2)}
                </StatPill>
              </li>
              <li className={styles.wide}>
                <StatPill>Skills & Areas</StatPill>
                <StatPill>
                  {skillsAreas.sort().map((skill, i) => (
                    <SkillBadge skill={skill} key={i} />
                  ))}
                </StatPill>
              </li>
            </ul>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
