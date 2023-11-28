import React from 'react';
import styled from 'styled-components';
import chroma from 'chroma-js';
import { useWorksheet } from '../../contexts/worksheetContext';
import { ratingColormap } from '../../queries/Constants';
import styles from './WorksheetStats.module.css';

const StyledStatPill = styled.span<{ bgColor?: string }>`
  background-color: ${({ theme, bgColor }) => bgColor ?? theme.surface[0]};
`;

const courseNumberColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([4, 6]);
const creditColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([4, 5.5]);
const workloadColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([12, 24]);

export default function WorksheetStats() {
  const { courses, hidden_courses, cur_season } = useWorksheet();
  const { courseCnt, credits, workload, rating } = courses.reduce(
    (acc, c) =>
      hidden_courses[cur_season]?.[c.crn]
        ? acc
        : {
            courseCnt: acc.courseCnt + 1,
            credits: acc.credits + (c.credits ?? 0),
            workload: acc.workload + (c.average_workload ?? 0),
            rating: acc.rating + (c.average_rating ?? 0),
          },
    { courseCnt: 0, credits: 0, workload: 0, rating: 0 },
  );
  const avgRating = courseCnt === 0 ? 0 : rating / courseCnt;
  return (
    <div className={styles.stats}>
      <ul>
        <li>
          <StyledStatPill>Total courses</StyledStatPill>
          <StyledStatPill bgColor={courseNumberColormap(courseCnt).css()}>
            {courseCnt}
          </StyledStatPill>
        </li>
        <li>
          <StyledStatPill>Total credits</StyledStatPill>
          <StyledStatPill bgColor={creditColormap(credits).css()}>
            {credits}
          </StyledStatPill>
        </li>
        <li>
          <StyledStatPill>Total workload</StyledStatPill>
          <StyledStatPill bgColor={workloadColormap(workload).css()}>
            {workload.toFixed(2)}
          </StyledStatPill>
        </li>
        <li>
          <StyledStatPill>Average rating</StyledStatPill>
          <StyledStatPill bgColor={ratingColormap(avgRating).css()}>
            {avgRating.toFixed(2)}
          </StyledStatPill>
        </li>
      </ul>
    </div>
  );
}
