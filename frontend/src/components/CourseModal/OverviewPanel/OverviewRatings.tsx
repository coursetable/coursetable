import React, { useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Form, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { AiOutlineStar } from 'react-icons/ai';
import { BiBookOpen } from 'react-icons/bi';
import { IoPersonOutline } from 'react-icons/io5';
import type chroma from 'chroma-js';
import MultiToggle from 'react-multi-toggle';
import { useShallow } from 'zustand/react/shallow';

import {
  useModalHistory,
  type Store,
} from '../../../contexts/modalHistoryContext';
import type { CourseModalOverviewDataQuery } from '../../../generated/graphql-types';
import { useStore } from '../../../store';
import { generateRandomColor } from '../../../utilities/common';
import { ratingColormap, workloadColormap } from '../../../utilities/constants';
import { isDiscussionSection } from '../../../utilities/course';
import { createProfModalLink } from '../../../utilities/display';
import RelatedCoursesList from '../../RelatedCoursesList';
import { RatingBubble } from '../../Typography';
import type { ModalNavigationFunction } from '../CourseModal';

import styles from './OverviewRatings.module.css';
import './react-multi-toggle-override.css';

type Filter = 'course' | 'professor';

type RelatedCourseInfo = CourseModalOverviewDataQuery['sameCourse'][number];

type CourseProfessor = { professor: { professor_id: number } };

// Hold index of each filter option
const optionsIndx = {
  course: 0,
  professor: 1,
};

function average(values: readonly number[]) {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function professorKey(courseProfessors: readonly CourseProfessor[]) {
  return [...courseProfessors]
    .map((p) => p.professor.professor_id)
    .sort((a, b) => a - b)
    .join('-');
}

function createProfSummary(
  courseProfessors: RelatedCourseInfo['course_professors'],
  navigate: Store['navigate'],
  searchParams: URLSearchParams,
) {
  const profsByName = courseProfessors.toSorted((a, b) =>
    a.professor.name.localeCompare(b.professor.name, 'en-US'),
  );
  const names = profsByName.map((prof) => prof.professor.name);
  const links = (
    <>
      {profsByName.map((prof, i) => {
        // TODO: TS doesn't understand how to map over an intersection of arrays
        const professor =
          prof.professor as RelatedCourseInfo['course_professors'][number]['professor'];
        return (
          <React.Fragment key={professor.professor_id}>
            <Link
              key={professor.professor_id}
              to={createProfModalLink(professor.professor_id, searchParams)}
              onClick={() => {
                navigate('push', {
                  type: 'professor',
                  data: professor.professor_id,
                });
              }}
            >
              {prof.professor.name}
            </Link>
            {professor.average_rating && (
              <>
                {' '}
                <Badge
                  bg="none"
                  className="mx-1 mb-1"
                  style={{
                    backgroundColor: ratingColormap(
                      professor.average_rating,
                    ).css(),
                    color: 'var(--color-text-dark)',
                  }}
                >
                  {professor.average_rating.toFixed(1)}
                </Badge>
              </>
            )}
            {i < courseProfessors.length - 1 ? ' • ' : ''}
          </React.Fragment>
        );
      })}
    </>
  );
  return { key: names.join(' • '), links };
}

function AggregateRating({
  label,
  Icon,
  stat,
  display,
  colorMap,
  tooltip,
  hasEvals,
  randomSeed,
}: {
  readonly label: string;
  readonly Icon: React.ComponentType<{ readonly size?: number }>;
  readonly stat: number | null;
  readonly display: string;
  readonly colorMap: chroma.Scale;
  readonly tooltip: React.ReactNode;
  readonly hasEvals: boolean | undefined;
  readonly randomSeed: string;
}) {
  const accessPrompt =
    hasEvals === false ? 'Complete the challenge' : 'Sign in';
  return (
    <OverlayTrigger
      placement="top"
      overlay={(props) => (
        <Tooltip id={`aggregate-${label.toLowerCase()}`} {...props}>
          {hasEvals ? (
            tooltip
          ) : (
            <span>
              These colors are randomly generated. {accessPrompt} to see real
              ratings.
            </span>
          )}
        </Tooltip>
      )}
    >
      <div
        className={styles.aggregateItem}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        aria-label={
          hasEvals
            ? `${label}: ${display}`
            : `${label}: ${accessPrompt} to see rating`
        }
      >
        <div className={styles.aggregateLabel}>
          <Icon size={14} /> {label}
        </div>
        {hasEvals ? (
          <RatingBubble
            rating={stat}
            colorMap={colorMap}
            className={styles.aggregateRatingCell}
          >
            {display}
          </RatingBubble>
        ) : (
          <RatingBubble
            color={generateRandomColor(randomSeed)}
            className={styles.aggregateRatingCell}
          />
        )}
      </div>
    </OverlayTrigger>
  );
}

function OverviewRatings({
  onNavigation,
  listing,
  sameCourse,
}: {
  readonly onNavigation: ModalNavigationFunction;
  readonly listing: NonNullable<CourseModalOverviewDataQuery['self']>;
  readonly sameCourse: RelatedCourseInfo[];
}) {
  const [searchParams] = useSearchParams();
  const { navigate } = useModalHistory();
  const hasEvals = useStore((state) => state.user?.hasEvals);
  const sameCourseNormalized = sameCourse
    .filter((o) => !isDiscussionSection(o) && o.extra_info === 'ACTIVE')
    .sort(
      (a, b) =>
        b.season_code.localeCompare(a.season_code, 'en-US') ||
        parseInt(a.section, 10) - parseInt(b.section, 10),
    );

  const options = [
    { displayName: `Course (${sameCourseNormalized.length})`, value: 'course' },
    { displayName: 'Prof', value: 'professor' },
  ] as const;
  const [filter, setFilter] = useState<Filter>('course');
  const { groupSameProf, togglePref } = useStore(
    useShallow((state) => ({
      groupSameProf: state.coursePref.groupSameProf,
      togglePref: state.togglePref,
    })),
  );
  const listingProfessorSetKey = professorKey(
    listing.course.course_professors as unknown as CourseProfessor[],
  );
  let sameRatingSum = 0;
  let sameRatingCount = 0;
  let allRatingSum = 0;
  let allRatingCount = 0;
  let sameWorkloadSum = 0;
  let sameWorkloadCount = 0;
  let allWorkloadSum = 0;
  let allWorkloadCount = 0;
  for (const course of sameCourseNormalized) {
    const courseProfKey = professorKey(
      course.course_professors as unknown as CourseProfessor[],
    );
    const isSameProf = courseProfKey === listingProfessorSetKey;
    const avgRating = course.evaluation_statistic?.avg_rating;
    if (typeof avgRating === 'number') {
      allRatingSum += avgRating;
      allRatingCount += 1;
      if (isSameProf) {
        sameRatingSum += avgRating;
        sameRatingCount += 1;
      }
    }
    const avgWorkload = course.evaluation_statistic?.avg_workload;
    if (typeof avgWorkload === 'number') {
      allWorkloadSum += avgWorkload;
      allWorkloadCount += 1;
      if (isSameProf) {
        sameWorkloadSum += avgWorkload;
        sameWorkloadCount += 1;
      }
    }
  }
  const overallSameProf =
    sameRatingCount > 0 ? sameRatingSum / sameRatingCount : null;
  const overallAll = allRatingCount > 0 ? allRatingSum / allRatingCount : null;
  const overallStat = overallSameProf ?? overallAll;
  const overallDisplay =
    overallSameProf !== null
      ? overallSameProf.toFixed(1)
      : overallAll !== null
        ? `~${overallAll.toFixed(1)}`
        : 'N/A';

  const workloadSameProf =
    sameWorkloadCount > 0 ? sameWorkloadSum / sameWorkloadCount : null;
  const workloadAll =
    allWorkloadCount > 0 ? allWorkloadSum / allWorkloadCount : null;
  const workloadStat = workloadSameProf ?? workloadAll;
  const workloadDisplay =
    workloadSameProf !== null
      ? workloadSameProf.toFixed(1)
      : workloadAll !== null
        ? `~${workloadAll.toFixed(1)}`
        : 'N/A';

  const professorStat = average(
    listing.course.course_professors
      .map((p) => p.professor.average_rating)
      .filter((x): x is number => typeof x === 'number'),
  );
  const professorDisplay =
    professorStat !== null ? professorStat.toFixed(1) : 'N/A';

  const coursesByProf = new Map<
    string,
    { title: ReactNode; courses: RelatedCourseInfo[] }
  >();
  // We need to add the listing's professor first, so it appears first in
  // the list
  const { key: listingProfKey, links: listingProfLinks } = createProfSummary(
    listing.course.course_professors,
    navigate,
    searchParams,
  );
  coursesByProf.set(listingProfKey, { title: listingProfLinks, courses: [] });
  for (const course of sameCourseNormalized) {
    const { key, links } = createProfSummary(
      course.course_professors,
      navigate,
      searchParams,
    );
    if (!coursesByProf.has(key))
      coursesByProf.set(key, { title: links, courses: [course] });
    else coursesByProf.get(key)!.courses.push(course);
  }
  return (
    <>
      <div className={styles.aggregateContainer}>
        <div className={styles.aggregateRow}>
          <AggregateRating
            label="Overall"
            Icon={AiOutlineStar}
            stat={overallStat}
            display={overallDisplay}
            colorMap={ratingColormap}
            tooltip={
              <span>
                Average course rating
                <br />
                (same professor and all cross-listed courses. If this professor
                hasn't taught the course before, a ~ denotes an average across
                all professors)
              </span>
            }
            hasEvals={hasEvals}
            randomSeed={`${listing.course_code}${listing.crn}overall-agg`}
          />
          <AggregateRating
            label="Work"
            Icon={BiBookOpen}
            stat={workloadStat}
            display={workloadDisplay}
            colorMap={workloadColormap}
            tooltip={
              <span>
                Average workload rating
                <br />
                (same professor and all cross-listed courses. If this professor
                hasn't taught the course before, a ~ denotes an average across
                all professors)
              </span>
            }
            hasEvals={hasEvals}
            randomSeed={`${listing.course_code}${listing.crn}workload-agg`}
          />
          <AggregateRating
            label="Prof"
            Icon={IoPersonOutline}
            stat={professorStat}
            display={professorDisplay}
            colorMap={ratingColormap}
            tooltip={
              <span>
                Average professor course rating
                <br />
                (if there are multiple professors, we take the average between
                them)
              </span>
            }
            hasEvals={hasEvals}
            randomSeed={`${listing.course_code}${listing.crn}prof-agg`}
          />
        </div>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={styles.filterContainer}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
            setFilter(options[(optionsIndx[filter] + 1) % 2]!.value);
        }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <MultiToggle
          options={options}
          selectedOption={filter}
          onSelectOption={(val) => setFilter(val)}
          className={clsx(styles.evaluationsFilter, 'mb-2')}
        />
      </div>
      {filter === 'professor' ? (
        <div className="alert alert-info m-3">
          <p>
            We've moved! To view course offerings by each professor, click on
            their name on the left, or select from the list below.
          </p>
          <ul>
            {listing.course.course_professors.map((prof) => (
              <li key={prof.professor.professor_id}>
                <Link
                  to={createProfModalLink(
                    prof.professor.professor_id,
                    searchParams,
                  )}
                  onClick={() => {
                    navigate('push', {
                      type: 'professor',
                      data: prof.professor.professor_id,
                    });
                  }}
                >
                  {prof.professor.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : sameCourseNormalized.length !== 0 ? (
        <>
          <Form.Check type="switch">
            <Form.Check.Input
              checked={groupSameProf}
              onChange={() => {
                togglePref('coursePref', 'groupSameProf');
              }}
            />
            <Form.Check.Label
              onClick={() => {
                togglePref('coursePref', 'groupSameProf');
              }}
            >
              Group by professors
            </Form.Check.Label>
          </Form.Check>
          <RelatedCoursesList
            listing={listing}
            courses={groupSameProf ? coursesByProf : sameCourseNormalized}
            usesSameCourse
            columns={
              groupSameProf
                ? ['rating', 'workload']
                : ['rating', 'professor', 'workload']
            }
            columnWidth={2}
            onNavigation={onNavigation}
            extraText={(c) =>
              groupSameProf
                ? `Section ${c.section}`
                : c.course_professors.length === 0
                  ? 'TBA'
                  : `${c.course_professors[0]!.professor.name}${c.course_professors.length > 1 ? ` +${c.course_professors.length - 1}` : ''}`
            }
          />
        </>
      ) : (
        <div className="m-auto text-center">
          <strong>No results</strong>
        </div>
      )}
    </>
  );
}

export default OverviewRatings;
