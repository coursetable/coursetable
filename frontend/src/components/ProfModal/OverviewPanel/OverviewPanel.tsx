import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
  Popover,
  Badge,
  Form,
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
import { Line } from 'react-chartjs-2';

import { useModalHistory } from '../../../contexts/modalHistoryContext';
import type { Season } from '../../../queries/graphql-types';
import { useStore } from '../../../store';
import { generateRandomColor } from '../../../utilities/common';
import {
  ratingColormap,
  workloadColormap,
  subjects,
} from '../../../utilities/constants';
import { toSeasonString } from '../../../utilities/course';
import { createCourseModalLink } from '../../../utilities/display';
import { RatingBubble, TextComponent } from '../../Typography';
import type { ProfInfo } from '../ProfModal';
import styles from './OverviewPanel.module.css';

type RelatedCourseInfo = ProfInfo['course_professors'][number]['course'];

function RatingNumbers({
  course,
  hasEvals,
}: {
  readonly course: RelatedCourseInfo;
  readonly hasEvals: boolean | undefined;
}) {
  // For random seeds
  const ratingIdentifier = `${course.course_id}${course.season_code}rating`;
  const workloadIdentifier = `${course.course_id}${course.season_code}workload`;

  // Define the rating bubbles
  const ratingBubbles = [
    {
      colorMap: ratingColormap,
      rating: course.evaluation_statistic?.avg_rating,
      identifier: ratingIdentifier,
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
        xs={3}
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
        xs={3}
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
    ...props
  }: React.ComponentProps<typeof Col> & {
    readonly course: RelatedCourseInfo;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const extraText = `${course.listings[0]!.course_code}${course.listings.length > 1 ? ` +${course.listings.length - 1}` : ''}`;
  return (
    <Col ref={ref} xs={6} className="p-0 position-relative pe-2">
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

function CourseLink({ course }: { readonly course: RelatedCourseInfo }) {
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
  // Avoid showing the popup if there's something we can link to with high
  // priority
  // TODO: once we have the concept of "primary" cross-listing, we should
  // just link to that by default
  const targetListingDefinite =
    targetListings.length === 1 ? targetListings[0] : undefined;
  if (targetListingDefinite) {
    return (
      <CourseBubble
        as={Link}
        to={createCourseModalLink(targetListingDefinite, searchParams)}
        course={course}
        onClick={() => {
          navigate('push', { type: 'course', data: targetListingDefinite });
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
                  navigate('push', { type: 'course', data: l });
                }}
              >
                {l.course_code}
              </Link>
            ))}
          </Popover.Body>
        </Popover>
      )}
    >
      <CourseBubble as={Button} course={course} />
    </OverlayTrigger>
  );
}

function seasonToUniformScale(season: Season): number {
  const year = Number(season.slice(0, 4));
  const term = Number(season[5]) - 1;
  return year * 3 + term;
}

function uniformScaleToSeason(scale: number): Season {
  const year = Math.floor(scale / 3);
  const term = (scale % 3) + 1;
  return `${year}0${term}` as Season;
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
  readonly data: { season: Season; rating: number; courseCount: number }[];
}) {
  const x = data.map((d) => seasonToUniformScale(d.season));
  const y = data.map((d) => d.rating);

  // Set up the data and configuration for the chart
  const chartData = {
    labels: x,
    datasets: [
      {
        label: 'Average Rating',
        data: y,
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
        type: 'linear',
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          callback: (value) =>
            Number.isInteger(value)
              ? toSeasonString(uniformScaleToSeason(value as number))
              : '',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Rating',
        },
        min: 1,
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
            return `Rated courses: ${courseCount} | Avg rating: ${rating.toPrecision(2)}`;
          },
          title(tooltipItems) {
            return toSeasonString(
              uniformScaleToSeason(tooltipItems[0]!.parsed.x),
            );
          },
        },
      },
    },
  };

  return (
    <div className={styles.ratingGraph}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

function OverviewRatings({
  coursesTaught,
}: {
  readonly coursesTaught: RelatedCourseInfo[];
}) {
  const user = useStore((state) => state.user);
  const [groupRecurringCourses, setGroupRecurringCourses] = useState(true);
  if (!coursesTaught.length)
    return <Col md={4} className="px-0 my-0 align-right" />;
  const uniqueCourses = new Map<number, RelatedCourseInfo[]>();
  for (const course of coursesTaught) {
    if (!uniqueCourses.has(course.same_course_id))
      uniqueCourses.set(course.same_course_id, []);
    uniqueCourses.get(course.same_course_id)!.push(course);
  }
  return (
    <Col md={4} className="px-0 my-0 align-right">
      <Form.Check type="switch">
        <Form.Check.Input
          checked={groupRecurringCourses}
          onChange={() => {
            setGroupRecurringCourses(!groupRecurringCourses);
          }}
        />
        <Form.Check.Label
          onClick={() => {
            setGroupRecurringCourses(!groupRecurringCourses);
          }}
        >
          Group recurring courses
        </Form.Check.Label>
      </Form.Check>

      {groupRecurringCourses && (
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
        <Col xs={6} className="d-flex justify-content-center px-0">
          <span className={clsx(styles.evaluationHeader, 'me-2')}>Season</span>
        </Col>
        <Col xs={3} className="d-flex ms-0 justify-content-center px-0">
          <span className={styles.evaluationHeader}>Class</span>
        </Col>
        <Col xs={3} className="d-flex ms-0 justify-content-center px-0">
          <span className={styles.evaluationHeader}>Work</span>
        </Col>
      </Row>
      {groupRecurringCourses
        ? [...uniqueCourses].map(([id, courses]) => (
            <div key={id} className={styles.sameCourseGroup}>
              <div className="mx-3">
                <b>{courses[0]!.title}</b>
              </div>
              {courses.map((course) => (
                <Row key={course.course_id} className="py-1 mx-2">
                  <CourseLink course={course} />
                  <RatingNumbers course={course} hasEvals={user?.hasEvals} />
                </Row>
              ))}
            </div>
          ))
        : coursesTaught.map((course) => (
            <Row key={course.course_id} className="m-auto py-1">
              <CourseLink course={course} />
              <RatingNumbers course={course} hasEvals={user?.hasEvals} />
            </Row>
          ))}
    </Col>
  );
}

function OverviewPanel({ professor }: { readonly professor: ProfInfo }) {
  const coursesTaught = professor.course_professors
    .map((c) => c.course)
    .sort((a, b) => b.season_code.localeCompare(a.season_code, 'en-US'));

  // Group courses by year
  const coursesByYear = new Map<Season, number[]>();
  for (const course of coursesTaught) {
    const season = course.season_code;
    const rating = course.evaluation_statistic?.avg_rating;
    if (rating) {
      if (!coursesByYear.has(season)) coursesByYear.set(season, []);
      coursesByYear.get(season)!.push(rating);
    }
  }
  const chartData = [...coursesByYear]
    .map(([season, ratings]) => ({
      season,
      rating: ratings.length
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0, // Average rating
      courseCount: ratings.length, // Number of courses factored into the average
    }))
    .filter((dataPoint) => dataPoint.rating > 0) // Exclude years with no valid ratings
    .sort((a, b) => a.season.localeCompare(b.season, 'en-US'));

  const subjectCount = new Map<string, number>();
  for (const course of coursesTaught) {
    for (const listing of course.listings) {
      const subject = listing.course_code.split(' ')[0]!;
      subjectCount.set(subject, (subjectCount.get(subject) ?? 0) + 1);
    }
  }

  return (
    <Row className="m-auto">
      <Col md={8} className="px-0 mt-0 mb-3">
        <div>
          <TextComponent type="primary" className="fw-bold">
            Most associated subjects
          </TextComponent>
          <ul className="list-unstyled d-flex">
            {[...subjectCount]
              .sort((a, b) => b[1] - a[1])
              .map(([subject]) => (
                <li key={subject}>
                  <OverlayTrigger
                    overlay={(props) => (
                      <Tooltip id="color-tooltip" {...props}>
                        {subjects[subject] ?? '[Unknown]'}
                      </Tooltip>
                    )}
                  >
                    <Badge bg="none" className={styles.subjectBadge}>
                      {subject}
                    </Badge>
                  </OverlayTrigger>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <TextComponent type="primary" className="fw-bold">
            Course ratings over time
          </TextComponent>
          {chartData.length > 0 ? (
            <CustomChart data={chartData} />
          ) : (
            <div>No data</div>
          )}
        </div>
        <div className="mt-2">
          <TextComponent type="tertiary" small>
            <span
              className="px-2 py-1 rounded font-semibold text-white me-2"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Beta
            </span>
            The professor modal is new and in active testing. We will be adding
            more content to it soon.{' '}
            <Link to="https://feedback.coursetable.com" target="_blank">
              Give us feedback
            </Link>
          </TextComponent>
        </div>
      </Col>
      <OverviewRatings coursesTaught={coursesTaught} />
    </Row>
  );
}

export default OverviewPanel;
