import React, { useMemo, useState } from 'react';
import {
  Row,
  Col,
  Modal,
  OverlayTrigger,
  Tooltip,
  Popover,
  Collapse,
} from 'react-bootstrap';
import type { OverlayChildren } from 'react-bootstrap/esm/Overlay';
import * as Sentry from '@sentry/react';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { IoIosArrowDown } from 'react-icons/io';
import { HiExternalLink } from 'react-icons/hi';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import MultiToggle from 'react-multi-toggle';
import clsx from 'clsx';

import { CUR_YEAR, CUR_SEASON } from '../../config';
import { useUser } from '../../contexts/userContext';
import { useSearch } from '../../contexts/searchContext';
import {
  TextComponent,
  InfoPopover,
  RatingBubble,
  LinkLikeText,
} from '../Typography';
import { ratingColormap, workloadColormap } from '../../utilities/constants';
import styles from './CourseModalOverview.module.css';
import CourseModalLoading from './CourseModalLoading';
import {
  getEnrolled,
  toSeasonString,
  to12HourTime,
  isDiscussionSection,
} from '../../utilities/course';
import {
  useSameCourseOrProfOfferingsQuery,
  type SameCourseOrProfOfferingsQuery,
} from '../../generated/graphql';
import {
  generateRandomColor,
  type NarrowListing,
  type Weekdays,
  type Listing,
} from '../../utilities/common';
import './react-multi-toggle-override.css';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

type Filter = 'both' | 'course' | 'professor';

type ProfInfo = {
  email: string;
  totalRating: number;
  numCourses: number;
};

type CourseOffering = {
  rating: number | null;
  workload: number | null;
  professorRating: number | null;
  professor: string[];
  listing: Listing;
};

type RelatedListingInfo = Omit<
  NarrowListing<
    SameCourseOrProfOfferingsQuery['computed_listing_info'][number]
  >,
  'professor_info'
> & {
  // For public may not have prof info
  professor_info?: {
    average_rating: number;
    email: string;
    name: string;
  }[];
};

const profInfoPopover =
  (profName: string, profInfo: ProfInfo | undefined): OverlayChildren =>
  (props) => (
    <InfoPopover {...props} id="title-popover" className="d-none d-md-block">
      <Popover.Title>
        <Row className="mx-auto">
          <strong>{profName}</strong>
        </Row>
        <Row className="mx-auto">
          <small>
            {profInfo?.email ? (
              <a href={`mailto:${profInfo.email}`}>{profInfo.email}</a>
            ) : (
              <TextComponent type="secondary">N/A</TextComponent>
            )}
          </small>
        </Row>
      </Popover.Title>
      <Popover.Content style={{ width: '274px' }}>
        <Row className="mx-auto my-1">
          <Col md={6}>
            <Row className="mx-auto mb-1">
              <strong
                className="mx-auto"
                style={{
                  color: profInfo?.numCourses
                    ? ratingColormap(profInfo.totalRating / profInfo.numCourses)
                        .darken()
                        .saturate()
                        .css()
                    : '#b5b5b5',
                }}
              >
                {
                  // Get average rating
                  profInfo?.numCourses
                    ? (profInfo.totalRating / profInfo.numCourses).toFixed(1)
                    : 'N/A'
                }
              </strong>
            </Row>
            <Row className="mx-auto">
              <small className="mx-auto text-center  font-weight-bold">
                Avg. Rating
              </small>
            </Row>
          </Col>
          <Col md={6}>
            <Row className="mx-auto mb-1">
              <strong className="mx-auto">
                {profInfo?.numCourses ?? '[unknown]'}
              </strong>
            </Row>
            <Row className="mx-auto">
              <small className="mx-auto text-center  font-weight-bold">
                Classes Taught
              </small>
            </Row>
          </Col>
        </Row>
      </Popover.Content>
    </InfoPopover>
  );

function Description({ listing }: { readonly listing: Listing }) {
  const [clamped, setClamped] = useState(false);
  const [lines, setLines] = useState(8);
  return (
    <>
      <Row className="mx-auto">
        <ResponsiveEllipsis
          style={{ whiteSpace: 'pre-wrap' }}
          text={listing.description ? listing.description : 'no description'}
          maxLine={lines}
          basedOn="words"
          onReflow={(rleState) => setClamped(rleState.clamped)}
        />
      </Row>
      {clamped && (
        <Row className="mx-auto">
          <LinkLikeText
            className="mx-auto"
            onClick={() => {
              setLines(100);
            }}
            title="Read More"
          >
            <IoIosArrowDown size={20} />
          </LinkLikeText>
        </Row>
      )}
    </>
  );
}

const COL_LEN_LEFT = 4;

function Syllabus({
  data,
  listing,
}: {
  readonly data: SameCourseOrProfOfferingsQuery | undefined;
  readonly listing: Listing;
}) {
  const pastSyllabi = useMemo(() => {
    if (!data) return [];
    return data.computed_listing_info
      .filter(
        (
          course,
        ): course is RelatedListingInfo & {
          syllabus_url: string;
        } =>
          course.same_course_id === listing.same_course_id &&
          Boolean(course.syllabus_url),
      )
      .filter(
        // Remove duplicates by syllabus URL
        (v, i, a) =>
          a.findIndex((t) => t.syllabus_url === v.syllabus_url) === i,
      )
      .sort(
        (a, b) =>
          b.season_code.localeCompare(a.season_code, 'en-US') ||
          parseInt(a.section, 10) - parseInt(b.section, 10),
      );
  }, [data, listing.same_course_id]);

  const [showPastSyllabi, setShowPastSyllabi] = useState(
    pastSyllabi.length < 8,
  );

  return (
    <>
      <Row className="m-auto pt-4 pb-2">
        <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
          <span className={styles.labelBubble}>Syllabus</span>
        </Col>
        <Col
          sm={12 - COL_LEN_LEFT}
          xs={11 - COL_LEN_LEFT}
          className={styles.metadata}
        >
          {listing.syllabus_url ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={listing.syllabus_url}
              className="d-flex"
            >
              View Syllabus
              <HiExternalLink size={18} className="ml-1 my-auto" />
            </a>
          ) : (
            'N/A'
          )}
        </Col>
      </Row>
      {pastSyllabi.length > 0 && (
        <Row className="m-auto pt-4 pb-2">
          <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
            <button
              type="button"
              className={styles.toggleBubble}
              onClick={() => setShowPastSyllabi(!showPastSyllabi)}
            >
              Past syllabi ({pastSyllabi.length}){' '}
              {showPastSyllabi ? (
                <MdExpandLess size={18} className="my-auto" />
              ) : (
                <MdExpandMore size={18} className="my-auto" />
              )}
            </button>
          </Col>
          <Collapse in={showPastSyllabi}>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={styles.metadata}
            >
              {pastSyllabi.map((course) => (
                <a
                  key={`${course.season_code}-${course.section}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={course.syllabus_url}
                  className="d-flex"
                >
                  {toSeasonString(course.season_code)} (section {course.section}
                  )
                  <HiExternalLink size={18} className="ml-1 my-auto" />
                </a>
              ))}
            </Col>
          </Collapse>
        </Row>
      )}
    </>
  );
}

function Professors({
  data,
  listing,
}: {
  readonly data: SameCourseOrProfOfferingsQuery | undefined;
  readonly listing: Listing;
}) {
  const profInfo = useMemo(() => {
    const profInfo = new Map(
      listing.professor_names.map((prof): [string, ProfInfo] => [
        prof,
        { numCourses: 0, totalRating: 0, email: '' },
      ]),
    );
    // Only count cross-listed courses once per season
    const countedCourses = new Set<string>();
    if (!data) return profInfo;
    for (const season of data.computed_listing_info as RelatedListingInfo[]) {
      if (countedCourses.has(`${season.season_code}-${season.course_code}`))
        continue;
      if (!season.professor_info) continue;
      season.professor_info.forEach((prof) => {
        if (profInfo.has(prof.name)) {
          const dict = profInfo.get(prof.name)!;
          dict.numCourses++;
          dict.totalRating += prof.average_rating;
          dict.email = prof.email;
          season.all_course_codes.forEach((c) => {
            countedCourses.add(`${season.season_code}-${c}`);
          });
        }
      });
    }
    return profInfo;
  }, [data, listing]);

  return (
    <Row className="m-auto py-2">
      <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
        <span className={styles.labelBubble}>Professor</span>
      </Col>
      <Col
        sm={12 - COL_LEN_LEFT}
        xs={11 - COL_LEN_LEFT}
        className={styles.metadata}
      >
        {listing.professor_names.length
          ? listing.professor_names.map((prof, index) => (
              <React.Fragment key={prof}>
                {index ? ' • ' : ''}
                <OverlayTrigger
                  trigger="click"
                  rootClose
                  placement="right"
                  overlay={profInfoPopover(prof, profInfo.get(prof))}
                >
                  <LinkLikeText>{prof}</LinkLikeText>
                </OverlayTrigger>
              </React.Fragment>
            ))
          : 'N/A'}
      </Col>
    </Row>
  );
}

function TimeLocation({ listing }: { readonly listing: Listing }) {
  const locations = new Map<string, string>();
  const times = new Map<string, Set<Weekdays>>();
  for (const [day, info] of Object.entries(listing.times_by_day)) {
    for (const [startTime, endTime, location, locationURL] of info) {
      if (locations.has(location) && locations.get(location) !== locationURL) {
        Sentry.captureException(
          new Error(
            `${listing.course_code} has duplicate location ${location} with different URLs`,
          ),
        );
      }
      locations.set(location, locationURL);
      const timespan = `${to12HourTime(startTime)}-${to12HourTime(endTime)}`;
      if (!times.has(timespan)) times.set(timespan, new Set());

      // Note! Some classes have multiple places at the same time, particularly
      // if one is "online". Avoid duplicates.
      // See for example: CDE 567, Spring 2023
      times.get(timespan)!.add(day as Weekdays);
    }
  }
  return (
    <>
      <Row className="m-auto py-2">
        <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
          <span className={styles.labelBubble}>Meets</span>
        </Col>
        <Col
          sm={12 - COL_LEN_LEFT}
          xs={11 - COL_LEN_LEFT}
          className={styles.metadata}
        >
          {[...times.entries()].map(([timespan, days]) => (
            <div key={timespan}>
              {[...days]
                .map((d) =>
                  ['Thursday', 'Saturday', 'Sunday'].includes(d)
                    ? d.slice(0, 2)
                    : d[0],
                )
                .join('')}{' '}
              {timespan}
            </div>
          ))}
        </Col>
      </Row>
      <Row className="m-auto py-2">
        <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
          <span className={styles.labelBubble}>Location</span>
        </Col>
        <Col
          sm={12 - COL_LEN_LEFT}
          xs={11 - COL_LEN_LEFT}
          className={styles.metadata}
        >
          {[...locations.entries()].map(([location, locationURL]) => (
            <div key={location}>
              {locationURL ? (
                <a target="_blank" rel="noopener noreferrer" href={locationURL}>
                  {location}
                  <HiExternalLink size={18} className="ml-1 my-auto" />
                </a>
              ) : (
                location
              )}
            </div>
          ))}
        </Col>
      </Row>
    </>
  );
}

// Hold index of each filter option
const optionsIndx = {
  course: 0,
  both: 1,
  professor: 2,
};

function RatingContent({
  offering,
  hasEvals,
}: {
  readonly offering: CourseOffering;
  readonly hasEvals: boolean | undefined;
}) {
  // For random seeds
  const ratingIdentifier = `${offering.listing.crn}${offering.listing.season_code}rating`;
  const workloadIdentifier = `${offering.listing.crn}${offering.listing.season_code}workload`;
  const professorIdentifier = `${offering.listing.crn}${offering.listing.season_code}professor`;

  const ratingBubbles = [
    {
      colorMap: ratingColormap,
      rating: offering.rating,
      identifier: ratingIdentifier,
    },
    {
      colorMap: ratingColormap,
      rating: offering.professorRating,
      identifier: professorIdentifier,
    },
    {
      colorMap: workloadColormap,
      rating: offering.workload,
      identifier: workloadIdentifier,
    },
  ];
  if (hasEvals) {
    return ratingBubbles.map(({ colorMap, rating }, i) => (
      <Col
        key={i}
        xs={2}
        className="px-1 ml-0 d-flex justify-content-center text-center"
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
        className="px-1 ml-0 d-flex justify-content-center text-center"
      >
        <RatingBubble
          color={generateRandomColor(identifier)}
          className={styles.ratingCell}
        />
      </Col>
    </OverlayTrigger>
  ));
}

function EvalsCol({
  gotoCourse,
  data,
  listing,
}: {
  readonly gotoCourse: (x: Listing) => void;
  readonly data: SameCourseOrProfOfferingsQuery | undefined;
  readonly listing: Listing;
}) {
  const { user } = useUser();
  const overlapSections = useMemo(() => {
    const overlapSections: {
      [filter in Filter]: CourseOffering[];
    } = { both: [], course: [], professor: [] };
    if (!data) return overlapSections;
    (data.computed_listing_info as RelatedListingInfo[])
      // Discussion sections have no ratings, nothing to show
      .filter((course) => !isDiscussionSection(course))
      .map((course): CourseOffering => {
        const averageProfessorRating = course.professor_info
          ? course.professor_info.reduce(
              (sum, prof) => sum + (prof.average_rating || 0),
              0,
            ) / course.professor_info.length
          : null;
        return {
          rating: course.course?.evaluation_statistic?.avg_rating || null,
          workload: course.course?.evaluation_statistic?.avg_workload || null,
          professorRating: averageProfessorRating || null,
          professor: course.professor_names.length
            ? course.professor_names
            : ['TBA'],
          listing: course,
        };
      })
      .sort(
        (a, b) =>
          b.listing.season_code.localeCompare(a.listing.season_code, 'en-US') ||
          parseInt(a.listing.section, 10) - parseInt(b.listing.section, 10),
      )
      .forEach((offering) => {
        // Skip listings in the current and future seasons that have no evals
        if (CUR_YEAR.includes(offering.listing.season_code)) return;
        const overlappingProfs = listing.professor_names.reduce(
          (cnt, prof) => cnt + (offering.professor.includes(prof) ? 1 : 0),
          0,
        );
        // TODO: this whole logic is not ideal. We need to systematically
        // reconsider what we mean by "same course" and "same professor".
        // See: https://docs.google.com/document/d/1mIsanCz1U3M6SU2KbcBp9ONXRssDfeTzRtDIRzxdAOk
        const isCourseOverlap =
          offering.listing.course_code === listing.course_code;
        const isProfOverlap = overlappingProfs > 0;
        // We require ALL professors to be the same
        const isBothOverlap =
          isCourseOverlap &&
          overlappingProfs === offering.professor.length &&
          overlappingProfs === listing.professor_names.length;
        if (isBothOverlap) overlapSections.both.push(offering);
        if (isCourseOverlap) overlapSections.course.push(offering);
        if (isProfOverlap) overlapSections.professor.push(offering);
        // Consider a course cross-listed with course codes A and B.
        // It was taught by prof X in year 1 and prof Y in year 2.
        // Then GraphQL would return 2-B when viewing 1-A even when they
        // appear to not overlap.
        // TODO: maybe we should fix this in the GraphQL layer? Again,
        // reconsideration of course relationships needed...
      });
    return overlapSections;
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
    <Col md={5} className="px-0 my-0">
      <Row
        className={clsx(
          styles.filterContainer,
          'm-auto justify-content-center',
        )}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          // Left/right arrow key
          const newIndx = ((optionsIndx[filter] +
            (e.key === 'ArrowLeft' ? 2 : e.key === 'ArrowRight' ? 1 : 0)) %
            3) as 0 | 1 | 2;
          setFilter(options[newIndx].value);
        }}
        tabIndex={0}
      >
        <MultiToggle
          options={options}
          selectedOption={filter}
          onSelectOption={(val) => setFilter(val)}
          className={clsx(styles.evaluationsFilter, 'mb-2')}
        />
      </Row>
      {overlapSections[filter].length !== 0 ? (
        <>
          <Row className="m-auto pb-1 justify-content-center">
            <Col xs={5} className="d-flex justify-content-center px-0 mr-3">
              <span className={styles.evaluationHeader}>Season</span>
            </Col>
            <Col xs={2} className="d-flex ml-0 justify-content-center px-0">
              <span className={styles.evaluationHeader}>Class</span>
            </Col>
            <Col xs={2} className="d-flex ml-0 justify-content-center px-0">
              <span className={styles.evaluationHeader}>Prof</span>
            </Col>
            <Col xs={2} className="d-flex ml-0 justify-content-center px-0">
              <span className={styles.evaluationHeader}>Work</span>
            </Col>
          </Row>
          {overlapSections[filter].map((offering) => (
            <Row
              key={offering.listing.season_code + offering.listing.crn}
              className="m-auto py-1 justify-content-center"
            >
              <Col
                as="button"
                role="button"
                xs={5}
                className={clsx(styles.ratingBubble, 'px-0 mr-3 text-center')}
                tabIndex={0}
                onClick={() => {
                  // Note, we purposefully use the listing data fetched
                  // from GraphQL instead of the static seasons data.
                  // This means on navigation we don't have to possibly
                  // fetch a new season and cause a loading screen.
                  gotoCourse(offering.listing);
                }}
              >
                <strong>{toSeasonString(offering.listing.season_code)}</strong>
                <div className={clsx(styles.details, 'mx-auto')}>
                  {filter === 'professor'
                    ? offering.listing.course_code
                    : filter === 'both'
                      ? `Section ${offering.listing.section}`
                      : offering.professor[0]}
                </div>
              </Col>
              <RatingContent offering={offering} hasEvals={user.hasEvals} />
            </Row>
          ))}
        </>
      ) : (
        <Row className="m-auto justify-content-center">
          <strong>No Results</strong>
        </Row>
      )}
    </Col>
  );
}

function CourseModalOverview({
  gotoCourse,
  listing,
}: {
  readonly gotoCourse: (x: Listing) => void;
  readonly listing: Listing;
}) {
  const { user } = useUser();
  const { numFriends } = useSearch();
  const alsoTaking = [
    ...(numFriends[`${listing.season_code}${listing.crn}`] ?? []),
  ];

  const { data, loading, error } = useSameCourseOrProfOfferingsQuery({
    variables: {
      hasEval: Boolean(user.hasEvals), // Skip this query if not authenticated
      same_course_id: listing.same_course_id,
      professor_ids: listing.professor_ids,
    },
  });

  // Wait until data is fetched
  if (loading || error) return <CourseModalLoading />;

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={7} className="px-0 mt-0 mb-3">
          <Description listing={listing} />
          {listing.requirements && (
            <Row className="mx-auto">
              <span className={clsx(styles.requirements, 'pt-1')}>
                {listing.requirements}
              </span>
            </Row>
          )}
          <Syllabus data={data} listing={listing} />
          <Professors data={data} listing={listing} />
          <TimeLocation listing={listing} />
          {[
            { name: 'Section', value: listing.section },
            {
              name: 'Info',
              value: listing.flag_info.length ? (
                <ul className={styles.flagInfo}>
                  {listing.flag_info.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              ) : null,
            },
            {
              name: 'Enrollment',
              value: getEnrolled(listing, 'modal'),
              tooltip:
                CUR_SEASON === listing.season_code ? (
                  <span>
                    Class Enrollment
                    <br />
                    (If the course has not occurred/completed, based on the most
                    recent past instance of this course. a ~ means a different
                    professor was teaching)
                  </span>
                ) : (
                  <span>
                    Previous Class Enrollment
                    <br />
                    (based on the most recent past instance of this course. a ~
                    means a different professor was teaching)
                  </span>
                ),
              sortOption: 'last_enrollment',
            },
            { name: 'Credits', value: listing.credits },
            { name: 'Class Notes', value: listing.classnotes },
            { name: 'Registrar Notes', value: listing.regnotes },
            { name: 'Reading Period', value: listing.rp_attr },
            {
              name: 'Final Exam',
              value: listing.final_exam === 'HTBA' ? null : listing.final_exam,
            },
            {
              name: 'Friends',
              value: alsoTaking.length
                ? alsoTaking.map((friend, index) => (
                    <Row className="m-auto" key={index}>
                      {friend + (index === alsoTaking.length - 1 ? '' : ',')}
                    </Row>
                  ))
                : null,
            },
          ].map(({ name, value, tooltip }) => {
            const content = (
              <Row className="m-auto py-2">
                <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                  <span className={styles.labelBubble}>{name}</span>
                </Col>
                <Col
                  sm={12 - COL_LEN_LEFT}
                  xs={11 - COL_LEN_LEFT}
                  className={styles.metadata}
                >
                  {value}
                </Col>
              </Row>
            );

            return (
              value !== null &&
              (tooltip ? (
                <OverlayTrigger
                  key={name}
                  placement="top"
                  overlay={<Tooltip id={`${name}-tooltip`}>{tooltip}</Tooltip>}
                >
                  {content}
                </OverlayTrigger>
              ) : (
                content
              ))
            );
          })}
        </Col>
        <EvalsCol gotoCourse={gotoCourse} data={data} listing={listing} />
      </Row>
    </Modal.Body>
  );
}

export default CourseModalOverview;
