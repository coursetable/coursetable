import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { ratingColormap, workloadColormap } from '../queries/Constants.js';
import WorksheetToggleButton from './WorksheetToggleButton';
import styles from './SearchResultsGridItem.module.css';
import tag_styles from './SearchResultsItem.module.css';
import { FcRating, FcReading } from 'react-icons/fc';
import { AiFillStar } from 'react-icons/ai';

const SearchResultsGridItem = ({
  course,
  isMobile,
  setShowModal,
  executeGetCourseModal,
  num_cols,
}) => {
  const RATINGS_PRECISION = 1;
  const col_width = 12 / num_cols;

  return (
    <Col
      md={col_width}
      className="px-2 pt-0 pb-4"
      style={{ overflow: 'hidden' }}
    >
      <div
        onClick={() => {
          executeGetCourseModal({
            variables: {
              crn: course['course.listings'][0]['crn'],
              season_code: course['season_code'],
            },
          });
          setShowModal(true);
        }}
        className={styles.one_line + ' ' + styles.item_container + ' p-3'}
      >
        <Row className="m-auto">
          <small className={styles.one_line + ' ' + styles.course_codes}>
            {course.course_codes ? course.course_codes.join(' • ') : ''}
          </small>
        </Row>
        <Row className="m-auto">
          <strong className={styles.one_line}>
            {course.title.length > 32
              ? course.title.slice(0, 29) + '...'
              : course.title}
          </strong>
        </Row>
        <Row className="m-auto">
          <span className={styles.one_line + ' ' + styles.professors}>
            {course.professor_names.length > 0
              ? course.professor_names.join(' • ')
              : 'Professor: TBA'}
          </span>
        </Row>
        <Row className="m-auto justify-content-between">
          <Col xs={7} className="p-0">
            <Row className="m-auto">
              <small className={styles.one_line + ' ' + styles.small_text}>
                {course.times_summary === 'TBA'
                  ? 'Times: TBA'
                  : course.times_summary}
              </small>
            </Row>
            <Row className="m-auto">
              <small className={styles.one_line + ' ' + styles.small_text}>
                {course.locations_summary === 'TBA'
                  ? 'Location: TBA'
                  : course.locations_summary}
              </small>
            </Row>
            <Row className="m-auto">
              <div className={tag_styles.skills_areas}>
                {course.skills.map((skill) => (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag + ' ' + tag_styles[skill]}
                  >
                    {skill}
                  </Badge>
                ))}
                {course.areas.map((area) => (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag + ' ' + tag_styles[area]}
                  >
                    {area}
                  </Badge>
                ))}
                {course.skills.length === 0 && course.areas.length === 0 && (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag + ' ' + tag_styles.none}
                  >
                    N/A
                  </Badge>
                )}
              </div>
            </Row>
          </Col>
          <Col xs="auto" className="p-0 d-flex align-items-end">
            <div>
              <Row className="m-auto justify-content-end">
                <div
                  className={tag_styles.overall_rating + ' mr-1'}
                  style={{
                    color: course.average_rating
                      ? ratingColormap(course.average_rating)
                      : 'black',
                  }}
                >
                  {course.average_rating
                    ? course.average_rating.toFixed(RATINGS_PRECISION)
                    : 'TBA'}
                </div>
                <AiFillStar color="#fac000" className="my-auto" />
              </Row>
              <Row className="m-auto justify-content-end">
                <div
                  className={tag_styles.workload_rating + ' mr-1'}
                  style={{
                    color: course.average_workload
                      ? workloadColormap(course.average_workload)
                      : 'black',
                  }}
                >
                  {course.average_workload
                    ? course.average_workload.toFixed(RATINGS_PRECISION)
                    : 'TBA'}
                </div>
                <FcReading className="my-auto" />
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.worksheet_btn}>
        <WorksheetToggleButton
          alwaysRed={false}
          crn={course['course.listings'][0].crn}
          season_code={course.season_code}
          modal={false}
          isMobile={isMobile}
        />
      </div>
    </Col>
  );
};

export default SearchResultsGridItem;
