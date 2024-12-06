import React, { useMemo } from 'react';
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

// function RatingNumbers({
//   course,
//   hasEvals,
//   professorView,
// }: {
//   readonly course: RelatedCourseInfoFragment;
//   readonly hasEvals: boolean | undefined;
//   professorView: boolean;
// }) {
//   // For random seeds
//   const ratingIdentifier = `${course.course_id}${course.season_code}rating`;
//   const workloadIdentifier = `${course.course_id}${course.season_code}workload`;
//   const professorIdentifier = `${course.course_id}${course.season_code}professor`;

//   // Define the rating bubbles
//   let ratingBubbles = [
//     {
//       label: 'Prof',
//       colorMap: ratingColormap,
//       rating: course.average_professor_rating,
//       identifier: professorIdentifier,
//     },
//     {
//       label: 'Class',
//       colorMap: ratingColormap,
//       rating: course.evaluation_statistic?.avg_rating,
//       identifier: ratingIdentifier,
//     },
//     {
//       label: 'Work',
//       colorMap: workloadColormap,
//       rating: course.evaluation_statistic?.avg_workload,
//       identifier: workloadIdentifier,
//     },
//   ];

//   // If professorView is true, filter to include only the "Prof" rating
//   if (professorView)
//     ratingBubbles = ratingBubbles.filter((bubble) => bubble.label !== 'Prof');

//   if (hasEvals) {
//     return ratingBubbles.map(({ colorMap, rating }, i) => (
//       <Col
//         key={i}
//         xs={2}
//         className="px-1 ms-0 d-flex justify-content-center text-center"
//       >
//         <RatingBubble
//           rating={rating}
//           colorMap={colorMap}
//           className={styles.ratingCell}
//         >
//           {rating ? rating.toFixed(1) : 'N/A'}
//         </RatingBubble>
//       </Col>
//     ));
//   }

//   return ratingBubbles.map(({ identifier }, i) => (
//     <OverlayTrigger
//       key={i}
//       placement="top"
//       overlay={(props) => (
//         <Tooltip id="color-tooltip" {...props}>
//           These colors are randomly generated.{' '}
//           {hasEvals === false ? 'Complete the challenge' : 'Sign in'} to see
//           real ratings.
//         </Tooltip>
//       )}
//     >
//       <Col
//         key={i}
//         xs={2}
//         className="px-1 ms-0 d-flex justify-content-center text-center"
//       >
//         <RatingBubble
//           color={generateRandomColor(identifier)}
//           className={styles.ratingCell}
//         />
//       </Col>
//     </OverlayTrigger>
//   ));
// }

// function CourseBubbleBase(
//   {
//     listing,
//     course,
//     filter,
//     className,
//     ...props
//   }: React.ComponentProps<typeof Col> & {
//     readonly listing: SameCourseOrProfOfferingsQuery['self'][0];
//     readonly course: RelatedCourseInfoFragment;
//     readonly filter: Filter;
//   },
//   ref: React.Ref<HTMLDivElement>,
// ) {
//   const extraText =
//     filter === 'professor'
//       ? `${course.listings[0]!.course_code}${course.listings.length > 1 ? ` +${course.listings.length - 1}` : ''}`
//       : filter === 'both'
//         ? `Section ${course.section}`
//         : course.course_professors.length === 0
//           ? 'TBA'
//           : `${course.course_professors[0]!.professor.name}${course.course_professors.length > 1 ? ` +${course.course_professors.length - 1}` : ''}`;
//   return (
//     <Col
//       ref={ref}
//       xs={5}
//       className={clsx(
//         className,
//         styles.ratingBubble,
//         'position-relative p-0 me-3 text-center',
//       )}
//       {...props}
//     >
//       <strong>{toSeasonString(course.season_code)}</strong>
//       <span className={clsx(styles.details, 'mx-auto')}>{extraText}</span>
//     </Col>
//   );
// }

// // @ts-expect-error: TODO
// const CourseBubble = React.forwardRef(CourseBubbleBase);

// function CourseLink({
//   listing,
//   course,
//   filter,
//   onNavigation,
// }: {
//   readonly listing: SameCourseOrProfOfferingsQuery['self'][0];
//   readonly course: RelatedCourseInfoFragment;
//   readonly filter: Filter;
//   readonly onNavigation: ModalNavigationFunction;
// }) {
//   const [searchParams] = useSearchParams();
//   // Note, we purposefully use the listing data fetched from GraphQL instead
//   // of the static seasons data. This means on navigation we don't have to
//   // possibly fetch a new season and cause a loading screen.
//   // We have to "massage" this data to fit the flat shape like the one
//   // sent by the api. This will be changed.
//   const targetListings = course.listings.map((l) => ({
//     ...l,
//     season_code: course.season_code,
//     section: course.section,
//     course,
//   }));
//   if (course.listings.some((l) => l.crn === listing.crn)) {
//     // If the course has evals, then we should still switch the view to evals
//     // to make the UX more consistent
//     if (course.evaluation_statistic) {
//       return (
//         <CourseBubble
//           as={Button}
//           listing={listing}
//           course={course}
//           filter={filter}
//           onClick={() => {
//             onNavigation('change-view', undefined, 'evals');
//           }}
//         />
//       );
//     }
//     return (
//       <OverlayTrigger
//         trigger={['hover', 'focus']}
//         placement="right"
//         overlay={(props) => (
//           <Popover id="self-popover" {...props}>
//             <Popover.Body>The current class</Popover.Body>
//           </Popover>
//         )}
//       >
//         <CourseBubble
//           listing={listing}
//           course={course}
//           filter={filter}
//           tabIndex={0}
//         />
//       </OverlayTrigger>
//     );
//   }
//   // Avoid showing the popup if there's something we can link to with high
//   // priority
//   // TODO: once we have the concept of "primary" cross-listing, we should
//   // just link to that by default
//   const targetListingDefinite =
//     targetListings.find((l) => l.course_code === listing.course_code) ??
//     (targetListings.length === 1 ? targetListings[0] : undefined);
//   if (targetListingDefinite) {
//     return (
//       <CourseBubble
//         as={Link}
//         to={createCourseModalLink(targetListingDefinite, searchParams)}
//         listing={listing}
//         course={course}
//         filter={filter}
//         onClick={() => {
//           onNavigation('push', targetListingDefinite, 'evals');
//         }}
//       />
//     );
//   }
//   return (
//     <OverlayTrigger
//       rootClose
//       trigger="click"
//       placement="right"
//       popperConfig={{
//         modifiers: [
//           {
//             name: 'resizeIfOverflow',
//             enabled: true,
//             phase: 'write',
//             requiresIfExists: ['offset'],
//             fn({ state }) {
//               const { right } = detectOverflow(state);
//               if (right < 0) return; // No overflow
//               const currentWidth = parseInt(
//                 getComputedStyle(state.elements.popper).width,
//                 10,
//               );
//               const newWidth = currentWidth - right;
//               state.styles.popper!.width = `${newWidth}px`;
//             },
//           },
//         ],
//       }}
//       overlay={(props) => (
//         <Popover id="cross-listing-popover" {...props}>
//           <Popover.Body>
//             This class has multiple cross-listings. Please choose from one of
//             the codes to see more details.
//             {targetListings.map((l, i) => (
//               <Link
//                 key={i}
//                 className={styles.courseLink}
//                 to={createCourseModalLink(l, searchParams)}
//                 onClick={() => {
//                   onNavigation('push', l, 'evals');
//                 }}
//               >
//                 {l.course_code}
//               </Link>
//             ))}
//           </Popover.Body>
//         </Popover>
//       )}
//     >
//       <CourseBubble
//         as={Button}
//         listing={listing}
//         course={course}
//         filter={filter}
//       />
//     </OverlayTrigger>
//   );
// }

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
            toSeasonString(uniformScaleToSeason(value as number)),
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
    <div style={{ width: '100%', height: '400px' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

function OverviewPanel({ professor }: { readonly professor: ProfInfo }) {
  const chartData = useMemo(() => {
    // Group courses by year
    const coursesByYear = new Map<Season, number[]>();
    for (const course of professor.course_professors) {
      const season = course.course.season_code;
      const rating = course.course.evaluation_statistic?.avg_rating;
      if (rating) {
        if (!coursesByYear.has(season)) coursesByYear.set(season, []);
        coursesByYear.get(season)!.push(rating);
      }
    }

    // Calculate average rating and course count for each year
    return [...coursesByYear]
      .map(([season, ratings]) => ({
        season,
        rating: ratings.length
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0, // Average rating
        courseCount: ratings.length, // Number of courses factored into the average
      }))
      .filter((dataPoint) => dataPoint.rating > 0) // Exclude years with no valid ratings
      .sort((a, b) => a.season.localeCompare(b.season, 'en-US'));
  }, [professor]);

  const subjectCount = new Map<string, number>();
  for (const { course } of professor.course_professors) {
    for (const listing of course.listings) {
      const subject = listing.course_code.split(' ')[0]!;
      subjectCount.set(subject, (subjectCount.get(subject) ?? 0) + 1);
    }
  }

  return (
    <div style={{ width: '100%', padding: 4 }}>
      {professor.course_professors.length > 0 ? (
        <div style={{ display: 'flex' }}>
          <Col className="px-0 mt-0 mb-3">
            <div className="mb-2">
              <TextComponent type="tertiary" style={{ fontSize: 12 }}>
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
                The professor modal is new and in active testing. We will be
                adding more content to it soon!
              </TextComponent>
            </div>
            <div>
              <TextComponent type="primary" style={{ fontWeight: 650 }}>
                Most associated subjects
              </TextComponent>
              <ul>
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
                        <span>{subject}</span>
                      </OverlayTrigger>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <TextComponent type="primary" style={{ fontWeight: 650 }}>
                Average professor rating over time
              </TextComponent>
              {chartData.length > 0 ? (
                <CustomChart data={chartData} />
              ) : (
                <div>No data</div>
              )}
            </div>
          </Col>
          {/* </div> */}
          <Col md={5} className="px-0 my-0">
            {/* <div style={{ width: "100% " }}> */}
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
                <span className={styles.evaluationHeader}>Season</span>
              </Col>
              <Col xs={2} className="d-flex ms-0 justify-content-center px-0">
                <span className={styles.evaluationHeader}>Class</span>
              </Col>
              <Col xs={2} className="d-flex ms-0 justify-content-center px-0">
                <span className={styles.evaluationHeader}>Work</span>
              </Col>
            </Row>
            {professor.course_professors.map(({ course }) => (
              <Row
                key={course.course_id}
                className="m-auto py-1"
                style={{ justifyContent: 'right' }}
              >
                {course.title}
                {/* <CourseLink
                  listing={listing}
                  course={course}
                  filter={filter}
                  onNavigation={onNavigation}
                />
                <RatingNumbers
                  course={course}
                  hasEvals={user?.hasEvals}
                  professorView={professorView != null}
                /> */}
              </Row>
            ))}
          </Col>
        </div>
      ) : (
        <div className="m-auto text-center">
          <strong>No Results</strong>
        </div>
      )}
    </div>
  );
}

export default OverviewPanel;
