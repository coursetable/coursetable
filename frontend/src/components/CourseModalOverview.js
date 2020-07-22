import React, { useState } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import MultiToggle from 'react-multi-toggle';
import { SEARCH_AVERAGE_ACROSS_SEASONS } from '../queries/QueryStrings';
import { useQuery } from '@apollo/react-hooks';
import styles from './CourseModalOverview.module.css';
import { ratingColormap, workloadColormap } from '../queries/Constants.js';
import { toSeasonString } from '../utilities';
import './MultiToggle.css';

const CourseModalOverview = (props) => {
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
  }

  const { loading, error, data } = useQuery(SEARCH_AVERAGE_ACROSS_SEASONS, {
    variables: {
      course_code: listing.course_code ? listing.course_code : 'bruh',
      professor_name: listing.professors ? listing.professors : 'bruh',
    },
  });
  if (loading || error) return <Modal.Body>Loading...</Modal.Body>;

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

      items.push(
        <Row key={id++} className="m-auto py-1 justify-content-center">
          <Col
            xs={5}
            className={styles.rating_bubble + '  px-0 mr-3'}
            onClick={() => setSeason(evaluations[i])}
            onMouseEnter={() =>
              setEnlarged([evaluations[i].season_code, evaluations[i].crn])
            }
            onMouseLeave={() => setEnlarged(['', -1])}
          >
            <Row className="m-auto justify-content-center">
              <strong>{toSeasonString(evaluations[i].season_code)[0]}</strong>
            </Row>
            <Row
              className={
                (enlarged[0] === evaluations[i].season_code &&
                enlarged[1] === evaluations[i].crn
                  ? styles.shown
                  : styles.hidden) + ' m-auto justify-content-center'
              }
            >
              {filter === 'professor'
                ? evaluations[i].course_code[0]
                : filter === 'both'
                ? 'Section ' + evaluations[i].section
                : evaluations[i].professor[0].length <= 15
                ? evaluations[i].professor[0]
                : evaluations[i].professor[0].substr(0, 12) + '...'}
            </Row>
          </Col>
          <Col
            xs={2}
            style={
              evaluations[i].rating && {
                color: ratingColormap(evaluations[i].rating),
              }
            }
            className="px-0 my-auto ml-0 d-flex justify-content-center"
          >
            <strong>
              {evaluations[i].rating !== -1 && evaluations[i].rating.toFixed(1)}
            </strong>
          </Col>
          <Col
            xs={2}
            style={
              evaluations[i].professor_rating && {
                color: ratingColormap(evaluations[i].professor_rating),
              }
            }
            className="px-0 my-auto ml-0 d-flex justify-content-center"
          >
            <strong>
              {evaluations[i].professor_rating !== -1 &&
                evaluations[i].professor_rating.toFixed(1)}
            </strong>
          </Col>
          <Col
            xs={2}
            style={
              evaluations[i].workload && {
                color: workloadColormap(evaluations[i].workload),
              }
            }
            className="px-0 my-auto ml-0 d-flex justify-content-center"
          >
            <strong>
              {evaluations[i].workload !== -1 &&
                evaluations[i].workload.toFixed(1)}
            </strong>
          </Col>
        </Row>
      );
    }
  }

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col md={6} className="px-0 mt-0 mb-2">
          {/* COURSE DESCRIPTION */}
          <Row className="m-auto pb-3">{listing['course.description']}</Row>
          {listing['professors'] && (
            <Row className="m-auto py-2">
              <Col xs={4} className="px-0">
                <strong className={styles.lable_bubble}>Professor</strong>
              </Col>
              <Col xs={8}>{listing.professors}</Col>
            </Row>
          )}
          {listing['course.times_summary'] !== 'TBA' && (
            <Row className="m-auto py-2">
              <Col xs={4} className="px-0">
                <strong className={styles.lable_bubble}>Meets</strong>
              </Col>
              <Col xs={8}>{listing['course.times_summary']}</Col>
            </Row>
          )}
          {listing['section'] && (
            <Row className="m-auto py-2">
              <Col xs={4} className="px-0">
                <strong className={styles.lable_bubble}>Section</strong>
              </Col>
              <Col xs={8}>{listing.section}</Col>
            </Row>
          )}
          {listing['course.evaluation_statistics'] &&
          listing['course.evaluation_statistics'][0] &&
          listing['course.evaluation_statistics'][0].enrollment ? (
            <Row className="m-auto py-2">
              <Col xs={4} className="px-0">
                <strong className={styles.lable_bubble}>Enrollment</strong>
              </Col>
              <Col xs={8}>
                {listing['course.evaluation_statistics'][0].enrollment.enrolled}
              </Col>
            </Row>
          ) : enrollment === -1 ? (
            <div />
          ) : (
            <Row className="m-auto py-2">
              <Col xs={4} className="px-0">
                <strong className={styles.lable_bubble}>Enrollment</strong>
              </Col>
              <Col xs={8}>{'~' + enrollment}</Col>
            </Row>
          )}
          {location_url !== '' && (
            <Row className="m-auto py-2">
              <Col xs={4} className="px-0">
                <strong className={styles.lable_bubble}>Location</strong>
              </Col>
              <Col xs={8}>
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
              <Col xs={4} className="px-0">
                <strong className={styles.lable_bubble}>Syllabus</strong>
              </Col>
              <Col xs={8}>
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
        </Col>
        <Col md={6} className="px-0 my-0">
          {/* <Row className="m-auto justify-content-center">
                <strong>Evaluations</strong>
              </Row> */}
          <Row className="m-auto justify-content-center">
            <MultiToggle
              options={options}
              selectedOption={filter}
              onSelectOption={(val) => setFilter(val)}
              className={styles.evaluations_filter + ' mb-2'}
            />
          </Row>
          {items.length !== 0 && (
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
