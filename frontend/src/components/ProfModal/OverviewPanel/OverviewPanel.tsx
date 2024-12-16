import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Badge,
  Form,
} from 'react-bootstrap';

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

import type { Season } from '../../../queries/graphql-types';
import { subjects } from '../../../utilities/constants';
import { toSeasonString } from '../../../utilities/course';
import RelatedCoursesList from '../../RelatedCoursesList';
import { TextComponent } from '../../Typography';
import type { ProfInfo } from '../ProfModal';
import styles from './OverviewPanel.module.css';

type RelatedCourseInfo = ProfInfo['course_professors'][number]['course'];

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
  const [groupRecurringCourses, setGroupRecurringCourses] = useState(true);
  if (!coursesTaught.length)
    return <Col md={4} className="px-0 my-0 align-right" />;
  const uniqueCourses = new Map<
    number,
    { title: string; courses: RelatedCourseInfo[] }
  >();
  for (const course of coursesTaught) {
    if (!uniqueCourses.has(course.same_course_id)) {
      // Use the title of the first course in the group, because it is the
      // latest
      uniqueCourses.set(course.same_course_id, {
        title: course.title,
        courses: [course],
      });
    } else {
      uniqueCourses.get(course.same_course_id)!.courses.push(course);
    }
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
      <RelatedCoursesList
        courses={groupRecurringCourses ? uniqueCourses : coursesTaught}
        usesSameCourse={groupRecurringCourses}
        columns={['rating', 'workload']}
        columnWidth={3}
        extraText={(c) =>
          `${c.listings[0]!.course_code}${c.listings.length > 1 ? ` +${c.listings.length - 1}` : ''}`
        }
      />
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
