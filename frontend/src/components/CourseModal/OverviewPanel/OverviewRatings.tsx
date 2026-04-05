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

import type { CourseModalOverviewDataQuery } from '../../../generated/graphql-types';
import { useModalHistory } from '../../../hooks/useModalHistory';
import type { ModalHistoryNavigateFn } from '../../../slices/ModalHistorySlice';
import { useStore } from '../../../store';
import { generateRandomColor } from '../../../utilities/common';
import { ratingColormap, workloadColormap } from '../../../utilities/constants';
import {
  getOverallRatings,
  getProfessorRatings,
  getWorkloadRatings,
  isDiscussionSection,
} from '../../../utilities/course';
import { createProfModalLink } from '../../../utilities/display';
import RelatedCoursesList from '../../RelatedCoursesList';
import { RatingBubble } from '../../Typography';
import type { ModalNavigationFunction } from '../CourseModal';

import styles from './OverviewRatings.module.css';
import './react-multi-toggle-override.css';

type Filter = 'course' | 'professor';

type RelatedCourseInfo = CourseModalOverviewDataQuery['sameCourse'][number];

// Hold index of each filter option
const optionsIndx = {
  course: 0,
  professor: 1,
};

function createProfSummary(
  courseProfessors: RelatedCourseInfo['course_professors'],
  navigate: ModalHistoryNavigateFn,
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
                navigate(
                  'push',
                  {
                    type: 'professor',
                    data: professor.professor_id,
                  },
                  searchParams,
                );
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

  const summaryCourse = listing.course;
  const overallStat = getOverallRatings(summaryCourse, 'stat');
  const overallDisplay = getOverallRatings(summaryCourse, 'display');
  const workloadStat = getWorkloadRatings(summaryCourse, 'stat');
  const workloadDisplay = getWorkloadRatings(summaryCourse, 'display');
  const professorStat = getProfessorRatings(summaryCourse, 'stat');
  const professorDisplay = getProfessorRatings(summaryCourse, 'display');

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
                Same course rating as catalog search: computed on the server
                across cross-listed sections. A ~ means the all-professors
                aggregate when same-professor data is unavailable.
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
                Same workload rating as catalog search: server aggregate across
                cross-listed sections. ~ indicates all-professors aggregate when
                same-professor data is unavailable.
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
                Same professor rating as the catalog Professor column for this
                offering (server aggregate).
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
          onSelectOption={(val: string) => setFilter(val as Filter)}
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
                    navigate(
                      'push',
                      {
                        type: 'professor',
                        data: prof.professor.professor_id,
                      },
                      searchParams,
                    );
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
          <Form.Check type="switch" className="mb-3">
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
