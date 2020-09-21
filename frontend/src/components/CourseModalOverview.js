import React, { useState } from 'react';
import { Row, Col, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import MultiToggle from 'react-multi-toggle';
import { SEARCH_AVERAGE_ACROSS_SEASONS } from '../queries/QueryStrings';
import { useQuery } from '@apollo/react-hooks';
import Styles from './CourseModalOverview.module.css';
import { ratingColormap, workloadColormap } from '../queries/Constants.js';
import { toSeasonString, fbFriendsAlsoTaking } from '../utilities';
import './MultiToggle.css';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { IoIosArrowDown } from 'react-icons/io';
import { useUser } from '../user';

import CourseModalLoading from './CourseModalLoading';

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
  // Is the user logged in?
  const isLoggedIn = user.worksheet !== null;
  // Component used for cutting off long descriptions
  const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
  // Is description clamped?
  const [clamped, setClamped] = useState(false);
  // Number of description lines to display
  const [lines, setLines] = useState(8);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  // Options for the evaluation filters
  const options = [
    { displayName: 'Course', value: 'course' },
    { displayName: 'Both', value: 'both' },
    { displayName: 'Professor', value: 'professor' },
  ];
  // Is the season hover box enlarged? CURRENTLY NOT USING
  const [enlarged, setEnlarged] = useState(['', -1]);
  // Variable to store past enrollment data if the course hasn't taken place yet
  let enrollment = -1;
  // List of other friends shopping this class
  let also_taking =
    user.fbLogin && user.fbWorksheets
      ? fbFriendsAlsoTaking(
          listing.season_code,
          listing.crn,
          user.fbWorksheets.worksheets,
          user.fbWorksheets.friendInfo
        )
      : [];

  // Update description clamped state
  const handleReflow = (rleState) => {
    const { clamped } = rleState;
    setClamped(clamped);
  };

  // Set the evaluation to view and change to evaluation view
  const handleSetSeason = (evaluation) => {
    // Temp dictionary that stores listing info
    let temp = { ...evaluation };
    // Use first course code if filter is professor
    if (filter === 'professor') {
      temp.professor = listing.professors;
      temp.course_code = evaluation.course_code[0];
    }
    // Use first professor if filter is course
    else if (filter === 'course') {
      temp.course_code = listing.course_code;
      temp.professor = evaluation.professor[0];
    }
    // Use normal course code and professors list if filter is both
    else {
      temp.course_code = listing.course_code;
      temp.professor = listing.professors;
    }
    setSeason(temp);
  };

  // Sort course evaluations by season code and section
  const sortEvals = (a, b) => {
    if (a.season_code > b.season_code) return -1;
    if (a.season_code < b.season_code) return 1;
    if (parseInt(a.section) < parseInt(b.section)) return -1;
    return 1;
  };

  // Parse for location url and location name
  let location_url = '',
    location_name = 'TBD';
  for (let i in days) {
    const day = days[i];
    if (listing[`times_by_day.${day}`]) {
      location_url = listing[`times_by_day.${day}`][0][3];
      location_name = listing[`times_by_day.${day}`][0][2];
    }
  }

  // Fetch ratings data for this listing
  const { loading, error, data } = useQuery(SEARCH_AVERAGE_ACROSS_SEASONS, {
    variables: {
      course_code: listing.course_code ? listing.course_code : 'bruh',
      professor_name: listing.professors ? listing.professors : 'bruh',
    },
  });
  // Wait until data is fetched
  if (loading || error) return <CourseModalLoading />;
  // Hold list of evaluation dictionaries
  let evaluations = [];
  // Hold HTML code that displays the list of evaluations
  let items = [];
  // Holds Prof information for popover
  let prof_info = {};
  listing.professor_names.forEach((prof) => {
    prof_info[prof] = {
      num_courses: 0,
      total_rating: 0,
      rating_first: 0,
      rating_last: 0,
      season_first: '999999',
      season_last: '000000',
    };
  });
  // Make sure data is loaded
  if (data) {
    // Loop by season code
    data.computed_course_info.forEach((season) => {
      if (!season.course.evaluation_statistics[0]) return;
      // Stores the average rating for all profs teaching this course and populates prof_info
      let average_professor_rating = 0;
      if (season.course.course_professors) {
        const num_profs = season.course.course_professors.length;
        season.course.course_professors.forEach((prof) => {
          if (prof.professor.average_rating) {
            // Add up all prof ratings
            average_professor_rating += prof.professor.average_rating;
            // Update prof_info
            if (prof.professor.name in prof_info) {
              // Store dict from prof_info for easy access
              const dict = prof_info[prof.professor.name];
              // Total number of courses this professor teaches
              dict.num_courses++;
              // Total rating. Will divide by number of courses later to get average
              dict.total_rating += prof.professor.average_rating;
              // Update earliest rating
              if (season.season_code < dict.season_first) {
                dict.rating_first = prof.professor.average_rating;
                dict.season_first = season.season_code;
              }
              // Update most recent rating
              if (season.season_code > dict.season_last) {
                dict.rating_last = prof.professor.average_rating;
                dict.season_last = season.season_code;
              }
            }
          }
        });
        // Divide by number of profs to get average
        average_professor_rating /= num_profs;
      }
      evaluations.push({
        // Course rating
        rating:
          season.course.evaluation_statistics[0].avg_rating != null
            ? season.course.evaluation_statistics[0].avg_rating
            : -1,
        // Workload rating
        workload:
          season.course.evaluation_statistics[0].avg_workload != null
            ? season.course.evaluation_statistics[0].avg_workload
            : -1,
        // Professor rating
        professor_rating: average_professor_rating
          ? average_professor_rating
          : -1,
        // Enrollment data
        enrollment:
          season.course.evaluation_statistics[0].enrollment != null
            ? season.course.evaluation_statistics[0].enrollment.enrolled
            : -1,
        // Season code
        season_code: season.season_code,
        // Professors
        professor: season.professor_names.length
          ? season.professor_names
          : ['TBA'],
        // Course code
        course_code: season.course_codes.length ? season.course_codes : ['TBA'],
        // Crn
        crn: season.course.listings[0].crn,
        // Section number
        section: season.course.listings[0].section,
      });
    });
    // Sort by season code and section
    evaluations.sort(sortEvals);

    // Variable used for list keys
    let id = 0;
    // Loop through each listing with evals
    for (let i = 0; i < evaluations.length; i++) {
      // Store past enrollment data if same course and same section
      if (
        enrollment === -1 &&
        evaluations[i].course_code.includes(listing.course_code) &&
        evaluations[i].section === listing.section
      ) {
        enrollment = evaluations[i].enrollment;
      }

      // Skip listings that have no ratings (therefore prolly don't have comments and graphs)
      if (evaluations[i].rating === -1 && evaluations[i].workload === -1)
        continue;

      // Only show courses that have same course code and same prof
      if (filter === 'both') {
        if (
          evaluations[i].course_code.includes(listing.course_code) &&
          !evaluations[i].professor.includes(listing.professors)
        )
          continue;
        if (!evaluations[i].course_code.includes(listing.course_code)) continue;
      }

      // Only show courses that have same course code but different prof
      if (filter === 'course') {
        if (
          evaluations[i].course_code.includes(listing.course_code) &&
          evaluations[i].professor.includes(listing.professors)
        )
          continue;
        if (!evaluations[i].course_code.includes(listing.course_code)) continue;
      }

      // Only show courses that have same prof but different course code
      if (filter === 'professor') {
        if (
          evaluations[i].course_code.includes(listing.course_code) &&
          evaluations[i].professor.includes(listing.professors)
        )
          continue;
        if (!evaluations[i].professor.includes(listing.professors)) continue;
      }

      // Is course eval button expanded? CURRENTLY NOT USING
      let expanded =
        enlarged[0] === evaluations[i].season_code &&
        enlarged[1] === evaluations[i].crn;

      // HAVE RATING BUBBLE ANIMATION
      // var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
      // if (isTouch) expanded = true;

      // NO RATING BUBBLE ANIMATION
      expanded = true;

      items.push(
        <Row key={id++} className="m-auto py-1 justify-content-center">
          {/* Clickable listing button */}
          <Col
            xs={5}
            className={Styles.rating_bubble + '  px-0 mr-3 text-center'}
            onClick={() => handleSetSeason(evaluations[i])}
            onMouseEnter={() =>
              setEnlarged([evaluations[i].season_code, evaluations[i].crn])
            }
            onMouseLeave={() => setEnlarged(['', -1])}
            style={{ flex: 'none' }}
          >
            <strong>{toSeasonString(evaluations[i].season_code)[0]}</strong>
            <div
              className={
                Styles.details +
                ' mx-auto ' +
                (expanded ? Styles.shown : Styles.hidden)
              }
            >
              {filter === 'professor'
                ? evaluations[i].course_code[0]
                : filter === 'both'
                ? 'Section ' + evaluations[i].section
                : evaluations[i].professor[0]}
            </div>
          </Col>
          {/* Course Rating */}
          <Col
            xs={2}
            className={`px-1 ml-0 d-flex justify-content-center text-center`}
          >
            {evaluations[i].rating !== -1 && (
              <div
                style={
                  evaluations[i].rating && {
                    color: ratingColormap(evaluations[i].rating)
                      .darken()
                      .saturate(),
                  }
                }
                className={`${Styles.rating_cell} ${
                  expanded ? Styles.expanded_ratings : ''
                }`}
              >
                {evaluations[i].rating.toFixed(1)}
              </div>
            )}
          </Col>
          {/* Professor Rating */}
          <Col
            xs={2}
            className={`px-1 ml-0 d-flex justify-content-center text-center`}
          >
            {evaluations[i].professor_rating !== -1 && (
              <div
                style={
                  evaluations[i].professor_rating && {
                    color: ratingColormap(evaluations[i].professor_rating)
                      .darken()
                      .saturate(),
                  }
                }
                className={Styles.rating_cell}
              >
                {evaluations[i].professor_rating.toFixed(1)}
              </div>
            )}
          </Col>
          {/* Workload Rating */}
          <Col
            xs={2}
            className={`px-1 ml-0 d-flex justify-content-center text-center`}
          >
            {evaluations[i].workload !== -1 && (
              <div
                style={
                  evaluations[i].workload && {
                    color: workloadColormap(evaluations[i].workload)
                      .darken()
                      .saturate(),
                  }
                }
                className={Styles.rating_cell}
              >
                {evaluations[i].workload.toFixed(1)}
              </div>
            )}
          </Col>
        </Row>
      );
    }
  }

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
      <Popover {...props} id="title_popover" className="d-none d-md-block">
        <Popover.Title>
          <Row className="mx-auto">
            {/* Professor Name */}
            <strong>{prof_name}</strong>
          </Row>
          <Row className="mx-auto">
            {/* Professor Email */}
            <small>Professor's Email</small>
          </Row>
        </Popover.Title>
        <Popover.Content style={{ width: '400px' }}>
          <Row className="mx-auto my-1">
            <Col md={4}>
              {/* Professor Rating */}
              <Row className="mx-auto">
                <strong
                  className="mx-auto"
                  style={{
                    color: prof_dict.num_courses
                      ? ratingColormap(
                          prof_dict.total_rating / prof_dict.num_courses
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
            <Col md={4}>
              {/* Number of courses taught by this professor */}
              <Row className="mx-auto">
                <strong className="mx-auto">{prof_dict.num_courses}</strong>
              </Row>
              <Row className="mx-auto">
                <small className="mx-auto text-center  font-weight-bold">
                  Classes Taught
                </small>
              </Row>
            </Col>
            <Col md={4}>
              {/* Professor rating change */}
              <Row className="mx-auto">
                <strong
                  className="mx-auto"
                  style={{
                    color: prof_dict.num_courses
                      ? ratingColormap(
                          (
                            5 +
                            prof_dict.rating_last -
                            prof_dict.rating_first
                          ).toFixed(1) / 2
                        )
                          .darken()
                          .saturate()
                      : '#b5b5b5',
                  }}
                >
                  {
                    // Get difference between earliest and latest ratings
                    prof_dict.num_courses
                      ? (
                          prof_dict.rating_last - prof_dict.rating_first
                        ).toFixed(1)
                      : 'N/A'
                  }
                </strong>
              </Row>
              <Row className="mx-auto">
                <small className="mx-auto text-center font-weight-bold">
                  Rating Change
                </small>
              </Row>
            </Col>
          </Row>
        </Popover.Content>
      </Popover>
    );
  };

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={7} className="px-0 mt-0 mb-3">
          {/* Course Description */}
          <Row className="m-auto pb-3">
            <ResponsiveEllipsis
              style={{ whiteSpace: 'pre-wrap' }}
              text={listing.description}
              maxLine={`${lines}`}
              basedOn="words"
              onReflow={handleReflow}
            />
            {/* Read More arrow button */}
            <Row className="m-auto">
              {clamped && (
                <span
                  className={Styles.read_more + ' mx-auto'}
                  onClick={() => {
                    setLines(100);
                  }}
                  title="Read More"
                >
                  <IoIosArrowDown size={20} />
                </span>
              )}
            </Row>
            {/* Course Requirements */}
            {listing.requirements && (
              <Row className="m-auto pt-1">
                <span className={Styles.requirements}>
                  {listing.requirements}
                </span>
              </Row>
            )}
          </Row>
          {/* Course Professors */}
          <Row className="m-auto py-2">
            <Col sm={3} xs={4} className="px-0">
              <span className={Styles.lable_bubble}>Professor</span>
            </Col>
            <Col sm={9} xs={8} className={Styles.metadata}>
              {listing['professor_names'].length
                ? listing['professor_names'].map((prof, index) => {
                    return (
                      <>
                        {index ? ' • ' : ''}
                        <OverlayTrigger
                          trigger="click"
                          rootClose
                          placement="right"
                          overlay={renderProfInfoPopover}
                          popperConfig={{ prof_name: prof }}
                        >
                          <span className={Styles.link}>{prof}</span>
                        </OverlayTrigger>
                      </>
                    );
                  })
                : 'N/A'}
            </Col>
          </Row>
          {/* Course Times */}
          <Row className="m-auto py-2">
            <Col sm={3} xs={4} className="px-0">
              <span className={Styles.lable_bubble}>Meets</span>
            </Col>
            <Col sm={9} xs={8} className={Styles.metadata}>
              {listing.times_summary === 'TBA' ? 'N/A' : listing.times_summary}
            </Col>
          </Row>
          {/* Course Section */}
          <Row className="m-auto py-2">
            <Col sm={3} xs={4} className="px-0">
              <span className={Styles.lable_bubble}>Section</span>
            </Col>
            <Col sm={9} xs={8} className={Styles.metadata}>
              {listing.section ? listing.section : 'N/A'}
            </Col>
          </Row>
          {/* Course Enrollment */}
          <Row className="m-auto py-2">
            <Col sm={3} xs={4} className="px-0">
              <span className={Styles.lable_bubble}>Enrollment</span>
            </Col>
            <Col sm={9} xs={8} className={Styles.metadata}>
              {listing['enrollment.enrolled']
                ? listing['enrollment.enrolled']
                : enrollment === -1
                ? 'N/A'
                : '~' + enrollment}
            </Col>
          </Row>
          {/* Course Location */}
          <Row className="m-auto py-2">
            <Col sm={3} xs={4} className="px-0">
              <span className={Styles.lable_bubble}>Location</span>
            </Col>
            <Col sm={9} xs={8} className={Styles.metadata}>
              {location_url !== '' ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={location_url}
                >
                  {location_name}
                </a>
              ) : location_name === 'TBD' || location_name === '' ? (
                'N/A'
              ) : (
                location_name
              )}
            </Col>
          </Row>
          {/* Course Syllabus */}
          <Row className="m-auto py-2">
            <Col sm={3} xs={4} className="px-0">
              <span className={Styles.lable_bubble}>Syllabus</span>
            </Col>
            <Col sm={9} xs={8} className={Styles.metadata}>
              {listing.syllabus_url ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={listing.syllabus_url}
                >
                  {listing['course_code']}
                </a>
              ) : (
                'N/A'
              )}
            </Col>
          </Row>
          {/* FB Friends that are also shopping this course */}
          {also_taking.length > 0 && (
            <Row className="m-auto py-2">
              <Col sm={3} xs={4} className="px-0">
                <span className={Styles.lable_bubble}>FB Friends</span>
              </Col>
              <Col sm={9} xs={8} className={Styles.metadata}>
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
          <Row className="m-auto justify-content-center">
            <MultiToggle
              options={options}
              selectedOption={filter}
              onSelectOption={(val) => setFilter(val)}
              className={Styles.evaluations_filter + ' mb-2'}
            />
          </Row>
          {/* Course Evaluations Header */}
          {items.length !== 0 && isLoggedIn && (
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
          {/* Course Evaluations (if logged in)*/}
          {items.length !== 0 && isLoggedIn && items}
          {/* No Course Evaluations */}
          {items.length === 0 && isLoggedIn && (
            <Row className="m-auto justify-content-center">
              <strong>No Results</strong>
            </Row>
          )}
          {/* User isn't logged in */}
          {!isLoggedIn && (
            <Row className="m-auto justify-content-center">
              <strong style={{ color: 'rgb(252, 105, 105)' }}>
                Please sign in to view evaluations
              </strong>
            </Row>
          )}
        </Col>
      </Row>
    </Modal.Body>
  );
};

export default CourseModalOverview;
