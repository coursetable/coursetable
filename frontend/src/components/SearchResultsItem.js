import React from 'react';

import { Row, Col, Badge } from 'react-bootstrap';

import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants.js';
import { unflattenTimes } from '../utilities';

import chroma from 'chroma-js';

import WorksheetToggleButton from './WorksheetToggleButton';

import Styles from './SearchResultsItem.module.css';

import ReactRating from 'react-rating';
import { BsSquareFill } from 'react-icons/bs';

const SearchResultsItem = ({
  course,
  isMobile,
  setShowModal,
  setModalCourse,
  executeGetCourseModal,
}) => {
  let key = 1;

  return (
    <Row
      className={
        'mx-auto px-2 py-2 justify-content-between ' + Styles.search_result_item
      }
      onClick={() => {
        executeGetCourseModal({
          variables: {
            crn: course['course.listings'][0]['crn'],
            season_code: course['season_code'],
          },
        });
        setModalCourse(course);
        setShowModal(true);
      }}
      tabIndex="0"
    >
      <Col md={4} xs={8} className={Styles.course_header}>
        <div className={Styles.course_name}>
          {course.title.length > 32
            ? course.title.slice(0, 29) + '...'
            : course.title}
        </div>
        <div className={Styles.course_code}>
          {course.course_codes ? course.course_codes.join(' • ') : ''}
        </div>
        <div className={Styles.skills_areas}>
          {course.skills.map(skill => (
            <Badge
              variant="secondary"
              className={Styles.tag}
              key={key++}
              style={{
                color: skillsAreasColors[skill],
                backgroundColor: chroma(skillsAreasColors[skill])
                  .alpha(0.16)
                  .css(),
              }}
            >
              {skill}
            </Badge>
          ))}
          {course.areas.map(area => (
            <Badge
              variant="secondary"
              className={Styles.tag}
              key={key++}
              style={{
                color: skillsAreasColors[area],
                backgroundColor: chroma(skillsAreasColors[area])
                  .alpha(0.16)
                  .css(),
              }}
            >
              {area}
            </Badge>
          ))}
        </div>
        {course['course.extra_info'] !== 'ACTIVE' && (
          <div className={Styles.extra_info}>CANCELLED</div>
        )}
      </Col>
      <Col md={2} className={Styles.course_header}>
        {course.times_summary == 'TBA' ? '' : course.times_summary}
        <br />
        {course.locations_summary == 'TBA' ? '' : course.locations_summary}
      </Col>
      <Col md={3} className={Styles.course_header}>
        {course.professor_names.join("\n")}
      </Col>
      <Col md={1} xs={4} style={{ whiteSpace: 'nowrap' }}>
        {course.average_rating && (
          <div
            style={
              {
                color: ratingColormap(course.average_rating)
                  .darken(2)
                  .css(),
                backgroundColor: chroma(ratingColormap(course.average_rating))
                  .alpha(0.33)
                  .css(),
              }
            }
            className={Styles.rating_cell}
          >
            {course.average_rating !== -1 && course.average_rating.toFixed(1)}
          </div>
        )}
      </Col>
      <Col md={1} xs={4} style={{ whiteSpace: 'nowrap' }}>
        {course.average_workload && (
          <div
            style={
              {
                color: workloadColormap(course.average_workload)
                  .darken(2)
                  .css(),
                backgroundColor: chroma(workloadColormap(course.average_workload))
                  .alpha(0.33)
                  .css(),
              }
            }
            className={Styles.rating_cell}
          >
            {course.average_workload !== -1 && course.average_workload.toFixed(1)}
          </div>
        )}
      </Col>
      <Col md={1} className="text-center">
        <WorksheetToggleButton
          alwaysRed={false}
          crn={course['course.listings'][0].crn}
          season_code={course.season_code}
          modal={true}
          isMobile={isMobile}
          times={unflattenTimes(course)}
        />
      </Col>
    </Row>
  );
};

export default SearchResultsItem;
