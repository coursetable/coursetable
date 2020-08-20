import React, { useState, useEffect } from 'react';

import { Row, Col, Badge, OverlayTrigger, Popover } from 'react-bootstrap';

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

const SearchResultsItem = ({ course, isMobile, showModal, isLast }) => {
  const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
  let key = 1;
  const [mounted, setMounted] = useState(false);
  const professor_rating = course['professor_avg_rating'];

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

  const renderTitlePopover = (props) => {
    return (
      <Popover {...props} id="title_popover">
        <Popover.Title>
          <strong>{course.title}</strong>
        </Popover.Title>
        <Popover.Content>
          {course.description.length <= 500
            ? course.description
            : course.description.slice(0, 500) + '...'}
        </Popover.Content>
      </Popover>
    );
  };

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
        showModal(course);
      }}
      tabIndex="0"
    >
      <OverlayTrigger placement="right" overlay={renderTitlePopover}>
        <Col md={3} className={Styles.course_header}>
          <div className={Styles.course_name}>{course.title}</div>
          <Row className="m-auto">
            <div className={Styles.course_code}>{course.course_code}</div>
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
      </OverlayTrigger>

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
          'professor'
        )}
      </Col>
      <Col md={3}>
        <div className={Styles.course_time}>{course.times_summary}</div>
        <div className={Styles.course_location}>{courseLocation}</div>
      </Col>
      <Col md={1} style={{ whiteSpace: 'nowrap' }} className="d-flex">
        <div
          style={{
            color: course.average_rating
              ? ratingColormap(course.average_rating).darken(2).css()
              : '#b5b5b5',
            backgroundColor: course.average_rating
              ? chroma(ratingColormap(course.average_rating)).alpha(0.33).css()
              : '#ebebeb',
          }}
          className={Styles.rating_cell + ' my-auto'}
        >
          {course.average_rating ? course.average_rating.toFixed(1) : 'N/A'}
        </div>
      </Col>
      <Col md={1} style={{ whiteSpace: 'nowrap' }} className="d-flex">
        <div
          style={{
            color: professor_rating
              ? ratingColormap(professor_rating).darken(2).css()
              : '#b5b5b5',
            backgroundColor: professor_rating
              ? chroma(ratingColormap(professor_rating)).alpha(0.33).css()
              : '#ebebeb',
          }}
          className={Styles.rating_cell + ' my-auto'}
        >
          {professor_rating ? professor_rating : 'N/A'}
        </div>
      </Col>
      <Col md={1} style={{ whiteSpace: 'nowrap' }} className="d-flex">
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
          className={Styles.rating_cell + ' my-auto'}
        >
          {course.average_workload ? course.average_workload.toFixed(1) : 'N/A'}
        </div>
      </Col>
      <Col md={1} />
      <div className={Styles.worksheet_btn}>
        <WorksheetToggleButton
          alwaysRed={false}
          crn={course['listing.crn']}
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
