import React, { useState } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import MultiToggle from 'react-multi-toggle';
import {
  SEARCH_AVERAGE_ACROSS_SEASONS,
  SEARCH_PROFESSOR_COURSES,
} from '../queries/QueryStrings';
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
  const [filter, setFilter] = useState('both');

  const setSeason = (evaluation) => {
    props.setSeason(evaluation);
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
      course_code:
        filter === 'professor'
          ? null
          : listing.course_code
          ? listing.course_code
          : 'bruh',
      professor_name: filter === 'professor' ? listing.professors : null,
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
        season_code: season.season_code,
        professor: season.professor_names.length
          ? filter === 'professor'
            ? listing.professors
            : season.professor_names[0]
          : '',
        crn: season.course.listings[0].crn,
        section: season.course.listings[0].section,
        course_code:
          filter === 'professor'
            ? season.course.listings[0].course_code
            : listing.course_code,
      });
    });
    evaluations.sort(sortEvals);

    let id = 0;
    for (let i = 0; i < evaluations.length; i++) {
      // console.log(evaluations[season]);
      if (evaluations[i].rating === -1 && evaluations[i].workload === -1)
        continue;
      if (filter === 'both' && evaluations[i].professor !== listing.professors)
        continue;

      if (
        filter === 'course' &&
        evaluations[i].professor === listing.professors
      )
        continue;

      if (
        filter === 'professor' &&
        evaluations[i].course_code === listing.course_code
      )
        continue;
      items.push(
        <Row key={id++} className="m-auto py-1 justify-content-center">
          <Col
            sm={5}
            className={
              styles.rating_bubble + ' d-flex justify-content-center px-0 mr-3'
            }
            onClick={(event) => setSeason(evaluations[i])}
          >
            <strong>{toSeasonString(evaluations[i].season_code)[0]}</strong>
          </Col>
          <Col
            sm={2}
            style={
              evaluations[i].rating && {
                color: ratingColormap(evaluations[i].rating),
              }
            }
            className="px-0 ml-3 d-flex justify-content-center"
          >
            <strong>
              {evaluations[i].rating !== -1 && evaluations[i].rating.toFixed(1)}
            </strong>
          </Col>
          <Col
            sm={2}
            style={
              evaluations[i].workload && {
                color: workloadColormap(evaluations[i].workload),
              }
            }
            className="px-0 ml-3 d-flex justify-content-center"
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
        <Col sm={6} className="px-0 my-0">
          {/* COURSE DESCRIPTION */}
          <Row className="m-auto pb-3">{listing['course.description']}</Row>
          {listing['professors'] && (
            <Row className="m-auto py-2">
              <Col sm={4} className="px-0">
                <strong className={styles.lable_bubble}>Professor</strong>
              </Col>
              <Col sm={8}>{listing.professors}</Col>
            </Row>
          )}
          {listing['course.times_summary'] !== 'TBA' && (
            <Row className="m-auto py-2">
              <Col sm={4} className="px-0">
                <strong className={styles.lable_bubble}>Meets</strong>
              </Col>
              <Col sm={8}>{listing['course.times_summary']}</Col>
            </Row>
          )}
          {listing['section'] && (
            <Row className="m-auto py-2">
              <Col sm={4} className="px-0">
                <strong className={styles.lable_bubble}>Section</strong>
              </Col>
              <Col sm={8}>{listing.section}</Col>
            </Row>
          )}
          {location_url !== '' && (
            <Row className="m-auto py-2">
              <Col sm={4} className="px-0">
                <strong className={styles.lable_bubble}>Location</strong>
              </Col>
              <Col sm={8}>
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
              <Col sm={4} className="px-0">
                <strong className={styles.lable_bubble}>Syllabus</strong>
              </Col>
              <Col sm={8}>
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
        <Col sm={6} className="px-0 my-0">
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
          <Row className="m-auto pb-1 justify-content-center">
            <Col sm={5} className="d-flex justify-content-center px-0 mr-3">
              <span className={styles.evaluation_header}>Season</span>
            </Col>
            <Col sm={2} className="d-flex ml-3 justify-content-center px-0">
              <span className={styles.evaluation_header}>R</span>
            </Col>
            <Col sm={2} className="d-flex ml-3 justify-content-center px-0">
              <span className={styles.evaluation_header}>W</span>
            </Col>
          </Row>
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
