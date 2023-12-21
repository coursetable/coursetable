import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import styled from 'styled-components';
import chroma from 'chroma-js';
import SkillBadge from '../SkillBadge';
import { useWorksheet } from '../../contexts/worksheetContext';
import { ratingColormap } from '../../utilities/constants';
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

  const {
    courseCnt,
    coursesWithRating,
    credits,
    workload,
    rating,
    skillsAreas,
  } = courses.reduce(
    (acc, c) => {
      // See if any of the course's codes have already been counted or if it's
      // hidden so we don't double count
      const shouldNotCount =
        c.all_course_codes.some((code) => countedCourseCodes.has(code)) ||
        hiddenCourses[curSeason]?.[c.crn];
      const useCourseInfo = c.credits;

      if (shouldNotCount || !useCourseInfo) return acc;

      // Mark codes as counted, no double counting
      c.all_course_codes.forEach((code) => {
        countedCourseCodes.add(code);
      });

      return {
        courseCnt: acc.courseCnt + 1,
        coursesWithRating: acc.coursesWithRating + (c.average_rating ? 1 : 0),
        credits: acc.credits + (c.credits ?? 0),
        workload: acc.workload + (c.average_workload ?? 0),
        rating: acc.rating + (c.average_rating ?? 0),
        skillsAreas: [...acc.skillsAreas, ...c.skills, ...c.areas],
      };
    },
    {
      courseCnt: 0,
      coursesWithRating: 0,
      credits: 0,
      workload: 0,
      rating: 0,
      skillsAreas: [] as string[],
    },
  );

  const avgRating = coursesWithRating === 0 ? 0 : rating / coursesWithRating;
  return (
    <div
      className={`${shown ? 'dropdown' : 'dropup'} ${styles.statsContainer}`}
    >
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
                <StyledStatPill>Total workload</StyledStatPill>
                <StyledStatPill colormap={workloadColormap} stat={workload}>
                  {workload.toFixed(2)}
                </StyledStatPill>
              </li>
              <li>
                <StyledStatPill>Average rating</StyledStatPill>
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
