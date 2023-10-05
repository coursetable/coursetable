import React, { useMemo, useState, useCallback } from 'react';
import {
  Row,
  Col,
  Modal,
  OverlayTrigger,
  Popover,
  Collapse,
} from 'react-bootstrap';
import '../Search/MultiToggle.css';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { IoIosArrowDown } from 'react-icons/io';
import { HiExternalLink } from 'react-icons/hi';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import MultiToggle from 'react-multi-toggle';
import styled from 'styled-components';
import { useUser } from '../../contexts/userContext';
import {
  TextComponent,
  StyledPopover,
  StyledRating,
  StyledLink,
} from '../StyledComponents';
import { ratingColormap, workloadColormap } from '../../queries/Constants';
import Styles from './CourseModalOverview.module.css';

import CourseModalLoading from './CourseModalLoading';
import {
  fbFriendsAlsoTaking,
  getEnrolled,
  toSeasonString,
} from '../../utilities/courseUtilities';
import { useSameCourseOrProfOfferingsQuery } from '../../generated/graphql';
import { weekdays } from '../../utilities/common';

// Button with season and other info that user selects to view evals
const StyledCol = styled(Col)`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgb(190, 221, 255)' : theme.select_hover};
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

const CourseModalOverview = ({ setFilter, filter, setSeason, listing }) => {
  // Fetch user context data
  const { user } = useUser();
  // Component used for cutting off long descriptions
  const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
  // Is description clamped?
  const [clamped, setClamped] = useState(false);
  // Number of description lines to display
  const [lines, setLines] = useState(8);
  // List of other friends shopping this class
  const also_taking =
    user.fbLogin && user.fbWorksheets
      ? fbFriendsAlsoTaking(
          listing.season_code,
          listing.crn,
          user.fbWorksheets.worksheets,
          user.fbWorksheets.friendInfo,
        )
      : [];

  // Update description clamped state
  const handleReflow = (rleState) => {
    const { clamped } = rleState;
    setClamped(clamped);
  };

  // Set the evaluation to view and change to evaluation view
  const handleSetSeason = useCallback(
    (evaluation) => {
      // Temp dictionary that stores listing info
      const temp = { ...evaluation };
      temp.course_code = temp.course_code[0];
      setSeason(temp);
    },
    [setSeason],
  );

  // Sort course evaluations by season code and section
  const sortEvals = (a, b) => {
    if (a.season_code > b.season_code) return -1;
    if (a.season_code < b.season_code) return 1;
    if (parseInt(a.section, 10) < parseInt(b.section, 10)) return -1;
    return 1;
  };

  // Parse for location url and location name
  let location_url = '';
  for (const i in weekdays) {
    const day = weekdays[i];
    if (listing.times_by_day && listing.times_by_day[day]) {
      location_url = listing.times_by_day[day][0][3];
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
  const prof_info = useMemo(() => {
    const prof_info_temp = {};
    listing.professor_names.forEach((prof) => {
      prof_info_temp[prof] = {
        num_courses: 0,
        total_rating: 0,
        email: '',
      };
    });
    return prof_info_temp;
  }, [listing.professor_names]);
  // Count number of profs that overlap between this listing and an eval
  const overlapping_profs = useCallback(
    (eval_profs) => {
      let cnt = 0;
      listing.professor_names.forEach((prof) => {
        // Eval course contains this prof
        if (eval_profs.includes(prof)) cnt++;
      });
      return cnt;
    },
    [listing.professor_names],
  );
  // Get past syllabi links
  const past_syllabi = useMemo(() => {
    if (data) {
      return data.computed_listing_info
        .filter(
          (course) =>
            course.same_course_id === listing.same_course_id &&
            course.syllabus_url,
        )
        .map((course) => ({
          season_code: course.season_code,
          syllabus_url: course.syllabus_url,
          section: course.section,
        }))
        .filter(
          // remove duplicates by syllabus URL
          (v, i, a) =>
            a.findIndex((t) => t.syllabus_url === v.syllabus_url) === i,
        )
        .sort((a, b) => {
          if (a.season_code > b.season_code) return -1;
          if (b.season_code < a.season_code) return 1;
          return parseInt(a.section, 10) > parseInt(b.section, 10) ? 1 : -1;
        });
    }
    return [];
  }, [data, listing.same_course_id]);

  const [showPastSyllabi, setShowPastSyllabi] = useState(
    past_syllabi && past_syllabi.length < 8,
  );

  // Make sure data is loaded
  const items = useMemo(() => {
    if (data) {
      // Hold list of evaluation dictionaries
      const course_offerings = [];
      // Loop by season code
      data.computed_listing_info.forEach((season) => {
        // Stores the average rating for all profs teaching this course and populates prof_info
        let average_professor_rating = 0;
        if (season.professor_info) {
          const num_profs = season.professor_info.length;
          season.professor_info.forEach((prof) => {
            if (prof.average_rating) {
              // Add up all prof ratings
              average_professor_rating += prof.average_rating;
              // Update prof_info
              if (prof.name in prof_info) {
                // Store dict from prof_info for easy access
                const dict = prof_info[prof.name];
                // Total number of courses this professor teaches
                dict.num_courses++;
                // Total rating. Will divide by number of courses later to get average
                dict.total_rating += prof.average_rating;
                // Prof email
                dict.email = prof.email;
              }
            }
          });
          // Divide by number of profs to get average
          average_professor_rating /= num_profs;
        }
        course_offerings.push({
          // Course rating
          rating: season.course.evaluation_statistic
            ? season.course.evaluation_statistic.avg_rating || -1
            : -1,
          // Workload rating
          workload: season.course.evaluation_statistic
            ? season.course.evaluation_statistic.avg_workload || -1
            : -1,
          // Professor rating
          professor_rating: average_professor_rating || -1,
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
      course_offerings.sort(sortEvals);
      // Hold eval html for each column
      const overlap_sections = { both: [], course: [], professor: [] };

      // Variable used for list keys
      let id = 0;

      // Loop through each listing with evals
      for (let i = 0; i < course_offerings.length; i++) {
        // Skip listings in the current and future seasons that have no evals
        if (['202303', '202401'].includes(course_offerings[i].season_code))
          continue;
        const hasEvals = course_offerings[i].rating !== -1;
        const eval_box = (
          <Row key={id++} className="m-auto py-1 justify-content-center">
            {/* The listing button, either clickable or greyed out based on whether evaluations exist */}
            {hasEvals ? (
              <StyledCol
                xs={5}
                className={`${Styles.rating_bubble}  px-0 mr-3 text-center`}
                onClick={() => handleSetSeason(course_offerings[i])}
                style={{ flex: 'none' }}
              >
                <strong>
                  {toSeasonString(course_offerings[i].season_code)[0]}
                </strong>
                <div className={`${Styles.details} mx-auto ${Styles.shown}`}>
                  {filter === 'professor'
                    ? course_offerings[i].course_code[0]
                    : filter === 'both'
                    ? `Section ${course_offerings[i].section}`
                    : course_offerings[i].professor[0]}
                </div>
              </StyledCol>
            ) : (
              <StyledColUnclickable
                xs={5}
                className={`${Styles.rating_bubble_unclickable}  px-0 mr-3 text-center`}
                style={{ flex: 'none', color: '#b5b5b5' }}
              >
                <strong>
                  {toSeasonString(course_offerings[i].season_code)[0]}
                </strong>
                <div className={`${Styles.details} mx-auto ${Styles.shown}`}>
                  {filter === 'professor'
                    ? course_offerings[i].course_code[0]
                    : filter === 'both'
                    ? `Section ${course_offerings[i].section}`
                    : course_offerings[i].professor[0]}
                </div>
              </StyledColUnclickable>
            )}
            {/* Course Rating */}
            <Col
              xs={2}
              className="px-1 ml-0 d-flex justify-content-center text-center"
            >
              <StyledRating
                rating={course_offerings[i].rating}
                colormap={ratingColormap}
                className={`${Styles.rating_cell} ${Styles.expanded_ratings}`}
              >
                {course_offerings[i].rating !== -1
                  ? course_offerings[i].rating.toFixed(1)
                  : 'N/A'}
              </StyledRating>
            </Col>
            {/* Professor Rating */}
            <Col
              xs={2}
              className="px-1 ml-0 d-flex justify-content-center text-center"
            >
              <StyledRating
                rating={course_offerings[i].professor_rating}
                colormap={ratingColormap}
                className={Styles.rating_cell}
              >
                {course_offerings[i].professor_rating !== -1
                  ? course_offerings[i].professor_rating.toFixed(1)
                  : 'N/A'}
              </StyledRating>
            </Col>
            {/* Workload Rating */}
            <Col
              xs={2}
              className="px-1 ml-0 d-flex justify-content-center text-center"
            >
              <StyledRating
                rating={course_offerings[i].workload}
                colormap={workloadColormap}
                className={Styles.rating_cell}
              >
                {course_offerings[i].workload !== -1
                  ? course_offerings[i].workload.toFixed(1)
                  : 'N/A'}
              </StyledRating>
            </Col>
          </Row>
        );
        // Course in both column
        if (
          course_offerings[i].course_code.includes(listing.course_code) &&
          listing.professor_names.length &&
          overlapping_profs(course_offerings[i].professor) ===
            listing.professor_names.length
        ) {
          overlap_sections.both.push(eval_box);
        }
        // Course in course column
        if (course_offerings[i].course_code.includes(listing.course_code)) {
          overlap_sections.course.push(eval_box);
        }
        // Course in prof column
        if (overlapping_profs(course_offerings[i].professor) > 0) {
          overlap_sections.professor.push(eval_box);
        }
      }
      return overlap_sections;
    }
    return undefined;
  }, [data, filter, handleSetSeason, listing, overlapping_profs, prof_info]);
  // Wait until data is fetched
  if (loading || error) return <CourseModalLoading />;
  // Render popover that contains prof info
  const renderProfInfoPopover = (props) => {
    let prof_name = '';
    let prof_dict = {};
    // Store dict from prop_info for easy access
    if (props.popper.state) {
      prof_name = props.popper.state.options.prof_name;
      prof_dict = prof_info[prof_name];
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
            <strong>{prof_name}</strong>
          </Row>
          <Row className="mx-auto">
            {/* Professor Email */}
            <small>
              {prof_dict.email !== '' ? (
                <a href={`mailto: ${prof_dict.email}`}>{prof_dict.email}</a>
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
                    color: prof_dict.num_courses
                      ? ratingColormap(
                          prof_dict.total_rating / prof_dict.num_courses,
                        )
                          .darken()
                          .saturate()
                      : '#b5b5b5',
                  }}
                >
                  {
                    // Get average rating
                    prof_dict.num_courses
                      ? (
                          prof_dict.total_rating / prof_dict.num_courses
                        ).toFixed(1)
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
                <strong className="mx-auto">{prof_dict.num_courses}</strong>
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
  const options_indx = {
    course: 0,
    both: 1,
    professor: 2,
  };

  // Switch filter if left or right arrow key is pressed
  const handleKeyDown = (e) => {
    if (e.keyCode === 37) {
      // Left arrow key
      const new_indx = (options_indx[filter] + 2) % 3;
      setFilter(options[new_indx].value);
    } else if (e.keyCode === 39) {
      // Right arrow key
      const new_indx = (options_indx[filter] + 1) % 3;
      setFilter(options[new_indx].value);
    }
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
              maxLine={`${lines}`}
              basedOn="words"
              onReflow={handleReflow}
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
              <span className={`${Styles.requirements} pt-1`}>
                {listing.requirements}
              </span>
            </Row>
          )}
          {/* Course Syllabus */}
          <Row className="m-auto pt-4 pb-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={Styles.lable_bubble}>Syllabus</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={Styles.metadata}
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
          {past_syllabi.length > 0 && (
            <Row className="m-auto pt-4 pb-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span
                  role="button"
                  className={Styles.toggle_bubble}
                  onClick={() => setShowPastSyllabi(!showPastSyllabi)}
                >
                  Past syllabi ({past_syllabi.length}){' '}
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
                  className={Styles.metadata}
                >
                  {past_syllabi.map((course) => (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={course.syllabus_url}
                      className="d-flex"
                    >
                      {toSeasonString(course.season_code)[0]} (section{' '}
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
              <span className={Styles.lable_bubble}>Professor</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={Styles.metadata}
            >
              {listing.professor_names.length
                ? listing.professor_names.map((prof, index) => {
                    return (
                      <React.Fragment key={prof}>
                        {index ? ' • ' : ''}
                        <OverlayTrigger
                          trigger="click"
                          rootClose
                          placement="right"
                          overlay={renderProfInfoPopover}
                          popperConfig={{ prof_name: prof }}
                        >
                          <StyledLink>{prof}</StyledLink>
                        </OverlayTrigger>
                      </React.Fragment>
                    );
                  })
                : 'N/A'}
            </Col>
          </Row>
          {/* Course Times */}
          <Row className="m-auto py-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={Styles.lable_bubble}>Meets</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={Styles.metadata}
            >
              {listing.times_summary}
            </Col>
          </Row>
          {/* Course Location */}
          <Row className="m-auto py-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={Styles.lable_bubble}>Location</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={Styles.metadata}
            >
              {location_url !== '' ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={location_url}
                  className="d-flex"
                >
                  {listing.locations_summary}
                  <HiExternalLink size={18} className="ml-1 my-auto" />
                </a>
              ) : (
                listing.locations_summary
              )}
            </Col>
          </Row>
          {/* Course Section */}
          <Row className="m-auto py-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={Styles.lable_bubble}>Section</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={Styles.metadata}
            >
              {listing.section ? listing.section : 'N/A'}
            </Col>
          </Row>
          {/* Course Information (flag_info) */}
          {listing.flag_info.length > 0 && (
            <Row className="m-auto py-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span className={Styles.lable_bubble}>Info</span>
              </Col>
              <Col
                sm={12 - COL_LEN_LEFT}
                xs={11 - COL_LEN_LEFT}
                className={Styles.metadata}
              >
                {listing.flag_info.length ? (
                  <ul className={Styles.flag_info}>
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
              <span className={Styles.lable_bubble}>Enrollment</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={Styles.metadata}
            >
              {getEnrolled(listing, true, true)}
            </Col>
          </Row>
          {/* Credits */}
          <Row className="m-auto py-2">
            <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
              <span className={Styles.lable_bubble}>Credits</span>
            </Col>
            <Col
              sm={12 - COL_LEN_LEFT}
              xs={11 - COL_LEN_LEFT}
              className={Styles.metadata}
            >
              {listing.credits}
            </Col>
          </Row>
          {/* Class Notes (classnotes) */}
          {listing.classnotes && (
            <Row className="m-auto py-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span className={Styles.lable_bubble}>Class Notes</span>
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
                <span className={Styles.lable_bubble}>Registrar Notes</span>
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
                <span className={Styles.lable_bubble}>Reading Period</span>
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
                <span className={Styles.lable_bubble}>Final Exam</span>
              </Col>
              <Col sm={12 - COL_LEN_LEFT} xs={11 - COL_LEN_LEFT}>
                {listing.final_exam}
              </Col>
            </Row>
          )}
          {/* FB Friends that are also shopping this course */}
          {also_taking.length > 0 && (
            <Row className="m-auto py-2">
              <Col sm={COL_LEN_LEFT} xs={COL_LEN_LEFT + 1} className="px-0">
                <span className={Styles.lable_bubble}>FB Friends</span>
              </Col>
              <Col
                sm={12 - COL_LEN_LEFT}
                xs={11 - COL_LEN_LEFT}
                className={Styles.metadata}
              >
                {also_taking.map((friend, index) => {
                  return (
                    <Row className="m-auto" key={index}>
                      {friend + (index === also_taking.length - 1 ? '' : ',')}
                    </Row>
                  );
                })}
              </Col>
            </Row>
          )}
        </Col>
        {/* Course Evaluations */}
        <Col md={5} className="px-0 my-0">
          {/* Filter Select */}
          <Row
            className={`${Styles.filter_container} m-auto justify-content-center`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <StyledMultiToggle
              options={options}
              selectedOption={filter}
              onSelectOption={(val) => setFilter(val)}
              className={`${Styles.evaluations_filter} mb-2`}
            />
          </Row>
          {/* Course Evaluations Header */}
          {items[filter].length !== 0 && (
            <Row className="m-auto pb-1 justify-content-center">
              <Col xs={5} className="d-flex justify-content-center px-0 mr-3">
                <span className={Styles.evaluation_header}>Season</span>
              </Col>
              <Col xs={2} className="d-flex ml-0 justify-content-center px-0">
                <span className={Styles.evaluation_header}>Class</span>
              </Col>
              <Col xs={2} className="d-flex ml-0 justify-content-center px-0">
                <span className={Styles.evaluation_header}>Prof</span>
              </Col>
              <Col xs={2} className="d-flex ml-0 justify-content-center px-0">
                <span className={Styles.evaluation_header}>Work</span>
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
};

export default CourseModalOverview;
