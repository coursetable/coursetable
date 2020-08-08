import React from 'react';

import { Row, Col, Badge } from 'react-bootstrap';

import { ratingColormap, workloadColormap } from '../queries/Constants.js';
import { unflattenTimes } from '../utilities';

import WorksheetToggleButton from './WorksheetToggleButton';

import Styles from './SearchResultsItem.module.css';

const SearchResultsItem = ({
  course,
  isMobile,
  setShowModal,
  setModalCourse,
  executeGetCourseModal,
}) => {
  const RATINGS_PRECISION = 1;

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
        <div
          className={Styles.overall_rating}
          style={
            course.average_rating && {
              color: ratingColormap(course.average_rating),
            }
          }
        >
          {course.average_rating
            ? course.average_rating.toFixed(RATINGS_PRECISION)
            : ''}
        </div>
      </Col>
      <Col md={2} xs={4} style={{ whiteSpace: 'nowrap' }}>
        <div
          className={Styles.workload_rating}
          style={
            course.average_workload && {
              color: workloadColormap(course.average_workload),
            }
          }
        >
          {course.average_workload
            ? course.average_workload.toFixed(RATINGS_PRECISION)
            : ''}
        </div>
      </Col>
      <Col md={2} xs={8} className={Styles.skills_areas}>
        <div className={Styles.skills_areas}>
          {course.skills.map((skill) => (
            <Badge
              variant="secondary"
              className={Styles.tag + ' ' + Styles[skill]}
            >
              {skill}
            </Badge>
          ))}
          {course.areas.map((area) => (
            <Badge
              variant="secondary"
              className={Styles.tag + ' ' + Styles[area]}
            >
              {area}
            </Badge>
          ))}
        </div>
      </Col>
      <Col md={2}>
        {/* <Button
              className={
                isMobile
                  ? Styles.toggle_worksheet_mobile
                  : Styles.toggle_worksheet
              }
            >
              {isMobile ? 'Add to worksheet' : <BsBookmarkPlus />}
            </Button> */}
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
