import React, { useState } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
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

const CourseModalOverview = (props) => {
  const { user } = useUser();
  const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
  const [clamped, setClamped] = useState(false);
  const [lines, setLines] = useState(10);
  const listing = props.listing;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const options = [
    { displayName: 'Course', value: 'course' },
    { displayName: 'Both', value: 'both' },
    { displayName: 'Professor', value: 'professor' },
  ];
  const filter = props.filter;
  const [enlarged, setEnlarged] = useState(['', -1]);
  let enrollment = -1;
  let also_taking = fbFriendsAlsoTaking(
    listing.season_code,
    listing.crn,
    user.fbWorksheets.worksheets,
    user.fbWorksheets.friendInfo
  );

  const handleReflow = (rleState) => {
    const { clamped } = rleState;
    setClamped(clamped);
  };

  const setSeason = (evaluation) => {
    let temp = { ...evaluation };
    if (filter === 'professor') {
      temp.professor = listing.professors;
      temp.course_code = evaluation.course_code[0];
    } else if (filter === 'course') {
      temp.course_code = listing.course_code;
      temp.professor = evaluation.professor[0];
    } else {
      temp.course_code = listing.course_code;
      temp.professor = listing.professors;
    }
    props.setSeason(temp);
  };

  const setFilter = (val) => {
    props.setFilter(val);
  };

  const sortEvals = (a, b) => {
    if (a.season_code > b.season_code) return -1;
    if (a.season_code < b.season_code) return 1;
    if (parseInt(a.section) < parseInt(b.section)) return -1;
    return 1;
  };

  let location_url = '',
    location_name = 'TBD';
  for (let i in days) {
    const day = days[i];
    if (listing[`course.times_by_day.${day}`]) {
      location_url = listing[`course.times_by_day.${day}`][0][3];
      location_name = listing[`course.times_by_day.${day}`][0][2];
    }
    if (listing[`times_by_day.${day}`]) {
      location_url = listing[`times_by_day.${day}`][0][3];
      location_name = listing[`times_by_day.${day}`][0][2];
    }
  }

  const { loading, error, data } = useQuery(SEARCH_AVERAGE_ACROSS_SEASONS, {
    variables: {
      course_code: listing.course_code ? listing.course_code : 'bruh',
      professor_name: listing.professors ? listing.professors : 'bruh',
    },
  });
  if (loading || error) return <CourseModalLoading />;

  let evaluations = [];
  let items = [];

  if (data) {
    data.computed_course_info.forEach((season) => {
      if (!season.course.evaluation_statistics[0]) return;
      evaluations.push({
        rating:
          season.course.evaluation_statistics[0].avg_rating != null
            ? season.course.evaluation_statistics[0].avg_rating
            : -1,
        workload:
          season.course.evaluation_statistics[0].avg_workload != null
            ? season.course.evaluation_statistics[0].avg_workload
            : -1,
        professor_rating:
          season.course.course_professors[0] &&
          season.course.course_professors[0].professor.average_rating != null
            ? season.course.course_professors[0].professor.average_rating
            : -1,
        enrollment:
          season.course.evaluation_statistics[0].enrollment != null
            ? season.course.evaluation_statistics[0].enrollment.enrolled
            : -1,
        season_code: season.season_code,
        professor: season.professor_names.length
          ? season.professor_names
          : ['TBA'],
        course_code: season.course_codes.length ? season.course_codes : ['TBA'],
        crn: season.course.listings[0].crn,
        section: season.course.listings[0].section,
      });
    });
    evaluations.sort(sortEvals);

    let id = 0;
    for (let i = 0; i < evaluations.length; i++) {
      if (
        enrollment === -1 &&
        evaluations[i].course_code.includes(listing.course_code) &&
        evaluations[i].section === listing.section
      ) {
        enrollment = evaluations[i].enrollment;
      }

      if (evaluations[i].rating === -1 && evaluations[i].workload === -1)
        continue;

      if (filter === 'both') {
        if (
          evaluations[i].course_code.includes(listing.course_code) &&
          !evaluations[i].professor.includes(listing.professors)
        )
          continue;
        if (!evaluations[i].course_code.includes(listing.course_code)) continue;
      }

      if (filter === 'course') {
        if (
          evaluations[i].course_code.includes(listing.course_code) &&
          evaluations[i].professor.includes(listing.professors)
        )
          continue;
        if (!evaluations[i].course_code.includes(listing.course_code)) continue;
      }

      if (filter === 'professor') {
        if (
          evaluations[i].course_code.includes(listing.course_code) &&
          evaluations[i].professor.includes(listing.professors)
        )
          continue;
        if (!evaluations[i].professor.includes(listing.professors)) continue;
      }

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
          <Col
            xs={5}
            className={Styles.rating_bubble + '  px-0 mr-3 text-center'}
            onClick={() => setSeason(evaluations[i])}
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
                    // .darken(2)
                    // .css(),
                    // backgroundColor: chroma(
                    //   ratingColormap(evaluations[i].rating)
                    // )
                    //   .alpha(0.33)
                    //   .css(),
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
                    // .darken(2)
                    // .css(),
                    // backgroundColor: chroma(
                    //   ratingColormap(evaluations[i].professor_rating)
                    // )
                    //   .alpha(0.33)
                    //   .css(),
                  }
                }
                className={Styles.rating_cell}
              >
                {evaluations[i].professor_rating.toFixed(1)}
              </div>
            )}
          </Col>
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
                    // .darken(2)
                    // .css(),
                    // backgroundColor: chroma(
                    //   workloadColormap(evaluations[i].workload)
                    // )
                    //   .alpha(0.33)
                    //   .css(),
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

  if (!listing['course.description'])
    listing['course.description'] = listing.description;
  if (!listing['course.requirements'])
    listing['course.requirements'] = listing.requirements;
  if (!listing['course.times_summary'])
    listing['course.times_summary'] = listing.times_summary;
  if (!listing['professors'])
    listing['professors'] = listing.professor_names.join(', ');
  if (!listing['course.syllabus_url'])
    listing['course.syllabus_url'] = listing.syllabus_url;

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={7} className="px-0 mt-0 mb-3">
          {/* COURSE DESCRIPTION */}
          <Row className="m-auto pb-3">
            <ResponsiveEllipsis
              style={{ whiteSpace: 'pre-wrap' }}
              text={listing['course.description']}
              maxLine={`${lines}`}
              basedOn="words"
              onReflow={handleReflow}
            />
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
            {listing['course.requirements'] && (
              <Row className="m-auto pt-1">
                <span className={Styles.requirements}>
                  {listing['course.requirements']}
                </span>
              </Row>
            )}
          </Row>
          {listing['professors'] && (
            <Row className="m-auto py-2">
              <Col sm={3} xs={4} className="px-0">
                <span className={Styles.lable_bubble}>Professor</span>
              </Col>
              <Col sm={9} xs={8} className={Styles.metadata}>
                {listing.professors}
              </Col>
            </Row>
          )}
          {listing['course.times_summary'] !== 'TBA' && (
            <Row className="m-auto py-2">
              <Col sm={3} xs={4} className="px-0">
                <span className={Styles.lable_bubble}>Meets</span>
              </Col>
              <Col sm={9} xs={8} className={Styles.metadata}>
                {listing['course.times_summary']}
              </Col>
            </Row>
          )}
          {listing['section'] && (
            <Row className="m-auto py-2">
              <Col sm={3} xs={4} className="px-0">
                <span className={Styles.lable_bubble}>Section</span>
              </Col>
              <Col sm={9} xs={8} className={Styles.metadata}>
                {listing.section}
              </Col>
            </Row>
          )}
          {listing['course.evaluation_statistics'] &&
          listing['course.evaluation_statistics'][0] &&
          listing['course.evaluation_statistics'][0].enrollment ? (
            <Row className="m-auto py-2">
              <Col sm={3} xs={4} className="px-0">
                <span className={Styles.lable_bubble}>Enrollment</span>
              </Col>
              <Col sm={9} xs={8} className={Styles.metadata}>
                {listing.enrollment}
              </Col>
            </Row>
          ) : enrollment === -1 ? (
            <div />
          ) : (
            <Row className="m-auto py-2">
              <Col sm={3} xs={4} className="px-0">
                <span className={Styles.lable_bubble}>Enrollment</span>
              </Col>
              <Col sm={9} xs={8} className={Styles.metadata}>
                {'~' + enrollment}
              </Col>
            </Row>
          )}
          {location_url !== '' && (
            <Row className="m-auto py-2">
              <Col sm={3} xs={4} className="px-0">
                <span className={Styles.lable_bubble}>Location</span>
              </Col>
              <Col sm={9} xs={8} className={Styles.metadata}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={location_url}
                >
                  {location_name}
                </a>
              </Col>
            </Row>
          )}
          {listing['course.syllabus_url'] && (
            <Row className="m-auto py-2">
              <Col sm={3} xs={4} className="px-0">
                <span className={Styles.lable_bubble}>Syllabus</span>
              </Col>
              <Col sm={9} xs={8} className={Styles.metadata}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={listing['course.syllabus_url']}
                >
                  {listing['course_code']}
                </a>
              </Col>
            </Row>
          )}
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
        <Col md={5} className="px-0 my-0">
          {/* <Row className="m-auto justify-content-center">
                <strong>Evaluations</strong>
              </Row> */}
          <Row className="m-auto justify-content-center">
            <MultiToggle
              options={options}
              selectedOption={filter}
              onSelectOption={(val) => setFilter(val)}
              className={Styles.evaluations_filter + ' mb-2'}
            />
          </Row>
          {items.length !== 0 && (
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
          {items.length !== 0 && items}

          {items.length === 0 && (
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
