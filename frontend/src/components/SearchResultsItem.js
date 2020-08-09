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
        {course['course.extra_info'] !== 'ACTIVE' && (
          <div className={Styles.extra_info}>CANCELLED</div>
        )}
      </Col>
      <Col md={2} xs={4} style={{ whiteSpace: 'nowrap' }}>
        {course.average_rating && (
          <ReactRating
            initialRating={course.average_rating}
            readonly
            emptySymbol={<BsSquareFill className={Styles.rating_icon_empty} />}
            fullSymbol={
              <BsSquareFill
                className={Styles.rating_icon_full}
                style={{ color: ratingColormap(course.average_rating) }}
              />
            }
            className={Styles.icon_ratings}
          />
        )}
      </Col>
      <Col md={2} xs={4} style={{ whiteSpace: 'nowrap' }}>
        {course.average_workload && (
          <ReactRating
            initialRating={course.average_workload}
            readonly
            emptySymbol={
              <BsSquareFill className={Styles.workload_icon_empty} />
            }
            fullSymbol={
              <BsSquareFill
                className={Styles.workload_icon_full}
                style={{ color: workloadColormap(course.average_workload) }}
              />
            }
            className={Styles.icon_ratings}
          />
        )}
      </Col>
      <Col md={2} xs={8} className={Styles.skills_areas}>
        <div className={Styles.skills_areas}>
          {course.skills.map(skill => (
            <Badge
              variant="secondary"
              className={Styles.tag}
              key={key++}
              style={{
                color: skillsAreasColors[skill.toUpperCase()],
                backgroundColor: chroma(skillsAreasColors[skill.toUpperCase()])
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
                color: skillsAreasColors[area.toUpperCase()],
                backgroundColor: chroma(skillsAreasColors[area.toUpperCase()])
                  .alpha(0.16)
                  .css(),
              }}
            >
              {area}
            </Badge>
          ))}
        </div>
      </Col>
      <Col md={2}>
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
