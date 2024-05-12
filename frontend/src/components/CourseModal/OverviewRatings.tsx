import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import MultiToggle from 'react-multi-toggle';

import type { ListingInfo, RelatedListingInfo } from './CourseModalOverview';

import { CUR_YEAR } from '../../config';
import { useUser } from '../../contexts/userContext';
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
  listing,
  hasEvals,
}: {
  readonly listing: RelatedListingInfo;
  readonly hasEvals: boolean | undefined;
}) {
  // For random seeds
  const ratingIdentifier = `${listing.crn}${listing.season_code}rating`;
  const workloadIdentifier = `${listing.crn}${listing.season_code}workload`;
  const professorIdentifier = `${listing.crn}${listing.season_code}professor`;

  const ratingBubbles = [
    {
      colorMap: ratingColormap,
      rating: listing.course.evaluation_statistic?.avg_rating,
      identifier: ratingIdentifier,
    },
    {
      colorMap: ratingColormap,
      rating: listing.course.average_professor_rating,
      identifier: professorIdentifier,
    },
    {
      colorMap: workloadColormap,
      rating: listing.course.evaluation_statistic?.avg_workload,
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
  filter,
  gotoCourse,
}: {
  readonly listing: RelatedListingInfo;
  readonly filter: Filter;
  readonly gotoCourse: (x: RelatedListingInfo) => void;
}) {
  const target = useCourseModalLink(listing);
  return (
    <Col
      as={Link}
      xs={5}
      className={clsx(styles.ratingBubble, 'px-0 me-3 text-center')}
      to={target}
      onClick={() => {
        // Note, we purposefully use the listing data fetched
        // from GraphQL instead of the static seasons data.
        // This means on navigation we don't have to possibly
        // fetch a new season and cause a loading screen.
        gotoCourse(listing);
      }}
    >
      <strong>{toSeasonString(listing.season_code)}</strong>
      <span className={clsx(styles.details, 'mx-auto')}>
        {filter === 'professor'
          ? listing.course_code
          : filter === 'both'
            ? `Section ${listing.section}`
            : listing.professor_names[0]}
      </span>
    </Col>
  );
}

function OverviewRatings({
  gotoCourse,
  listing,
  others,
}: {
  readonly gotoCourse: (x: RelatedListingInfo) => void;
  readonly listing: ListingInfo;
  readonly others: RelatedListingInfo[];
}) {
  const { user } = useUser();
  const overlapSections = useMemo(() => {
    const overlapSections: {
      [filter in Filter]: RelatedListingInfo[];
    } = { both: [], course: [], professor: [] };
    others
      // Discussion sections have no ratings, nothing to show
      .filter((other) => !isDiscussionSection(other))
      .sort(
        (a, b) =>
          b.season_code.localeCompare(a.season_code, 'en-US') ||
          parseInt(a.section, 10) - parseInt(b.section, 10),
      )
      .forEach((other) => {
        // Skip listings in the current and future seasons that have no evals
        if (CUR_YEAR.includes(other.season_code)) return;
        const overlappingProfs = listing.course.course_professors.reduce(
          (cnt, { professor: { professor_id: id } }) =>
            cnt + (other.professor_ids.includes(String(id)) ? 1 : 0),
          0,
        );
        // TODO: this whole logic is not ideal. We need to systematically
        // reconsider what we mean by "same course" and "same professor".
        // See: https://docs.google.com/document/d/1mIsanCz1U3M6SU2KbcBp9ONXRssDfeTzRtDIRzxdAOk
        const isCourseOverlap = other.course_code === listing.course_code;
        const isProfOverlap = overlappingProfs > 0;
        // We require ALL professors to be the same
        const isBothOverlap =
          isCourseOverlap &&
          overlappingProfs === other.professor_names.length &&
          overlappingProfs === listing.course.course_professors.length;
        if (isBothOverlap) overlapSections.both.push(other);
        if (isCourseOverlap) overlapSections.course.push(other);
        if (isProfOverlap) overlapSections.professor.push(other);
        // Consider a course cross-listed with course codes A and B.
        // It was taught by prof X in year 1 and prof Y in year 2.
        // Then GraphQL would return 2-B when viewing 1-A even when they
        // appear to not overlap.
        // TODO: maybe we should fix this in the GraphQL layer? Again,
        // reconsideration of course relationships needed...
      });
    return overlapSections;
  }, [others, listing]);
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
          {overlapSections[filter].map((other) => (
            <Row
              key={other.season_code + other.crn}
              className="m-auto py-1 justify-content-center"
            >
              <CourseLink
                listing={other}
                filter={filter}
                gotoCourse={gotoCourse}
              />
              <RatingNumbers listing={other} hasEvals={user.hasEvals} />
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
