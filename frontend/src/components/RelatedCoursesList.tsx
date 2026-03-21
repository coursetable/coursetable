import React, { type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  Col,
  OverlayTrigger,
  Popover,
  Tooltip,
  Row,
  Button,
} from 'react-bootstrap';
import { MdInfoOutline } from 'react-icons/md';

// @popperjs/core is provided by react-bootstrap

import { detectOverflow } from '@popperjs/core';

import type { ModalNavigationFunction } from './CourseModal/CourseModal';
import { RatingBubble } from './Typography';
import { useModalHistory } from '../contexts/modalHistoryContext';
import type {
  ProfModalOverviewDataQuery,
  CourseModalOverviewDataQuery,
} from '../generated/graphql-types';
import { useStore } from '../store';
import { generateRandomColor } from '../utilities/common';
import { ratingColormap, workloadColormap } from '../utilities/constants';
import { toSeasonString } from '../utilities/course';
import { createCourseModalLink } from '../utilities/display';
import styles from './RelatedCoursesList.module.css';

type RelatedCourseInfo =
  | (ProfModalOverviewDataQuery['professors'][number]['course_professors'][number]['course'] & {
      average_professor_rating?: never;
    })
  | CourseModalOverviewDataQuery['sameCourse'][number];

type Column = 'rating' | 'professor' | 'workload';

function RatingNumbers({
  course,
  hasEvals,
  columns,
  columnWidth,
}: {
  readonly course: RelatedCourseInfo;
  readonly hasEvals: boolean | undefined;
  readonly columns: Column[];
  readonly columnWidth: number;
}) {
  // For random seeds
  const ratingIdentifier = `${course.course_id}${course.season_code}rating`;
  const workloadIdentifier = `${course.course_id}${course.season_code}workload`;
  const professorIdentifier = `${course.course_id}${course.season_code}professor`;

  // Define the rating bubbles
  const ratingBubbles = [
    {
      type: 'rating' as const,
      colorMap: ratingColormap,
      rating: course.evaluation_statistic?.avg_rating,
      identifier: ratingIdentifier,
    },
    {
      type: 'professor' as const,
      colorMap: ratingColormap,
      rating: course.average_professor_rating,
      identifier: professorIdentifier,
    },
    {
      type: 'workload' as const,
      colorMap: workloadColormap,
      rating: course.evaluation_statistic?.avg_workload,
      identifier: workloadIdentifier,
    },
  ].filter(({ type }) => columns.includes(type));

  if (hasEvals) {
    return ratingBubbles.map(({ colorMap, rating }, i) => (
      <Col
        key={i}
        xs={columnWidth}
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
        <Tooltip id={`related-courses-rating-${identifier}-tooltip`} {...props}>
          These colors are randomly generated.{' '}
          {hasEvals === false ? 'Complete the challenge' : 'Sign in'} to see
          real ratings.
        </Tooltip>
      )}
    >
      <Col
        key={i}
        xs={columnWidth}
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

function CourseBubbleBase(
  {
    course,
    className,
    as: As = 'div',
    columnWidth,
    extraText,
    ...props
  }: React.ComponentProps<typeof Col> & {
    readonly course: RelatedCourseInfo;
    readonly columnWidth: number;
    readonly extraText: string;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <Col ref={ref} xs={columnWidth} className="p-0 position-relative pe-2">
      <As
        className={clsx(
          className,
          styles.ratingBubble,
          'd-block text-center p-0 w-100',
        )}
        {...props}
      >
        <strong>{toSeasonString(course.season_code)}</strong>
        <span className={clsx(styles.details, 'mx-auto')}>{extraText}</span>
      </As>
    </Col>
  );
}

// @ts-expect-error: TODO
const CourseBubble = React.forwardRef(CourseBubbleBase);

function CourseLink({
  listing,
  course,
  columnWidth,
  onNavigation,
  extraText,
}: {
  readonly listing?: CourseModalOverviewDataQuery['self'];
  readonly course: RelatedCourseInfo;
  readonly columnWidth: number;
  readonly onNavigation?: ModalNavigationFunction;
  readonly extraText: string;
}) {
  const [searchParams] = useSearchParams();
  const { navigate } = useModalHistory();
  // Note, we purposefully use the listing data fetched from GraphQL instead
  // of the static seasons data. This means on navigation we don't have to
  // possibly fetch a new season and cause a loading screen.
  // We have to "massage" this data to fit the flat shape like the one
  // sent by the api. This will be changed.
  const targetListings = course.listings.map((l) => ({
    ...l,
    season_code: course.season_code,
    section: course.section,
    course,
  }));
  // Course modal only: link to the current course
  if (listing && course.listings.some((l) => l.crn === listing.crn)) {
    // If the course has evals, then we should still switch the view to evals
    // to make the UX more consistent
    if (course.evaluation_statistic) {
      return (
        <CourseBubble
          as={Button}
          listing={listing}
          course={course}
          onClick={() => {
            if (onNavigation) onNavigation('change-view', undefined, 'evals');
          }}
          columnWidth={columnWidth}
          extraText={extraText}
        />
      );
    }
    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        overlay={(props) => (
          <Popover id="self-popover" {...props}>
            <Popover.Body>The current class</Popover.Body>
          </Popover>
        )}
      >
        <CourseBubble
          listing={listing}
          course={course}
          tabIndex={0}
          columnWidth={columnWidth}
          extraText={extraText}
        />
      </OverlayTrigger>
    );
  }
  // Avoid showing the popup if there's something we can link to with high
  // priority
  // TODO: once we have the concept of "primary" cross-listing, we should
  // just link to that by default
  const targetListingDefinite =
    (listing &&
      targetListings.find((l) => l.course_code === listing.course_code)) ??
    (targetListings.length === 1 ? targetListings[0] : undefined);
  if (targetListingDefinite) {
    return (
      <CourseBubble
        as={Link}
        to={createCourseModalLink(targetListingDefinite, searchParams)}
        course={course}
        onClick={() => {
          if (onNavigation)
            onNavigation('push', targetListingDefinite, 'evals');
          else
            navigate('push', { type: 'course', data: targetListingDefinite });
        }}
        columnWidth={columnWidth}
        extraText={extraText}
      />
    );
  }
  return (
    <OverlayTrigger
      rootClose
      trigger="click"
      placement="right"
      popperConfig={{
        modifiers: [
          {
            name: 'resizeIfOverflow',
            enabled: true,
            phase: 'write',
            requiresIfExists: ['offset'],
            fn({ state }) {
              const { right } = detectOverflow(state);
              if (right < 0) return; // No overflow
              const currentWidth = parseInt(
                getComputedStyle(state.elements.popper).width,
                10,
              );
              const newWidth = currentWidth - right;
              state.styles.popper!.width = `${newWidth}px`;
            },
          },
        ],
      }}
      overlay={(props) => (
        <Popover id="cross-listing-popover" {...props}>
          <Popover.Body>
            This class has multiple cross-listings. Please choose from one of
            the codes to see more details.
            {targetListings.map((l, i) => (
              <Link
                key={i}
                className={styles.courseLink}
                to={createCourseModalLink(l, searchParams)}
                onClick={() => {
                  if (onNavigation) onNavigation('push', l, 'evals');
                  else navigate('push', { type: 'course', data: l });
                }}
              >
                {l.course_code}
              </Link>
            ))}
          </Popover.Body>
        </Popover>
      )}
    >
      <CourseBubble
        as={Button}
        course={course}
        columnWidth={columnWidth}
        extraText={extraText}
      />
    </OverlayTrigger>
  );
}

export default function RelatedCoursesList<T extends RelatedCourseInfo>({
  listing,
  courses,
  usesSameCourse,
  columns,
  columnWidth,
  onNavigation,
  extraText,
}: {
  readonly listing?: CourseModalOverviewDataQuery['self'];
  readonly courses:
    | T[]
    | Map<string | number, { title: ReactNode; courses: T[] }>;
  readonly usesSameCourse: boolean;
  readonly columns: Column[];
  readonly columnWidth: number;
  readonly onNavigation?: ModalNavigationFunction;
  readonly extraText: (l: T) => string;
}) {
  const user = useStore((state) => state.user);
  const columnHeaders = columns.map((column) => {
    switch (column) {
      case 'rating':
        return 'Class';
      case 'professor':
        return 'Prof';
      case 'workload':
        return 'Work';
      default:
        return column;
    }
  });
  return (
    <>
      {usesSameCourse && (
        <div className="position-relative">
          <OverlayTrigger
            trigger="click"
            placement="right"
            rootClose
            overlay={(props) => (
              <Popover id="filter-popover" {...props}>
                <Popover.Body>
                  Past course offerings are discovered using CourseTable's own
                  algorithm. If you see something unexpected or missing, please{' '}
                  <Link to="https://feedback.coursetable.com">let us know</Link>
                  .
                </Popover.Body>
              </Popover>
            )}
          >
            <button
              type="button"
              style={{ color: 'var(--color-primary)' }}
              className="position-absolute top-0 start-0"
            >
              <MdInfoOutline size={20} />
            </button>
          </OverlayTrigger>
        </div>
      )}
      <Row className="m-auto pb-1">
        <Col
          xs={12 - columnWidth * columns.length}
          className="d-flex justify-content-center px-0"
        >
          <span className={clsx(styles.evaluationHeader, 'me-2')}>Season</span>
        </Col>
        {columnHeaders.map((x) => (
          <Col
            key={x}
            xs={columnWidth}
            className="d-flex ms-0 justify-content-center px-0"
          >
            <span className={styles.evaluationHeader}>{x}</span>
          </Col>
        ))}
      </Row>
      {Array.isArray(courses)
        ? courses.map((course) => (
            <Row key={course.course_id} className="m-auto py-1">
              <CourseLink
                listing={listing}
                course={course}
                columnWidth={12 - columnWidth * columns.length}
                onNavigation={onNavigation}
                extraText={extraText(course)}
              />
              <RatingNumbers
                columnWidth={columnWidth}
                course={course}
                hasEvals={user?.hasEvals}
                columns={columns}
              />
            </Row>
          ))
        : [...courses].map(([id, { title, courses: group }]) => (
            <div key={id} className={styles.sameCourseGroup}>
              <div className="mx-3">
                <b>{title}</b>
              </div>
              {group.map((course) => (
                <Row key={course.course_id} className="py-1 mx-2">
                  <CourseLink
                    listing={listing}
                    course={course}
                    columnWidth={12 - columnWidth * columns.length}
                    onNavigation={onNavigation}
                    extraText={extraText(course)}
                  />
                  <RatingNumbers
                    columnWidth={columnWidth}
                    course={course}
                    hasEvals={user?.hasEvals}
                    columns={columns}
                  />
                </Row>
              ))}
            </div>
          ))}
    </>
  );
}
