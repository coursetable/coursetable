import React from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import { SEARCH_AVERAGE_ACROSS_SEASONS } from '../queries/QueryStrings';
import { useQuery } from '@apollo/react-hooks';
import styles from './CourseModalOverview.module.css';
import { ratingColormap, workloadColormap } from '../queries/Constants.js';
import { toSeasonString } from '../utilities';

const CourseModalOverview = (props) => {
  const listing = props.listing;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const setSeason = (season_code) => {
    props.setSeason(season_code);
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
    },
  });
  if (loading || error) return <Modal.Body>Loading...</Modal.Body>;

  let evaluations = {};
  let items = [];

  if (data) {
    data.computed_course_info.forEach((season) => {
      evaluations[season.season_code] = [
        season.course.evaluation_statistics[0] &&
        season.course.evaluation_statistics[0].avg_rating != null
          ? season.course.evaluation_statistics[0].avg_rating
          : -1,
        season.course.evaluation_statistics[0] &&
        season.course.evaluation_statistics[0].avg_workload != null
          ? season.course.evaluation_statistics[0].avg_workload
          : -1,
      ];
    });
    let id = 0;
    for (let season in evaluations) {
      // console.log(evaluations[season]);
      if (evaluations[season][0] === -1 && evaluations[season][1] === -1)
        continue;
      items.push(
        <Row key={id++} className="m-auto py-1 justify-content-end">
          <Col
            sm={5}
            className={
              styles.rating_bubble + ' d-flex justify-content-center px-0 mr-3'
            }
            onClick={(event) => setSeason(season)}
          >
            <strong>{toSeasonString(season)[0]}</strong>
          </Col>
          <Col
            sm={2}
            style={
              evaluations[season][0] && {
                color: ratingColormap(evaluations[season][0]),
              }
            }
            className="px-0 ml-3 d-flex justify-content-center"
          >
            <strong>
              {evaluations[season][0] !== -1 &&
                evaluations[season][0].toFixed(1)}
            </strong>
          </Col>
          <Col
            sm={2}
            style={
              evaluations[season][1] && {
                color: workloadColormap(evaluations[season][1]),
              }
            }
            className="px-0 ml-3 d-flex justify-content-center"
          >
            <strong>
              {evaluations[season][1] !== -1 &&
                evaluations[season][1].toFixed(1)}
            </strong>
          </Col>
        </Row>
      );
    }
  }
  items.reverse();

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col sm={7} className="px-0 my-0">
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
        <Col sm={5} className="px-0 my-0">
          {/* <Row className="m-auto justify-content-center">
                <strong>Evaluations</strong>
              </Row> */}
          <Row className="m-auto pb-1 justify-content-end">
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
          {items}
        </Col>
      </Row>
    </Modal.Body>
  );
};

export default CourseModalOverview;
