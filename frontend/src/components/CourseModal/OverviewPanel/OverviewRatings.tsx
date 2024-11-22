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

// @popperjs/core is provided by react-bootstrap
// eslint-disable-next-line import/no-extraneous-dependencies
import { detectOverflow } from '@popperjs/core';
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
import { Line } from 'react-chartjs-2';
import styles from './OverviewRatings.module.css';
import './react-multi-toggle-override.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import dayjs from 'dayjs';
import { CourseInfo } from './OverviewInfo';
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
  const extraText =
    filter === 'professor'
      ? `${course.listings[0]!.course_code}${course.listings.length > 1 ? ` +${course.listings.length - 1}` : ''}`
      : filter === 'both'
        ? `Section ${course.section}`
        : course.course_professors.length === 0
          ? 'TBA'
          : `${course.course_professors[0]!.professor.name}${course.course_professors.length > 1 ? ` +${course.course_professors.length - 1}` : ''}`;
  if (course.listings.some((l) => l.crn === listing.crn)) {
    // If the course has evals, then we should still switch the view to evals
    // to make the UX more consistent
    if (course.evaluation_statistic) {
      return (
        <Col
          as={Button}
          xs={5}
          className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
          onClick={() => {
            onNavigation('change-view', undefined, 'evals');
          }}
        >
          <strong>{toSeasonString(course.season_code)}</strong>
          <span className={clsx(styles.details, 'mx-auto')}>{extraText}</span>
        </Col>
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
        <Col
          xs={5}
          className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
          tabIndex={0}
        >
          <strong>{toSeasonString(course.season_code)}</strong>
          <span className={clsx(styles.details, 'mx-auto')}>{extraText}</span>
        </Col>
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
      <Col
        as={Link}
        xs={5}
        className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
        to={createCourseModalLink(targetListingDefinite, searchParams)}
        onClick={() => {
          onNavigation('push', targetListingDefinite, 'evals');
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
      <Col
        as={Button}
        xs={5}
        className={clsx(styles.ratingBubble, 'p-0 me-3 text-center')}
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
  data: Array<{ year: string; rating: number }>;
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
    color: 'red',
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
        reverse: false, // Flip the X-axis so the most recent year is on the right
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10, // Limit the number of ticks shown on the X-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Rating',
        },
        beginAtZero: true,
        max: 5, // Assuming the rating is on a scale from 0 to 5
        ticks: {
          stepSize: 0.5, // Adjust the step size for better spacing
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top', // Use one of the allowed string literals
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const rating = context.raw as number;
            return `Rating: ${rating.toPrecision(2)}`; // Format to two significant figures
          },
          title: (tooltipItems) => {
            // Format the date in the tooltip
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
    useState<Array<{ displayName: string; value: string }>>(defaultOptions);

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
  const chartData = overlapSections.professor
    .map((course) => ({
      year: course.season_code, // Adjust this to extract the year if necessary
      rating: course.evaluation_statistic?.avg_rating || 0,
    }))
    .filter((d) => d.rating !== 0);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      {overlapSections[filter].length !== 0 ? (
        <>
          {professorView ? (
            <>
              {/*fsr tailwind styles were not working here! Please fix if you can*/}
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
          ) : (
            <>
              <div
                className={styles.filterContainer}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  const newIndx = ((optionsIndx[filter] +
                    (e.key === 'ArrowLeft'
                      ? 2
                      : e.key === 'ArrowRight'
                        ? 1
                        : 0)) %
                    3) as 0 | 1 | 2;
                  const newOption = options[newIndx];
                  if (newOption) {
                    setFilter(newOption.value as Filter);
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
                    onNavigation={onNavigation}
                  />
                  <RatingNumbers course={course} hasEvals={user?.hasEvals} />
                </Row>
              ))}
            </>
          )}
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
