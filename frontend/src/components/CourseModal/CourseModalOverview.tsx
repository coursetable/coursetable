import React, { useMemo, useState, useCallback } from 'react';
import {
  Row,
  Col,
  Modal,
  OverlayTrigger,
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

import { CUR_YEAR } from '../../config';
import { useUser } from '../../contexts/userContext';
import {
  TextComponent,
  StyledPopover,
  StyledRating,
  StyledLink,
} from '../StyledComponents';
import { ratingColormap, workloadColormap } from '../../utilities/constants';
import styles from './CourseModalOverview.module.css';
import CourseModalLoading from './CourseModalLoading';
import {
  friendsAlsoTaking,
  getEnrolled,
  toSeasonString,
  to12HourTime,
} from '../../utilities/course';
import {
  useSameCourseOrProfOfferingsQuery,
  type SameCourseOrProfOfferingsQuery,
} from '../../generated/graphql';
import {
  weekdays,
  type Season,
  type Crn,
  type Listing,
  type Weekdays,
} from '../../utilities/common';
import './react-multi-toggle-override.css';

// Component used for cutting off long descriptions
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

export type Filter = 'both' | 'course' | 'professor';

type ProfInfo = {
  email: string;
  totalRating: number;
  numCourses: number;
};

// TODO: merge it with one of the many types representing "a course"
export type CourseOffering = {
  // Course rating
  rating: number;
  // Workload rating
  workload: number;
  // Professor rating
  professor_rating: number;
  // Season code
  season_code: Season;
  // Professors
  professor: string[];
  // Course code
  course_code: string;
  // Crn
  crn: Crn;
  // Section number
  section: string;
  // Course Title
  title: string;
  // Course Skills
  skills: string[];
  // Course Areas
  areas: string[];
  // Store course listing
  listing: ComputedListingInfo;
};

// TODO: merge it with one of the many types representing "a course"
type ComputedListingInfoOverride = Pick<
  Listing,
  | 'all_course_codes'
  | 'areas'
  | 'crn'
  | 'flag_info'
  | 'season_code'
  | 'skills'
  | 'professor_ids'
  | 'professor_names'
  | 'times_by_day'
  | 'extra_info'
> & {
  professor_info: {
    average_rating: number;
    email: string;
    name: string;
  }[];
};

export type ComputedListingInfo = Omit<
  SameCourseOrProfOfferingsQuery['computed_listing_info'][number],
  keyof ComputedListingInfoOverride
> &
  ComputedListingInfoOverride;

const profInfoPopover =
  (profName: string, profInfo: ProfInfo | undefined): OverlayChildren =>
  (props) => (
    <StyledPopover {...props} id="title-popover" className="d-none d-md-block">
      <Popover.Title>
        <Row className="mx-auto">
          {/* Professor Name */}
          <strong>{profName}</strong>
        </Row>
        <Row className="mx-auto">
          {/* Professor Email */}
          <small>
            {profInfo?.email ? (
              <a href={`mailto:${profInfo.email}`}>{profInfo.email}</a>
            ) : (
              <TextComponent type={1}>N/A</TextComponent>
            )}
          </small>
        </Row>
      </Popover.Title>
      <Popover.Content style={{ width: '274px' }}>
        <Row className="mx-auto my-1">
          <Col md={6}>
            {/* Professor Rating */}
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
            {/* Number of courses taught by this professor */}
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
    </StyledPopover>
  );

/**
 * Displays course modal when clicking on a course
 * @prop setFilter - function that switches evaluation filter
 * @prop filter - string that holds current filter
 * @prop setSeason - function that sets the evaluation to view
 * @prop listing - dictionary that holds all the info for this listing
 */

function CourseModalOverview({
  setFilter,
  filter,
  setSeason,
  listing,
}: {
  readonly setFilter: (f: Filter) => void;
  readonly filter: Filter;
  readonly setSeason: (x: CourseOffering) => void;
  readonly listing: ComputedListingInfo;
}) {
  // Fetch user context data
  const { user } = useUser();
  // Is description clamped?
  const [clamped, setClamped] = useState(false);
  // Number of description lines to display
  const [lines, setLines] = useState(8);
  // List of other friends shopping this class
  const alsoTaking = friendsAlsoTaking(
    listing.season_code,
    listing.crn,
    user.friends,
  );

  const locations = new Map<string, string>();
  const times = new Map<string, Set<Weekdays>>();
  for (const day of weekdays) {
    const info = listing.times_by_day[day];
    if (!info) continue;
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
      times.get(timespan)!.add(day);
    }
  }

  const { loading, error, data } = useSameCourseOrProfOfferingsQuery({
    variables: {
      same_course_id: listing.same_course_id,
      professor_ids: listing.professor_ids,
    },
  });

  // Holds Prof information for popover
  const profInfo = useMemo(() => {
    const profInfo = new Map(
      listing.professor_names.map((prof): [string, ProfInfo] => [
        prof,
        {
          // Total number of courses this professor teaches
          numCourses: 0,
          // Total rating. Will divide by number of courses later to
          // get average
          totalRating: 0,
          // Prof email
          email: '',
        },
      ]),
    );
    // Only count cross-listed courses once per season
    const countedCourses = new Set<string>();
    if (!data) return profInfo;
    for (const season of data.computed_listing_info as ComputedListingInfo[]) {
      if (countedCourses.has(`${season.season_code}-${season.course_code}`))
        continue;
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

  // Count number of profs that overlap between this listing and an eval
  const overlappingProfs = useCallback(
    (evalProfs: string[]) => {
      let cnt = 0;
      listing.professor_names.forEach((prof) => {
        // Eval course contains this prof
        if (evalProfs.includes(prof)) cnt++;
      });
      return cnt;
    },
    [listing.professor_names],
  );
  // Get past syllabi links
  const pastSyllabi = useMemo(() => {
    if (!data) return [];
    return data.computed_listing_info
      .filter(
        (
          course,
        ): course is ComputedListingInfo & {
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

  const overlapSections = useMemo(() => {
    const overlapSections: {
      [filter in Filter]: JSX.Element[];
    } = { both: [], course: [], professor: [] };
    if (!data) return overlapSections;
    // Hold list of evaluation dictionaries
    const courseOfferings: CourseOffering[] = [];
    // Loop by season code
    for (const season of data.computed_listing_info as ComputedListingInfo[]) {
      // Stores the average rating for all profs teaching this course and
      // populates prof_info
      let averageProfessorRating = 0;
      const numProfs = season.professor_info.length;
      season.professor_info.forEach((prof) => {
        if (prof.average_rating) {
          // Add up all prof ratings
          averageProfessorRating += prof.average_rating;
        }
      });
      // Divide by number of profs to get average
      averageProfessorRating /= numProfs;
      courseOfferings.push({
        // Course rating
        rating: season.course.evaluation_statistic
          ? season.course.evaluation_statistic.avg_rating || -1
          : -1,
        // Workload rating
        workload: season.course.evaluation_statistic
          ? season.course.evaluation_statistic.avg_workload || -1
          : -1,
        // Professor rating
        professor_rating: averageProfessorRating || -1,
        // Season code
        season_code: season.season_code,
        // Professors
        professor: season.professor_names.length
          ? season.professor_names
          : ['TBA'],
        // Course code
        course_code: season.course_code || 'TBA',
        // Crn
        crn: season.crn,
        // Section number
        section: season.section,
        // Course Title
        title: season.title,
        // Course Skills
        skills: season.skills,
        // Course Areas
        areas: season.areas,
        // Store course listing
        listing: season,
      });
    }
    // Sort by season code and section
    courseOfferings.sort(
      (a, b) =>
        b.season_code.localeCompare(a.season_code, 'en-US') ||
        parseInt(a.section, 10) - parseInt(b.section, 10),
    );

    // Loop through each listing with evals
    courseOfferings.forEach((offering, i) => {
      // Skip listings in the current and future seasons that have no evals
      if (CUR_YEAR.includes(offering.season_code)) return;
      // TODO: this whole logic is not ideal. We need to systematically
      // reconsider what we mean by "same course" and "same professor".
      // See: https://docs.google.com/document/d/1mIsanCz1U3M6SU2KbcBp9ONXRssDfeTzRtDIRzxdAOk
      const isCourseOverlap = offering.course_code === listing.course_code;
      const isProfOverlap = overlappingProfs(offering.professor) > 0;
      // We require ALL professors to be the same
      const isBothOverlap =
        isCourseOverlap &&
        overlappingProfs(offering.professor) === listing.professor_names.length;
      const hasEvals = offering.rating !== -1;
      const type = isBothOverlap
        ? 'both'
        : isCourseOverlap
          ? 'course'
          : isProfOverlap
            ? 'professor'
            : undefined;
      if (!type) {
        // Consider a course cross-listed with course codes A and B.
        // It was taught by prof X in year 1 and prof Y in year 2.
        // Then GraphQL would return 2-B when viewing 1-A even when they appear
        // to not overlap.
        // TODO: maybe we should fix this in the GraphQL layer? Again,
        // reconsideration of course relationships needed...
        return;
      }
      const evalBox = (
        <Row key={i} className="m-auto py-1 justify-content-center">
          {/* The listing button, either clickable or greyed out based on
                whether evaluations exist */}
          {hasEvals ? (
            <Col
              xs={5}
              className={clsx(styles.ratingBubble, 'px-0 mr-3 text-center')}
              onClick={() => {
                // Temp dictionary that stores listing info
                const temp = { ...offering };
                setSeason(temp);
              }}
              style={{ flex: 'none' }}
            >
              <strong>{toSeasonString(offering.season_code)}</strong>
              <div className={clsx(styles.details, 'mx-auto', styles.shown)}>
                {type === 'professor'
                  ? offering.course_code
                  : type === 'both'
                    ? `Section ${offering.section}`
                    : offering.professor[0]}
              </div>
            </Col>
          ) : (
            <Col
              xs={5}
              className={clsx(
                styles.ratingBubbleUnclickable,
                'px-0 mr-3 text-center',
              )}
              style={{ flex: 'none', color: '#b5b5b5' }}
            >
              <strong>{toSeasonString(offering.season_code)}</strong>
              <div className={clsx(styles.details, 'mx-auto', styles.shown)}>
                {type === 'professor'
                  ? offering.course_code
                  : type === 'both'
                    ? `Section ${offering.section}`
                    : offering.professor[0]}
              </div>
            </Col>
          )}
          {/* Course Rating */}
          <Col
            xs={2}
            className="px-1 ml-0 d-flex justify-content-center text-center"
          >
            <StyledRating
              rating={offering.rating}
              colormap={ratingColormap}
              className={styles.ratingCell}
            >
              {offering.rating !== -1 ? offering.rating.toFixed(1) : 'N/A'}
            </StyledRating>
          </Col>
          {/* Professor Rating */}
          <Col
            xs={2}
            className="px-1 ml-0 d-flex justify-content-center text-center"
          >
            <StyledRating
              rating={offering.professor_rating}
              colormap={ratingColormap}
              className={styles.ratingCell}
            >
              {offering.professor_rating !== -1
                ? offering.professor_rating.toFixed(1)
                : 'N/A'}
            </StyledRating>
          </Col>
          {/* Workload Rating */}
          <Col
            xs={2}
            className="px-1 ml-0 d-flex justify-content-center text-center"
          >
            <StyledRating
              rating={offering.workload}
              colormap={workloadColormap}
              className={styles.ratingCell}
            >
              {offering.workload !== -1 ? offering.workload.toFixed(1) : 'N/A'}
            </StyledRating>
          </Col>
        </Row>
      );
      overlapSections[type].push(evalBox);
    });
    return overlapSections;
  }, [data, setSeason, listing, overlappingProfs]);
  // Wait until data is fetched
  if (loading || error) return <CourseModalLoading />;
  // Options for the evaluation filters
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

  // Hold index of each filter option
  const optionsIndx = {
    course: 0,
    both: 1,
    professor: 2,
  };

  const COL_LEN_LEFT = 4;

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={7} className="px-0 mt-0 mb-3">
          {/* Course Description */}
          <Row className="mx-auto">
            <ResponsiveEllipsis
              style={{ whiteSpace: 'pre-wrap' }}
              text={
                listing.description ? listing.description : 'no description'
              }
              maxLine={lines}
              basedOn="words"
              onReflow={(rleState) => setClamped(rleState.clamped)}
            />
          </Row>
          {/* Read More arrow button */}
          {clamped && (
            <Row className="mx-auto">
              <StyledLink
                className="mx-auto"
                onClick={() => {
                  setLines(100);
                }}
                title="Read More"
              >
                <IoIosArrowDown size={20} />
              </StyledLink>
            </Row>
          )}
          {/* Course Requirements */}
          {listing.requirements && (
            <Row className="mx-auto">
              <span className={clsx(styles.requirements, 'pt-1')}>
                {listing.requirements}
              </span>
            </Row>
          )}
          {/* Course Syllabus */}
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
                <span
                  role="button"
                  className={styles.toggleBubble}
                  onClick={() => setShowPastSyllabi(!showPastSyllabi)}
                >
                  Past syllabi ({pastSyllabi.length}){' '}
                  {showPastSyllabi ? (
                    <MdExpandLess size={18} className="my-auto" />
                  ) : (
                    <MdExpandMore size={18} className="my-auto" />
                  )}
                </span>
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
                      {toSeasonString(course.season_code)} (section{' '}
                      {course.section})
                      <HiExternalLink size={18} className="ml-1 my-auto" />
                    </a>
                  ))}
                </Col>
              </Collapse>
            </Row>
          )}
          {/* Course Professors */}
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
                        <StyledLink>{prof}</StyledLink>
                      </OverlayTrigger>
                    </React.Fragment>
                  ))
                : 'N/A'}
            </Col>
          </Row>
          {/* Course Times */}
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
                    .map((d) => (d === 'Thursday' ? 'Th' : d[0]))
                    .join('')}{' '}
                  {timespan}
                </div>
              ))}
            </Col>
          </Row>
          {/* Course Location */}
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
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={locationURL}
                    >
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
          {/* Course Section */}
          <Row className="m-auto py-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={styles.labelBubble}>Section</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={styles.metadata}
            >
              {listing.section ? listing.section : 'N/A'}
            </Col>
          </Row>
          {/* Course Information (flag_info) */}
          {listing.flag_info.length > 0 && (
            <Row className="m-auto py-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span className={styles.labelBubble}>Info</span>
              </Col>
              <Col
                sm={12 - COL_LEN_LEFT}
                xs={11 - COL_LEN_LEFT}
                className={styles.metadata}
              >
                {listing.flag_info.length ? (
                  <ul className={styles.flagInfo}>
                    {listing.flag_info.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                ) : (
                  'N/A'
                )}
              </Col>
            </Row>
          )}
          {/* Course Enrollment */}
          <Row className="m-auto py-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={styles.labelBubble}>Enrollment</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={styles.metadata}
            >
              {getEnrolled(listing, 'modal')}
            </Col>
          </Row>
          {/* Credits */}
          <Row className="m-auto py-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={styles.labelBubble}>Credits</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={styles.metadata}
            >
              {listing.credits}
            </Col>
          </Row>
          {/* Class Notes (classnotes) */}
          {listing.classnotes && (
            <Row className="m-auto py-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span className={styles.labelBubble}>Class Notes</span>
              </Col>
              <Col sm={12 - COL_LEN_LEFT} xs={11 - COL_LEN_LEFT}>
                {listing.classnotes}
              </Col>
            </Row>
          )}
          {/* Registrar Notes (regnotes) */}
          {listing.regnotes && (
            <Row className="m-auto py-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span className={styles.labelBubble}>Registrar Notes</span>
              </Col>
              <Col sm={12 - COL_LEN_LEFT} xs={11 - COL_LEN_LEFT}>
                {listing.regnotes}
              </Col>
            </Row>
          )}
          {/* Reading Period Notes (rp_attr) */}
          {listing.rp_attr && (
            <Row className="m-auto py-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span className={styles.labelBubble}>Reading Period</span>
              </Col>
              <Col sm={12 - COL_LEN_LEFT} xs={11 - COL_LEN_LEFT}>
                {listing.rp_attr}
              </Col>
            </Row>
          )}
          {/* Final Exam (final_exam) */}
          {listing.final_exam && listing.final_exam !== 'HTBA' && (
            <Row className="m-auto py-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span className={styles.labelBubble}>Final Exam</span>
              </Col>
              <Col sm={12 - COL_LEN_LEFT} xs={11 - COL_LEN_LEFT}>
                {listing.final_exam}
              </Col>
            </Row>
          )}
          {/* Friends that are also shopping this course */}
          {alsoTaking.length > 0 && (
            <Row className="m-auto py-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span className={styles.labelBubble}>Friends</span>
              </Col>
              <Col
                sm={12 - COL_LEN_LEFT}
                xs={11 - COL_LEN_LEFT}
                className={styles.metadata}
              >
                {alsoTaking.map((friend, index) => (
                  <Row className="m-auto" key={index}>
                    {friend + (index === alsoTaking.length - 1 ? '' : ',')}
                  </Row>
                ))}
              </Col>
            </Row>
          )}
        </Col>
        {/* Course Evaluations */}
        <Col md={5} className="px-0 my-0">
          {/* Filter Select */}
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
          {/* Course Evaluations Header */}
          {overlapSections[filter].length !== 0 && (
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
          )}
          {/* Course Evaluations */}
          {overlapSections[filter].length !== 0 && overlapSections[filter]}
          {/* No Course Evaluations */}
          {overlapSections[filter].length === 0 && (
            <Row className="m-auto justify-content-center">
              <strong>No Results</strong>
            </Row>
          )}
        </Col>
      </Row>
    </Modal.Body>
  );
}

export default CourseModalOverview;
