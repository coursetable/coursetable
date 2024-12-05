import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
  Popover,
} from 'react-bootstrap';
import { MdInfoOutline } from 'react-icons/md';

// @popperjs/core is provided by react-bootstrap
// eslint-disable-next-line import/no-extraneous-dependencies
import { detectOverflow } from '@popperjs/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import MultiToggle from 'react-multi-toggle';

import type {
  RelatedCourseInfoFragment,
  SameCourseOrProfOfferingsQuery,
} from '../../../generated/graphql-types';
import { useStore } from '../../../store';
import { generateRandomColor } from '../../../utilities/common';
import { ratingColormap, workloadColormap } from '../../../utilities/constants';
import { toSeasonString, isDiscussionSection } from '../../../utilities/course';
import { createCourseModalLink } from '../../../utilities/display';
import { RatingBubble, TextComponent } from '../../Typography';
import type { ModalNavigationFunction } from '../CourseModal';
import styles from './OverviewRatings.module.css';
import './react-multi-toggle-override.css';
import type { CourseInfo } from './OverviewInfo';
import Notice from '../../Notice';

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
  professorView,
}: {
  readonly course: RelatedCourseInfoFragment;
  readonly hasEvals: boolean | undefined;
  professorView: boolean;
}) {
  // For random seeds
  const ratingIdentifier = `${course.course_id}${course.season_code}rating`;
  const workloadIdentifier = `${course.course_id}${course.season_code}workload`;
  const professorIdentifier = `${course.course_id}${course.season_code}professor`;

  // Define the rating bubbles
  let ratingBubbles = [
    {
      label: 'Prof',
      colorMap: ratingColormap,
      rating: course.average_professor_rating,
      identifier: professorIdentifier,
    },
    {
      label: 'Class',
      colorMap: ratingColormap,
      rating: course.evaluation_statistic?.avg_rating,
      identifier: ratingIdentifier,
    },
    {
      label: 'Work',
      colorMap: workloadColormap,
      rating: course.evaluation_statistic?.avg_workload,
      identifier: workloadIdentifier,
    },
  ];

  // If professorView is true, filter to include only the "Prof" rating
  if (professorView)
    ratingBubbles = ratingBubbles.filter((bubble) => bubble.label === 'Prof');
  else
    ratingBubbles = ratingBubbles.filter((bubble) => bubble.label !== 'Prof');

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
          These colors are randomly generated.{' '}
          {hasEvals === false ? 'Complete the challenge' : 'Sign in'} to see
          real ratings.
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

function CourseBubbleBase(
  {
    listing,
    course,
    filter,
    className,
    ...props
  }: React.ComponentProps<typeof Col> & {
    readonly listing: SameCourseOrProfOfferingsQuery['self'][0];
    readonly course: RelatedCourseInfoFragment;
    readonly filter: Filter;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const extraText =
    filter === 'professor'
      ? `${course.listings[0]!.course_code}${course.listings.length > 1 ? ` +${course.listings.length - 1}` : ''}`
      : filter === 'both'
        ? `Section ${course.section}`
        : course.course_professors.length === 0
          ? 'TBA'
          : `${course.course_professors[0]!.professor.name}${course.course_professors.length > 1 ? ` +${course.course_professors.length - 1}` : ''}`;
  return (
    <Col
      ref={ref}
      xs={5}
      className={clsx(
        className,
        styles.ratingBubble,
        'position-relative p-0 me-3 text-center',
      )}
      {...props}
    >
      <strong>{toSeasonString(course.season_code)}</strong>
      <span className={clsx(styles.details, 'mx-auto')}>{extraText}</span>
    </Col>
  );
}

// @ts-expect-error: TODO
const CourseBubble = React.forwardRef(CourseBubbleBase);

function CourseLink({
  listing,
  course,
  filter,
  onNavigation,
}: {
  readonly listing: SameCourseOrProfOfferingsQuery['self'][0];
  readonly course: RelatedCourseInfoFragment;
  readonly filter: Filter;
  readonly onNavigation: ModalNavigationFunction;
}) {
  const [searchParams] = useSearchParams();
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
  if (course.listings.some((l) => l.crn === listing.crn)) {
    // If the course has evals, then we should still switch the view to evals
    // to make the UX more consistent
    if (course.evaluation_statistic) {
      return (
        <CourseBubble
          as={Button}
          listing={listing}
          course={course}
          filter={filter}
          onClick={() => {
            onNavigation('change-view', undefined, 'evals');
          }}
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
          filter={filter}
          tabIndex={0}
        />
      </OverlayTrigger>
    );
  }
  // Avoid showing the popup if there's something we can link to with high
  // priority
  // TODO: once we have the concept of "primary" cross-listing, we should
  // just link to that by default
  const targetListingDefinite =
    targetListings.find((l) => l.course_code === listing.course_code) ??
    (targetListings.length === 1 ? targetListings[0] : undefined);
  if (targetListingDefinite) {
    return (
      <CourseBubble
        as={Link}
        to={createCourseModalLink(targetListingDefinite, searchParams)}
        listing={listing}
        course={course}
        filter={filter}
        onClick={() => {
          onNavigation('push', targetListingDefinite, 'evals');
        }}
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
                  onNavigation('push', l, 'evals');
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
        listing={listing}
        course={course}
        filter={filter}
      />
    </OverlayTrigger>
  );
}

function normalizeRelatedListings<T extends RelatedCourseInfoFragment>(
  courses: T[],
): T[] {
  // Discussion sections have no ratings, nothing to show
  return courses
    .filter((o) => !isDiscussionSection(o))
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
    // @ts-expect-error: the GraphQL-codegen types are wrong because it doesn't
    // know that fragments are deep merged
    .map((p) => p.professor.professor_id as number)
    .sort((a, b) => a - b);
  const bProfIds = course2.course_professors
    // @ts-expect-error: the GraphQL-codegen types are wrong because it doesn't
    // know that fragments are deep merged
    .map((p) => p.professor.professor_id as number)
    .sort((a, b) => a - b);
  return (
    aProfIds.length === bProfIds.length &&
    aProfIds.every((id, i) => id === bProfIds[i])
  );
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
);

function CustomChart({
  data,
}: {
  readonly data: { year: string; rating: number; courseCount: number }[];
}) {
  const formattedData = data
    .map((d) => ({
      ...d,
      formattedYear: dayjs(d.year).format('YYYY'),
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // Extract the formatted years and ratings
  const years = formattedData.map((d) => d.formattedYear);
  const ratings = formattedData.map((d) => d.rating);

  // Set up the data and configuration for the chart
  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Average Rating',
        data: ratings,
        borderColor: '#468FF2',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        tension: 0.3, // Smooth curve
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  // Use the specific type for line chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
      },
    },
    color: 'red',
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
        reverse: false,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Rating',
        },
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 0.5,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label(context) {
            const rating = context.raw as number;
            const index = context.dataIndex;
            const courseCount = data[index]?.courseCount || 0;
            return `Courses taught: ${courseCount} | Avg rating: ${rating.toPrecision(2)}`;
          },
          title(tooltipItems) {
            return `Year: ${tooltipItems[0]?.label}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

function OverviewRatings({
  onNavigation,
  listing,
  sameCourse,
  sameProf,
  professorView,
}: {
  readonly onNavigation: ModalNavigationFunction;
  readonly listing: SameCourseOrProfOfferingsQuery['self'][0];
  readonly sameCourse: SameCourseOrProfOfferingsQuery['sameCourse'];
  readonly sameProf: SameCourseOrProfOfferingsQuery['sameProf'];
  readonly professorView:
    | CourseInfo['course_professors'][number]['professor']
    | null;
}) {
  const overlapSections = useMemo(() => {
    const sameCourseNormalized = normalizeRelatedListings(sameCourse);
    const sameProfNormalized = normalizeRelatedListings(
      sameProf.map((o) => o.course),
    );
    const both = sameCourseNormalized.filter((o) =>
      haveSameProfessors(o, listing.course),
    );
    return {
      course: sameCourseNormalized,
      professor: sameProfNormalized,
      both,
    };
  }, [sameCourse, sameProf, listing]);

  const chartData = useMemo(() => {
    // Group courses by year
    const coursesByYear = sameProf.reduce<{ [key: string]: number[] }>(
      (acc, offering) => {
        const year = offering.course.season_code; // Extract the year/season
        acc[year] ||= [];
        acc[year].push(offering.course.evaluation_statistic?.avg_rating || 0);
        return acc;
      },
      {},
    );

    // Calculate average rating and course count for each year
    return Object.entries(coursesByYear)
      .map(([year, ratings]) => ({
        year,
        rating:
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length ||
          0, // Average rating
        courseCount: ratings.length, // Number of courses factored into the average
      }))
      .filter((dataPoint) => dataPoint.rating > 0); // Exclude years with no valid ratings
  }, [sameProf]);

  const defaultOptions = [
    {
      displayName: `Course (${overlapSections.course.length})`,
      value: 'course',
    },
    { displayName: `Both (${overlapSections.both.length})`, value: 'both' },
    {
      displayName: `Prof (${overlapSections.professor.length})`,
      value: 'professor',
    },
  ];

  const professorViewOptions = [
    { displayName: `Both (${overlapSections.both.length})`, value: 'both' },
    {
      displayName: `Prof (${overlapSections.professor.length})`,
      value: 'professor',
    },
  ];

  const user = useStore((state) => state.user);

  const [options, setOptions] =
    useState<{ displayName: string; value: string }[]>(defaultOptions);

  const [filter, setFilter] = useState<Filter>('both');
  const [chartMode, setChartMode] = useState(false);

  useEffect(() => {
    professorView == null
      ? setOptions(defaultOptions)
      : setOptions(professorViewOptions);
  }, [professorView]);

  const handleToggleChartMode = () => {
    setChartMode((prevMode) => !prevMode);
  };

  // Prepare data for the chart
  // const chartData = overlapSections.professor
  //   .map((course) => ({
  //     year: course.season_code, // Adjust this to extract the year if necessary
  //     rating: course.evaluation_statistic?.avg_rating || 0,
  //     courseName: listing.course_code,
  //   }))
  //   .filter((d) => d.rating !== 0);

  return (
    <>
      {!professorView && (
        <div
          className={styles.filterContainer}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            // Left/right arrow key
            const newIndx = ((optionsIndx[filter] +
              (e.key === 'ArrowLeft' ? 2 : e.key === 'ArrowRight' ? 1 : 0)) %
              3) as 0 | 1 | 2;
            if (defaultOptions[newIndx]) {
              setFilter(defaultOptions[newIndx].value as Filter);
            }
          }}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <MultiToggle
            options={options}
            selectedOption={filter}
            onSelectOption={(val) => setFilter(val as Filter)}
            className={clsx(styles.evaluationsFilter, 'mb-2')}
          />
        </div>
      )}
      {overlapSections[filter].length !== 0 ? (
        <div style={{ display: professorView ? 'flex' : 'inline' }}>
          <div
            style={{
              flex: '1 1 70%', // 70% of the width
              maxWidth: '70%',
            }}
          >
            {professorView && (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '16px',
                  }}
                >
                  <TextComponent type="primary" style={{ fontWeight: 650 }}>
                    <span
                      className="px-2 py-1 rounded font-semibold text-white"
                      style={{
                        backgroundColor: '#468FF2',
                        fontSize: '0.75rem',
                        marginRight: '8px',
                      }}
                    >
                      Beta
                    </span>
                    Average professor rating
                  </TextComponent>
                  <TextComponent type="secondary">
                    The following is an overview of how {professorView.name}'s
                    rating by students has changed over time.
                  </TextComponent>
                </div>
                <CustomChart data={chartData} />
                <TextComponent type="tertiary" style={{ fontSize: 12 }}>
                  This feature is new and in active testing. We will be adding
                  more content to the professor modal soon!
                </TextComponent>
              </>
            )}
          </div>
          <div
            className=""
            style={{
              flex: '1 1 auto',
            }}
          >
            <Row className="m-auto pb-1" style={{ justifyContent: 'right' }}>
              <Col
                xs={5}
                className="d-flex justify-content-center px-0 me-3"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                {filter !== 'professor' && (
                  <OverlayTrigger
                    trigger="click"
                    placement="right"
                    rootClose
                    overlay={(props) => (
                      <Popover id="filter-popover" {...props}>
                        <Popover.Body>
                          Past course offerings are discovered using
                          CourseTable's own algorithm. If you see something
                          unexpected or missing, please{' '}
                          <Link to="https://feedback.coursetable.com">
                            let us know
                          </Link>
                          .
                        </Popover.Body>
                      </Popover>
                    )}
                  >
                    <button
                      type="button"
                      style={{
                        color: 'var(--color-primary)',
                        marginBottom: 2,
                      }}
                    >
                      <MdInfoOutline size={20} />
                    </button>
                  </OverlayTrigger>
                )}
                <span className={styles.evaluationHeader}>Season</span>
              </Col>
              {professorView ? (
                <Col xs={2} className="d-flex ms-0 justify-content-center px-0">
                  <span className={styles.evaluationHeader}>Prof</span>
                </Col>
              ) : (
                <>
                  {' '}
                  <Col
                    xs={2}
                    className="d-flex ms-0 justify-content-center px-0"
                  >
                    <span className={styles.evaluationHeader}>Class</span>
                  </Col>
                  <Col
                    xs={2}
                    className="d-flex ms-0 justify-content-center px-0"
                  >
                    <span className={styles.evaluationHeader}>Work</span>
                  </Col>
                </>
              )}
            </Row>
            {overlapSections[filter].map((course) => (
              <Row
                key={course.course_id}
                className="m-auto py-1"
                style={{ justifyContent: 'right' }}
              >
                <CourseLink
                  listing={listing}
                  course={course}
                  filter={filter}
                  onNavigation={onNavigation}
                />
                <RatingNumbers
                  course={course}
                  hasEvals={user?.hasEvals}
                  professorView={professorView != null}
                />
              </Row>
            ))}
          </div>
        </div>
      ) : (
        <div className="m-auto text-center">
          <strong>No Results</strong>
        </div>
      )}
    </>
  );
}

export default OverviewRatings;
