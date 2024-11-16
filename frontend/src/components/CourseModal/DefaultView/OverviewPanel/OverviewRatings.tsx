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
import MultiToggle from 'react-multi-toggle';

import { CUR_YEAR } from '../../../../config';
import type {
  RelatedCourseInfoFragment,
  SameCourseOrProfOfferingsQuery,
} from '../../../../generated/graphql-types';
import { useStore } from '../../../../store';
import { generateRandomColor } from '../../../../utilities/common';
import {
  ratingColormap,
  workloadColormap,
} from '../../../../utilities/constants';
import {
  toSeasonString,
  isDiscussionSection,
} from '../../../../utilities/course';
import { createCourseModalLink } from '../../../../utilities/display';
import { RatingBubble } from '../../../Typography';
import type { ModalNavigationFunction } from '../../CourseModal';

import styles from './OverviewRatings.module.css';
import './react-multi-toggle-override.css';
import { CourseInfo } from './OverviewInfo';
import { Line } from 'react-chartjs-2';
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

// Register the ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
);

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
    return (
      <OverlayTrigger
        trigger="hover"
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
          onNavigation(
            'push',
            targetListingDefinite,
            CUR_YEAR.includes(targetListingDefinite.season_code)
              ? 'overview'
              : 'evals',
          );
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
            {targetListings.map((l, i) => (
              <Link
                key={i}
                className="d-block"
                to={createCourseModalLink(l, searchParams)}
                onClick={() => {
                  onNavigation(
                    'push',
                    l,
                    CUR_YEAR.includes(l.season_code) ? 'overview' : 'evals',
                  );
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

export function normalizeRelatedListings<T extends RelatedCourseInfoFragment>(
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
  // Format the dates and reverse the order for the X-axis
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
        borderColor: 'blue',
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
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
        reverse: true, // Flip the X-axis so the most recent year is on the right
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10, // Limit the number of ticks shown on the X-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Rating',
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
        display: true,
        position: 'top', // Use one of the allowed string literals
      },
      tooltip: {
        callbacks: {
          label: (context) => `Rating: ${context.raw}`,
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
  data,
  professorView,
}: {
  readonly onNavigation: ModalNavigationFunction;
  readonly data: SameCourseOrProfOfferingsQuery;
  readonly professorView:
    | CourseInfo['course_professors'][number]['professor']
    | null;
}) {
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
  const chartData = overlapSections.professor.map((course) => ({
    year: course.season_code, // Adjust this to extract the year if necessary
    rating: course.evaluation_statistic?.avg_rating || 0,
  }));

  return (
    <>
      <Button
        variant="primary"
        className="mb-3"
        onClick={handleToggleChartMode}
      >
        {chartMode ? 'Disable Chart Mode' : 'Enable Chart Mode'}
      </Button>
      {chartMode ? (
        <CustomChart data={chartData} />
      ) : (
        <>
          <div
            className={styles.filterContainer}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              const newIndx = ((optionsIndx[filter] +
                (e.key === 'ArrowLeft' ? 2 : e.key === 'ArrowRight' ? 1 : 0)) %
                3) as 0 | 1 | 2;
              const newOption = options[newIndx];
              if (newOption) {
                setFilter(newOption.value as Filter);
              }
            }}
            tabIndex={0}
          >
            <MultiToggle
              options={options}
              selectedOption={filter}
              onSelectOption={(val) => setFilter(val as Filter)}
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
                    onNavigation={onNavigation}
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
      )}
    </>
  );
}

export default OverviewRatings;
