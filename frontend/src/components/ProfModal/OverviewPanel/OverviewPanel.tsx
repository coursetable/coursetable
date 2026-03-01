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
  type ChartData,
} from 'chart.js';
import chroma from 'chroma-js';
import { Line } from 'react-chartjs-2';

import { useShallow } from 'zustand/react/shallow';
import type { Season } from '../../../queries/graphql-types';
import { useStore } from '../../../store';
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

type ChartPoint = {
  x: number;
  y: number;
  courseCount: number;
  courseCode: string;
};

function getChartOptions(
  showLegend: boolean,
  tooltipCallbacks: NonNullable<
    NonNullable<ChartOptions<'line'>['plugins']>['tooltip']
  >['callbacks'],
): ChartOptions<'line'> {
  return {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
      },
    },
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
          text: 'Average rating',
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
        display: showLegend,
        position: 'bottom',
      },
      tooltip: {
        callbacks: tooltipCallbacks,
      },
    },
  };
}

function coursesToChartPoints(courses: RelatedCourseInfo[]): ChartPoint[] {
  const coursesBySeason = Map.groupBy(courses, (course) => course.season_code);
  const data = [...coursesBySeason]
    .map(([season, seasonCourses]) => ({
      season,
      rating: seasonCourses.length
        ? seasonCourses.reduce(
            (sum, c) => sum + c.evaluation_statistic!.avg_rating!,
            0,
          ) / seasonCourses.length
        : 0, // Average rating
      courseCount: seasonCourses.length, // Number of courses factored into the average
      courseCode: seasonCourses.length
        ? // Only use the first course: this is only rendered by curve-by-course
          seasonCourses[0]!.listings.map((l) => l.course_code).join('/')
        : '',
    }))
    .filter((dataPoint) => dataPoint.rating > 0) // Exclude years with no valid ratings
    .sort((a, b) => a.season.localeCompare(b.season, 'en-US'))
    .map(
      (d): ChartPoint => ({
        x: seasonToUniformScale(d.season),
        y: d.rating,
        courseCount: d.courseCount,
        courseCode: d.courseCode,
      }),
    );
  return data;
}

function groupUniqueCourses(
  coursesTaught: RelatedCourseInfo[],
): Map<number, { code: string; title: string; courses: RelatedCourseInfo[] }> {
  const uniqueCourses = new Map<
    number,
    { code: string; title: string; courses: RelatedCourseInfo[] }
  >();
  for (const course of coursesTaught) {
    if (!uniqueCourses.has(course.same_course_id)) {
      // Use the title of the first course in the group, because it is the
      // latest
      uniqueCourses.set(course.same_course_id, {
        code: course.listings.map((l) => l.course_code).join('/'),
        title: course.title,
        courses: [course],
      });
    } else {
      uniqueCourses.get(course.same_course_id)!.courses.push(course);
    }
  }
  return uniqueCourses;
}

function SeasonRatingChart({
  coursesWithRatings,
}: {
  readonly coursesWithRatings: RelatedCourseInfo[];
}) {
  const points = coursesToChartPoints(coursesWithRatings);
  const chartData: ChartData<'line', { x: number; y: number }[]> = {
    datasets: [
      {
        label: 'Average rating',
        data: points,
        borderColor: '#468FF2',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        tension: 0.3, // Smooth curve
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  return (
    <div className={styles.ratingGraph}>
      <Line
        data={chartData}
        options={getChartOptions(false, {
          title(items) {
            return toSeasonString(uniformScaleToSeason(items[0]!.parsed.x));
          },
          label(item) {
            const point = item.raw as ChartPoint;
            return `Rated courses: ${point.courseCount} | Avg rating: ${point.y.toFixed(2)}`;
          },
        })}
      />
    </div>
  );
}

function CourseRatingChart({
  coursesWithRatings,
}: {
  readonly coursesWithRatings: RelatedCourseInfo[];
}) {
  const uniqueCourses = groupUniqueCourses(coursesWithRatings);
  const numCurves = uniqueCourses.size;
  const startColor = chroma('#468FF2');
  const chartData: ChartData<'line', { x: number; y: number }[]> = {
    // One curve for each course
    datasets: [...uniqueCourses.values()].map(({ code, courses }, i) => ({
      label: code,
      // One prof, one season, one course may still correspond to multiple
      // offerings, such as multiple sections
      data: coursesToChartPoints(courses),
      borderColor: startColor.set('hsl.h', `+${(i / numCurves) * 360}`).hex(),
      backgroundColor: 'rgba(0, 0, 255, 0.1)',
      tension: 0.3, // Smooth curve
      pointRadius: 3,
      pointHoverRadius: 5,
    })),
  };

  return (
    <div className={styles.ratingGraph}>
      {/* CourseRatingChart does not report the number of courses in the
      tooltip so it doesn't need the points */}
      <Line
        data={chartData}
        options={getChartOptions(true, {
          title(items) {
            const point = items[0]!.raw as ChartPoint;
            return `${toSeasonString(uniformScaleToSeason(point.x))} | ${point.courseCode}`;
          },
          label(item) {
            const point = item.raw as ChartPoint;
            return `Avg rating: ${point.y.toFixed(2)}`;
          },
        })}
      />
    </div>
  );
}

function RatingChart({
  coursesTaught,
}: {
  readonly coursesTaught: RelatedCourseInfo[];
}) {
  const { curveByCourse, togglePref } = useStore(
    useShallow((state) => ({
      curveByCourse: state.professorPref.curveByCourse,
      togglePref: state.togglePref,
    })),
  );
  const coursesWithRatings = coursesTaught.filter(
    (c) => (c.evaluation_statistic?.avg_rating ?? 0) > 0,
  );
  if (coursesWithRatings.length === 0) return <div>No ratings available</div>;
  const Chart = curveByCourse ? CourseRatingChart : SeasonRatingChart;
  return (
    <div>
      <Form.Check type="switch">
        <Form.Check.Input
          checked={curveByCourse}
          onChange={() => {
            togglePref('professorPref', 'curveByCourse');
          }}
        />
        <Form.Check.Label
          onClick={() => {
            togglePref('professorPref', 'curveByCourse');
          }}
        >
          Separate curves for each course
        </Form.Check.Label>
      </Form.Check>
      <Chart coursesWithRatings={coursesWithRatings} />
    </div>
  );
}

function OverviewPanel({ professor }: { readonly professor: ProfInfo }) {
  const { groupRecurringCourses, togglePref } = useStore(
    useShallow((state) => ({
      groupRecurringCourses: state.professorPref.groupRecurringCourses,
      togglePref: state.togglePref,
    })),
  );
  const coursesTaught = professor.course_professors
    .map((c) => c.course)
    .sort((a, b) => b.season_code.localeCompare(a.season_code, 'en-US'));

  const subjectCount = new Map<string, number>();
  for (const course of coursesTaught) {
    for (const listing of course.listings) {
      const subject = listing.course_code.split(' ')[0]!;
      subjectCount.set(subject, (subjectCount.get(subject) ?? 0) + 1);
    }
  }
  const uniqueCourses = groupUniqueCourses(coursesTaught);

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
                      <Tooltip
                        id={`prof-overview-subject-${subject}-tooltip`}
                        {...props}
                      >
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
          <RatingChart coursesTaught={coursesTaught} />
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
      <Col md={4} className="px-0 my-0 align-right">
        <Form.Check type="switch">
          <Form.Check.Input
            checked={groupRecurringCourses}
            onChange={() => {
              togglePref('professorPref', 'groupRecurringCourses');
            }}
          />
          <Form.Check.Label
            onClick={() => {
              togglePref('professorPref', 'groupRecurringCourses');
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
          extraText={(c) => {
            if (c.listings.length === 1) return c.listings[0]!.course_code;
            const primary = c.primary_crn
              ? // Guaranteed to exist
                c.listings.find((l) => l.crn === c.primary_crn)!
              : c.listings[0]!;
            return `${primary.course_code} +${c.listings.length - 1}`;
          }}
        />
      </Col>
    </Row>
  );
}

export default OverviewPanel;
