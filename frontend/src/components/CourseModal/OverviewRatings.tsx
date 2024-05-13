import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
  Popover,
} from 'react-bootstrap';
import MultiToggle from 'react-multi-toggle';

import type { CourseModalHeaderData } from './CourseModal';

import { CUR_YEAR } from '../../config';
import { useUser } from '../../contexts/userContext';
import type {
  RelatedCourseInfoFragment,
  SameCourseOrProfOfferingsQuery,
} from '../../generated/graphql-types';
import { generateRandomColor } from '../../utilities/common';
import { ratingColormap, workloadColormap } from '../../utilities/constants';
import { toSeasonString, isDiscussionSection } from '../../utilities/course';
import { useCourseModalLink } from '../../utilities/display';
import { RatingBubble } from '../Typography';

import styles from './OverviewRatings.module.css';
import './react-multi-toggle-override.css';

type Filter = 'both' | 'course' | 'professor';

// Hold index of each filter option
const optionsIndx = {
  course: 0,
  both: 1,
  professor: 2,
};

function RatingNumbers({
  course,
  hasEvals,
}: {
  readonly course: RelatedCourseInfoFragment;
  readonly hasEvals: boolean | undefined;
}) {
  // For random seeds
  const ratingIdentifier = `${course.course_id}${course.season_code}rating`;
  const workloadIdentifier = `${course.course_id}${course.season_code}workload`;
  const professorIdentifier = `${course.course_id}${course.season_code}professor`;

  const ratingBubbles = [
    {
      colorMap: ratingColormap,
      rating: course.evaluation_statistic?.avg_rating,
      identifier: ratingIdentifier,
    },
    {
      colorMap: ratingColormap,
      rating: course.average_professor_rating,
      identifier: professorIdentifier,
    },
    {
      colorMap: workloadColormap,
      rating: course.evaluation_statistic?.avg_workload,
      identifier: workloadIdentifier,
    },
  ];
  if (hasEvals) {
    return ratingBubbles.map(({ colorMap, rating }, i) => (
      <Col
        key={i}
        xs={2}
        className="px-1 ms-0 d-flex justify-content-center text-center"
      >
        <RatingBubble
          rating={rating}
          colorMap={colorMap}
          className={styles.ratingCell}
        >
          {rating ? rating.toFixed(1) : 'N/A'}
        </RatingBubble>
      </Col>
    ));
  }
  return ratingBubbles.map(({ identifier }, i) => (
    <OverlayTrigger
      key={i}
      placement="top"
      overlay={(props) => (
        <Tooltip id="color-tooltip" {...props}>
          These colors are randomly generated. Sign in to see real ratings.
        </Tooltip>
      )}
    >
      <Col
        key={i}
        xs={2}
        className="px-1 ms-0 d-flex justify-content-center text-center"
      >
        <RatingBubble
          color={generateRandomColor(identifier)}
          className={styles.ratingCell}
        />
      </Col>
    </OverlayTrigger>
  ));
}

function CourseLink({
  listing,
  course,
  filter,
  gotoCourse,
}: {
  readonly listing: SameCourseOrProfOfferingsQuery['self'][0];
  readonly course: RelatedCourseInfoFragment;
  readonly filter: Filter;
  readonly gotoCourse: (x: CourseModalHeaderData) => void;
}) {
  const linkTargets = useCourseModalLink(
    course.listings.map((l) => ({
      season_code: course.season_code,
      crn: l.crn,
    })),
  );
  // Note, we purposefully use the listing data fetched from GraphQL instead
  // of the static seasons data. This means on navigation we don't have to
  // possibly fetch a new season and cause a loading screen.
  // We have to "massage" this data to fit the flat shape like the one
  // sent by the api. This will be changed.
  const targetCourses = course.listings.map((l) => ({
    ...l,
    season_code: course.season_code,
    section: course.section,
    course,
  }));
  const extraText =
    filter === 'professor'
      ? `${course.listings[0]!.course_code}${course.listings.length > 1 ? ` +${course.listings.length - 1}` : ''}`
      : filter === 'both'
        ? `Section ${course.section}`
        : course.course_professors.length === 0
          ? 'TBA'
          : `${course.course_professors[0]!.professor.name}${course.course_professors.length > 1 ? ` +${course.course_professors.length - 1}` : ''}`;
  if (linkTargets.length === 1) {
    return (
      <Col
        as={Link}
        xs={5}
        className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
        to={linkTargets[0]!}
        onClick={() => {
          gotoCourse(targetCourses[0]!);
        }}
      >
        <strong>{toSeasonString(course.season_code)}</strong>
        <span className={clsx(styles.details, 'mx-auto')}>{extraText}</span>
      </Col>
    );
  }
  return (
    <OverlayTrigger
      rootClose
      trigger="click"
      placement="right"
      overlay={(props) => (
        <Popover id="cross-listing-popover" {...props}>
          <Popover.Body>
            This class has multiple cross-listings:
            {course.listings.map((l, i) => (
              <Link
                key={i}
                className="d-block"
                to={linkTargets[i]!}
                onClick={() => {
                  gotoCourse(targetCourses[i]!);
                }}
              >
                {l.course_code === listing.course_code ? (
                  <b>{l.course_code}</b>
                ) : (
                  l.course_code
                )}
              </Link>
            ))}
          </Popover.Body>
        </Popover>
      )}
    >
      <Col
        as={Button}
        xs={5}
        className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
        to={linkTargets[0]!}
      >
        <strong>{toSeasonString(course.season_code)}</strong>
        <span className={clsx(styles.details, 'mx-auto')}>{extraText}</span>
      </Col>
    </OverlayTrigger>
  );
}

function normalizeRelatedListings<T extends RelatedCourseInfoFragment>(
  courses: T[],
): T[] {
  // Discussion sections have no ratings, nothing to show
  // Skip listings in the current and future seasons that have no evals
  return courses
    .filter((o) => !isDiscussionSection(o) && !CUR_YEAR.includes(o.season_code))
    .sort(
      (a, b) =>
        b.season_code.localeCompare(a.season_code, 'en-US') ||
        parseInt(a.section, 10) - parseInt(b.section, 10),
    );
}

function haveSameProfessors(
  course1: Pick<RelatedCourseInfoFragment, 'course_professors'>,
  course2: Pick<RelatedCourseInfoFragment, 'course_professors'>,
) {
  const aProfIds = course1.course_professors
    .map((p) => p.professor.professor_id)
    .sort((a, b) => a - b);
  const bProfIds = course2.course_professors
    .map((p) => p.professor.professor_id)
    .sort((a, b) => a - b);
  return (
    aProfIds.length === bProfIds.length &&
    aProfIds.every((id, i) => id === bProfIds[i])
  );
}

function OverviewRatings({
  gotoCourse,
  data,
}: {
  readonly gotoCourse: (x: CourseModalHeaderData) => void;
  readonly data: SameCourseOrProfOfferingsQuery;
}) {
  const { user } = useUser();
  const listing = data.self[0]!;
  const overlapSections = useMemo(() => {
    const sameCourse = normalizeRelatedListings(data.sameCourse);
    const sameProf = normalizeRelatedListings(
      data.sameProf.map((o) => o.course),
    );
    const both = sameCourse.filter((o) =>
      haveSameProfessors(o, listing.course),
    );
    return { course: sameCourse, professor: sameProf, both };
  }, [data, listing]);
  const options = [
    {
      displayName: `Course (${overlapSections.course.length})`,
      value: 'course',
    },
    { displayName: `Both (${overlapSections.both.length})`, value: 'both' },
    {
      displayName: `Prof (${overlapSections.professor.length})`,
      value: 'professor',
    },
  ] as const;
  const [filter, setFilter] = useState<Filter>('both');
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className={styles.filterContainer}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          // Left/right arrow key
          const newIndx = ((optionsIndx[filter] +
            (e.key === 'ArrowLeft' ? 2 : e.key === 'ArrowRight' ? 1 : 0)) %
            3) as 0 | 1 | 2;
          setFilter(options[newIndx].value);
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
      {overlapSections[filter].length !== 0 ? (
        <>
          <Row className="m-auto pb-1 justify-content-center">
            <Col xs={5} className="d-flex justify-content-center px-0 me-3">
              <span className={styles.evaluationHeader}>Season</span>
            </Col>
            <Col xs={2} className="d-flex ms-0 justify-content-center px-0">
              <span className={styles.evaluationHeader}>Class</span>
            </Col>
            <Col xs={2} className="d-flex ms-0 justify-content-center px-0">
              <span className={styles.evaluationHeader}>Prof</span>
            </Col>
            <Col xs={2} className="d-flex ms-0 justify-content-center px-0">
              <span className={styles.evaluationHeader}>Work</span>
            </Col>
          </Row>
          {overlapSections[filter].map((course) => (
            <Row
              key={course.course_id}
              className="m-auto py-1 justify-content-center"
            >
              <CourseLink
                listing={listing}
                course={course}
                filter={filter}
                gotoCourse={gotoCourse}
              />
              <RatingNumbers course={course} hasEvals={user.hasEvals} />
            </Row>
          ))}
        </>
      ) : (
        <div className="m-auto text-center">
          <strong>No Results</strong>
        </div>
      )}
    </>
  );
}

export default OverviewRatings;
