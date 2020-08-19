import React, { useState, useEffect } from 'react';

import { Row, Col, Badge } from 'react-bootstrap';

import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants.js';

import chroma from 'chroma-js';

import WorksheetToggleButton from './WorksheetToggleButton';
import CourseConflictIcon from './CourseConflictIcon';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';

import Styles from './SearchResultsItem.module.css';

const SearchResultsItem = ({
  course,
  isMobile,
  setShowModal,
  setModalCourse,
  executeGetCourseModal,
  isLast,
}) => {
  const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
  let key = 1;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  let courseLocation;

  if (course.locations_summary === 'TBA') {
    courseLocation = '';
  } else {
    if (course.locations_summary.includes('ONLINE')) {
      courseLocation = (
        <div className={Styles.online_tag}>{course.locations_summary}</div>
      );
    } else {
      courseLocation = course.locations_summary;
    }
  }

  return (
    <Row
      className={
        'mx-auto px-2 py-2 justify-content-between shadow-sm ' +
        Styles.search_result_item
      }
      style={{
        borderBottom: isLast ? 'none' : 'solid 2px #f6f6f6',
      }}
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
      <Col md={4} className={Styles.course_header}>
        <div className={Styles.course_name}>{course.title}</div>
        <Row className="m-auto">
          <div className={Styles.course_code}>
            {course.course_codes.join(' • ')}
          </div>
          <div className={Styles.skills_areas}>
            {course.skills.map((skill) => (
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
            {course.areas.map((area) => (
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
        </Row>
        {course['course.extra_info'] !== 'ACTIVE' && (
          <div className={Styles.extra_info}>CANCELLED</div>
        )}
      </Col>
      <Col md={2} className={Styles.course_professors}>
        {mounted ? (
          <ResponsiveEllipsis
            style={{ whiteSpace: 'pre-wrap' }}
            text={
              course.professor_names.length === 0
                ? 'TBA'
                : course.professor_names.join(' • ')
            }
            maxLine={2}
            basedOn="words"
          />
        ) : (
          'dummy text'
        )}
      </Col>
      <Col md={3}>
        <div className={Styles.course_time}>{course.times_summary}</div>
        <div className={Styles.course_location}>{courseLocation}</div>
      </Col>
      <Col md={1} xs={4} style={{ whiteSpace: 'nowrap' }}>
        <div
          style={{
            color: course.average_rating
              ? ratingColormap(course.average_rating).darken(2).css()
              : '#b5b5b5',
            backgroundColor: course.average_rating
              ? chroma(ratingColormap(course.average_rating)).alpha(0.33).css()
              : '#ebebeb',
          }}
          className={Styles.rating_cell}
        >
          {course.average_rating ? course.average_rating.toFixed(1) : 'N/A'}
        </div>
      </Col>
      <Col md={1} style={{ whiteSpace: 'nowrap' }}>
        <div
          style={{
            color: course.average_workload
              ? workloadColormap(course.average_workload).darken(2).css()
              : '#b5b5b5',
            backgroundColor: course.average_workload
              ? chroma(workloadColormap(course.average_workload))
                  .alpha(0.33)
                  .css()
              : '#ebebeb',
          }}
          className={Styles.rating_cell}
        >
          {course.average_workload ? course.average_workload.toFixed(1) : 'N/A'}
        </div>
      </Col>
      <Col md={1} />
      <div className={Styles.worksheet_btn}>
        <WorksheetToggleButton
          alwaysRed={false}
          crn={course['course.listings'][0].crn}
          season_code={course.season_code}
          isMobile={isMobile}
        />
      </div>
      {mounted && (
        <div className={Styles.conflict_error}>
          <CourseConflictIcon course={course} />
        </div>
      )}
    </Row>
  );
};

export default SearchResultsItem;
