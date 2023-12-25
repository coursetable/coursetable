import React, { useState } from 'react';
import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdInfoOutline } from 'react-icons/md';
import styled from 'styled-components';
import clsx from 'clsx';
import chroma from 'chroma-js';
import SkillBadge from '../SkillBadge';
import { useWorksheet } from '../../contexts/worksheetContext';
import { ratingColormap } from '../../utilities/constants';
import { getOverallRatings, getWorkloadRatings } from '../../utilities/course';
import styles from './WorksheetStats.module.css';

const StyledStatPill = styled.span<
  { colormap: chroma.Scale; stat: number } | { colormap?: never; stat?: never }
>`
  background-color: ${({ theme, colormap, stat }) =>
    colormap
      ? colormap(stat).alpha(theme.ratingAlpha).css()
      : theme.surface[0]};
  color: ${({ theme, stat }) => (stat ? '#141414' : theme.text[0])};
`;

const StyledInfo = styled(MdInfoOutline)`
  color: ${({ theme }) => theme.primary};
`;

const courseNumberColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([4, 6]);
const creditColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([4, 5.5]);
const workloadColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([12, 20]);

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

  for (const course of courses) {
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
                <StyledStatPill>Total courses</StyledStatPill>
                <StyledStatPill
                  colormap={courseNumberColormap}
                  stat={courseCnt}
                >
                  {courseCnt}
                </StyledStatPill>
              </li>
              <li>
                <StyledStatPill>Total credits</StyledStatPill>
                <StyledStatPill colormap={creditColormap} stat={credits}>
                  {credits}
                </StyledStatPill>
              </li>
              <li>
                <StyledStatPill>
                  Total workload
                  {coursesWithoutWorkload.length > 0 && (
                    <OverlayTrigger
                      placement="top"
                      overlay={(props) => (
                        <Tooltip {...props} id="conflict-icon-button-tooltip">
                          <small style={{ fontWeight: 500 }}>
                            Computed with {coursesWithWorkload} courses.{' '}
                            {coursesWithoutWorkload.join(', ')} have no ratings.
                          </small>
                        </Tooltip>
                      )}
                    >
                      <StyledInfo />
                    </OverlayTrigger>
                  )}
                </StyledStatPill>
                <StyledStatPill colormap={workloadColormap} stat={workload}>
                  {workload.toFixed(2)}
                </StyledStatPill>
              </li>
              <li>
                <StyledStatPill>
                  Average rating
                  {coursesWithoutRating.length > 0 && (
                    <OverlayTrigger
                      placement="top"
                      overlay={(props) => (
                        <Tooltip {...props} id="conflict-icon-button-tooltip">
                          <small style={{ fontWeight: 500 }}>
                            Computed with {coursesWithRating} courses.{' '}
                            {coursesWithoutRating.join(', ')} have no ratings.
                          </small>
                        </Tooltip>
                      )}
                    >
                      <StyledInfo />
                    </OverlayTrigger>
                  )}
                </StyledStatPill>
                <StyledStatPill colormap={ratingColormap} stat={avgRating}>
                  {avgRating.toFixed(2)}
                </StyledStatPill>
              </li>
              <li className={styles.wide}>
                <StyledStatPill>Skills & Areas</StyledStatPill>
                <StyledStatPill>
                  {skillsAreas.sort().map((skill, i) => (
                    <SkillBadge skill={skill} key={i} />
                  ))}
                </StyledStatPill>
              </li>
            </ul>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
