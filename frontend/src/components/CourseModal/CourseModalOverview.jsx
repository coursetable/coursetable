import React, { useMemo, useState, useCallback } from 'react';
import {
  Row,
  Col,
  Modal,
  OverlayTrigger,
  Popover,
  Collapse,
} from 'react-bootstrap';
import * as Sentry from '@sentry/react';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { IoIosArrowDown } from 'react-icons/io';
import { HiExternalLink } from 'react-icons/hi';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import MultiToggle from 'react-multi-toggle';
import styled from 'styled-components';

import '../Search/MultiToggle.css';
import { CUR_YEAR } from '../../config';
import { useUser } from '../../contexts/userContext';
import {
  TextComponent,
  StyledPopover,
  StyledRating,
  StyledLink,
} from '../StyledComponents';
import { ratingColormap, workloadColormap } from '../../queries/Constants';
import styles from './CourseModalOverview.module.css';
import CourseModalLoading from './CourseModalLoading';
import {
  friendsAlsoTaking,
  getEnrolled,
  toSeasonString,
} from '../../utilities/course';
import { useSameCourseOrProfOfferingsQuery } from '../../generated/graphql';
import { weekdays } from '../../utilities/common';

function convert24To12(time) {
  const [hour, minute] = time.split(':');
  let hourInt = parseInt(hour, 10);
  const ampm = hourInt >= 12 ? 'pm' : 'am';
  hourInt %= 12;
  if (hourInt === 0) hourInt = 12;
  const minuteInt = parseInt(minute, 10);
  return `${hourInt}:${minuteInt.toString().padStart(2, '0')}${ampm}`;
}

// Button with season and other info that user selects to view evals
const StyledCol = styled(Col)`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgb(190, 221, 255)' : theme.selectHover};
`;

// Unclickable version of StyledCol for courses with no evaluations
const StyledColUnclickable = styled(Col)`
  background-color: ${({ theme }) => theme.surface};
`;

// Multitoggle in modal (course, both, prof)
export const StyledMultiToggle = styled(MultiToggle)`
  background-color: ${({ theme }) => theme.surface[1]};
  border-color: ${({ theme }) => theme.border};
  .toggleOption {
    color: ${({ theme }) => theme.text[0]};
  }
`;

/**
 * Displays course modal when clicking on a course
 * @prop setFilter - function that switches evaluation filter
 * @prop filter - string that holds current filter
 * @prop setSeason - function that sets the evaluation to view
 * @prop listing - dictionary that holds all the info for this listing
 */

function CourseModalOverview({ setFilter, filter, setSeason, listing }) {
  // Fetch user context data
  const { user } = useUser();
  // Component used for cutting off long descriptions
  const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
  // Is description clamped?
  const [clamped, setClamped] = useState(false);
  // Number of description lines to display
  const [lines, setLines] = useState(8);
  // List of other friends shopping this class
  const alsoTaking = user.friendWorksheets
    ? friendsAlsoTaking(
        listing.season_code,
        listing.crn,
        user.friendWorksheets.worksheets,
        user.friendWorksheets.friendInfo,
      )
    : [];

  const locations = new Map();
  const times = new Map();
  for (const day of weekdays) {
    const info = listing.times_by_day[day];
    if (!info) continue;
    for (const [startTime, endTime, location, locationURL] of info) {
      if (locations.has(location) && locations.get(location) !== locationURL) {
        Sentry.captureException(
          new Error(`Duplicate location ${location} with different URLs`),
        );
      }
      locations.set(location, locationURL);
      const timespan = `${convert24To12(startTime)}-${convert24To12(endTime)}`;
      if (!times.has(timespan)) times.set(timespan, new Set());

      // Note! Some classes have multiple places at the same time, particularly
      // if one is "online". Avoid duplicates.
      // See for example: CDE 567, Spring 2023
      times.get(timespan).add(day);
    }
  }

  const { loading, error, data } = useSameCourseOrProfOfferingsQuery({
    variables: {
      same_course_id: listing.same_course_id,
      professor_ids: listing.professor_ids.map((x) => String(x)),
    },
  });
  // Hold HTML code that displays the list of evaluations

  // Holds Prof information for popover
  const profInfo = useMemo(() => {
    const profInfoTemp = {};
    listing.professor_names.forEach((prof) => {
      profInfoTemp[prof] = {
        numCourses: 0,
        totalRating: 0,
        email: '',
      };
    });
    return profInfoTemp;
  }, [listing.professor_names]);
  // Count number of profs that overlap between this listing and an eval
  const overlappingProfs = useCallback(
    (evalProfs) => {
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
    if (data) {
      return data.computed_listing_info
        .filter(
          (course) =>
            course.same_course_id === listing.same_course_id &&
            course.syllabus_url,
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
    }
    return [];
  }, [data, listing.same_course_id]);

  const [showPastSyllabi, setShowPastSyllabi] = useState(
    pastSyllabi && pastSyllabi.length < 8,
  );

  // Make sure data is loaded
  const items = useMemo(() => {
    if (data) {
      // Hold list of evaluation dictionaries
      const courseOfferings = [];
      // Loop by season code
      data.computed_listing_info.forEach((season) => {
        // Stores the average rating for all profs teaching this course and
        // populates prof_info
        let averageProfessorRating = 0;
        if (season.professor_info) {
          const numProfs = season.professor_info.length;
          season.professor_info.forEach((prof) => {
            if (prof.average_rating) {
              // Add up all prof ratings
              averageProfessorRating += prof.average_rating;
              // Update prof_info
              if (prof.name in profInfo) {
                // Store dict from prof_info for easy access
                const dict = profInfo[prof.name];
                // Total number of courses this professor teaches
                dict.numCourses++;
                // Total rating. Will divide by number of courses later to
                // get average
                dict.totalRating += prof.average_rating;
                // Prof email
                dict.email = prof.email;
              }
            }
          });
          // Divide by number of profs to get average
          averageProfessorRating /= numProfs;
        }
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
          course_code: season.course_code ? [season.course_code] : ['TBA'],
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
      });
      // Sort by season code and section
      courseOfferings.sort(
        (a, b) =>
          b.season_code.localeCompare(a.season_code, 'en-US') ||
          parseInt(a.section, 10) - parseInt(b.section, 10),
      );
      // Hold eval html for each column
      const overlapSections = { both: [], course: [], professor: [] };

      // Variable used for list keys
      let id = 0;

      // Loop through each listing with evals
      for (const offering of courseOfferings) {
        // Skip listings in the current and future seasons that have no evals
        if (CUR_YEAR.includes(offering.season_code)) continue;
        const hasEvals = offering.rating !== -1;
        const evalBox = (
          <Row key={id++} className="m-auto py-1 justify-content-center">
            {/* The listing button, either clickable or greyed out based on
                whether evaluations exist */}
            {hasEvals ? (
              <StyledCol
                xs={5}
                className={`${styles.rating_bubble}  px-0 mr-3 text-center`}
                onClick={() => {
                  // Temp dictionary that stores listing info
                  const temp = { ...offering };
                  // eslint-disable-next-line prefer-destructuring
                  temp.course_code = temp.course_code[0];
                  setSeason(temp);
                }}
                style={{ flex: 'none' }}
              >
                <strong>{toSeasonString(offering.season_code)}</strong>
                <div className={`${styles.details} mx-auto ${styles.shown}`}>
                  {filter === 'professor'
                    ? offering.course_code[0]
                    : filter === 'both'
                    ? `Section ${offering.section}`
                    : offering.professor[0]}
                </div>
              </StyledCol>
            ) : (
              <StyledColUnclickable
                xs={5}
                className={`${styles.rating_bubble_unclickable}  px-0 mr-3 text-center`}
                style={{ flex: 'none', color: '#b5b5b5' }}
              >
                <strong>{toSeasonString(offering.season_code)}</strong>
                <div className={`${styles.details} mx-auto ${styles.shown}`}>
                  {filter === 'professor'
                    ? offering.course_code[0]
                    : filter === 'both'
                    ? `Section ${offering.section}`
                    : offering.professor[0]}
                </div>
              </StyledColUnclickable>
            )}
            {/* Course Rating */}
            <Col
              xs={2}
              className="px-1 ml-0 d-flex justify-content-center text-center"
            >
              <StyledRating
                rating={offering.rating}
                colormap={ratingColormap}
                className={`${styles.rating_cell} ${styles.expanded_ratings}`}
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
                className={styles.rating_cell}
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
                className={styles.rating_cell}
              >
                {offering.workload !== -1
                  ? offering.workload.toFixed(1)
                  : 'N/A'}
              </StyledRating>
            </Col>
          </Row>
        );
        // Course in both column
        if (
          offering.course_code.includes(listing.course_code) &&
          listing.professor_names.length &&
          overlappingProfs(offering.professor) ===
            listing.professor_names.length
        )
          overlapSections.both.push(evalBox);

        // Course in course column
        if (offering.course_code.includes(listing.course_code))
          overlapSections.course.push(evalBox);

        // Course in prof column
        if (overlappingProfs(offering.professor) > 0)
          overlapSections.professor.push(evalBox);
      }
      return overlapSections;
    }
    return undefined;
  }, [data, filter, setSeason, listing, overlappingProfs, profInfo]);
  // Wait until data is fetched
  if (loading || error) return <CourseModalLoading />;
  // Render popover that contains prof info
  const profInfoPopover = (props) => {
    let profName = '';
    let profDict = {};
    // Store dict from prop_info for easy access
    if (props.popper.state) {
      profName = props.popper.state.options.prof;
      profDict = profInfo[profName];
    }
    return (
      <StyledPopover
        {...props}
        id="title_popover"
        className="d-none d-md-block"
      >
        <Popover.Title>
          <Row className="mx-auto">
            {/* Professor Name */}
            <strong>{profName}</strong>
          </Row>
          <Row className="mx-auto">
            {/* Professor Email */}
            <small>
              {profDict.email !== '' ? (
                <a href={`mailto: ${profDict.email}`}>{profDict.email}</a>
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
                    color: profDict.numCourses
                      ? ratingColormap(
                          profDict.totalRating / profDict.numCourses,
                        )
                          .darken()
                          .saturate()
                      : '#b5b5b5',
                  }}
                >
                  {
                    // Get average rating
                    profDict.numCourses
                      ? (profDict.totalRating / profDict.numCourses).toFixed(1)
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
                <strong className="mx-auto">{profDict.numCourses}</strong>
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
  };

  // Options for the evaluation filters
  const options = [
    { displayName: `Course (${items.course.length})`, value: 'course' },
    { displayName: `Both (${items.both.length})`, value: 'both' },
    { displayName: `Prof (${items.professor.length})`, value: 'professor' },
  ];

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
              maxLine={String(lines)}
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
              <span className={`${styles.requirements} pt-1`}>
                {listing.requirements}
              </span>
            </Row>
          )}
          {/* Course Syllabus */}
          <Row className="m-auto pt-4 pb-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={styles.lable_bubble}>Syllabus</span>
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
                  className={styles.toggle_bubble}
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
              <span className={styles.lable_bubble}>Professor</span>
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
                        overlay={profInfoPopover}
                        popperConfig={{ prof }}
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
              <span className={styles.lable_bubble}>Meets</span>
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
              <span className={styles.lable_bubble}>Location</span>
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
              <span className={styles.lable_bubble}>Section</span>
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
                <span className={styles.lable_bubble}>Info</span>
              </Col>
              <Col
                sm={12 - COL_LEN_LEFT}
                xs={11 - COL_LEN_LEFT}
                className={styles.metadata}
              >
                {listing.flag_info.length ? (
                  <ul className={styles.flag_info}>
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
              <span className={styles.lable_bubble}>Enrollment</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={styles.metadata}
            >
              {getEnrolled(listing, true, true)}
            </Col>
          </Row>
          {/* Credits */}
          <Row className="m-auto py-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={styles.lable_bubble}>Credits</span>
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
                <span className={styles.lable_bubble}>Class Notes</span>
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
                <span className={styles.lable_bubble}>Registrar Notes</span>
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
                <span className={styles.lable_bubble}>Reading Period</span>
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
                <span className={styles.lable_bubble}>Final Exam</span>
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
                <span className={styles.lable_bubble}>Friends</span>
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
            className={`${styles.filter_container} m-auto justify-content-center`}
            onKeyDown={(e) => {
              // Left/right arrow key
              const newIndx =
                (optionsIndx[filter] +
                  (e.key === 'ArrowLeft'
                    ? 2
                    : e.key === 'ArrowRight'
                    ? 1
                    : 0)) %
                3;
              setFilter(options[newIndx].value);
            }}
            tabIndex={0}
          >
            <StyledMultiToggle
              options={options}
              selectedOption={filter}
              onSelectOption={(val) => setFilter(val)}
              className={`${styles.evaluations_filter} mb-2`}
            />
          </Row>
          {/* Course Evaluations Header */}
          {items[filter].length !== 0 && (
            <Row className="m-auto pb-1 justify-content-center">
              <Col xs={5} className="d-flex justify-content-center px-0 mr-3">
                <span className={styles.evaluation_header}>Season</span>
              </Col>
              <Col xs={2} className="d-flex ml-0 justify-content-center px-0">
                <span className={styles.evaluation_header}>Class</span>
              </Col>
              <Col xs={2} className="d-flex ml-0 justify-content-center px-0">
                <span className={styles.evaluation_header}>Prof</span>
              </Col>
              <Col xs={2} className="d-flex ml-0 justify-content-center px-0">
                <span className={styles.evaluation_header}>Work</span>
              </Col>
            </Row>
          )}
          {/* Course Evaluations */}
          {items[filter].length !== 0 && items[filter]}
          {/* No Course Evaluations */}
          {items[filter].length === 0 && (
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
