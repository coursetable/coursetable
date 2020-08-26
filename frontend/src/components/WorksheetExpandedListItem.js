import React from 'react';

import { Row, Badge } from 'react-bootstrap';

import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants.js';

import chroma from 'chroma-js';

import WorksheetToggleButton from './WorksheetToggleButton';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import Styles from './SearchResultsItem.module.css';
import { useWindowDimensions } from './WindowDimensionsProvider';

const WorksheetExpandedListItem = ({
  course,
  showModal,
  isLast,
  end_fade,
  hasSeason,
  ROW_WIDTH,
  PROF_WIDTH,
  MEET_WIDTH,
  RATE_WIDTH,
  BOOKMARK_WIDTH,
  PADDING,
  PROF_CUT,
  MEET_CUT,
}) => {
  const { width } = useWindowDimensions();
  const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
  let key = 1;
  let courseLocation;

  if (course['course.locations_summary'] === 'TBA') {
    courseLocation = '';
  } else {
    if (course['course.locations_summary'].includes('ONLINE')) {
      courseLocation = (
        <div className={Styles.online_tag}>
          {course['course.locations_summary']}
        </div>
      );
    } else {
      courseLocation = course['course.locations_summary'];
    }
  }

  return (
    <Row
      className={
        'mx-auto px-2 py-2 justify-content-between shadow-sm ' +
        Styles.search_result_item +
        (isLast ? ' ' + Styles.last_search_result_item : '')
      }
      style={{
        borderBottom: isLast ? 'none' : 'solid 2px #f6f6f6',
      }}
      onClick={() => {
        showModal(course);
      }}
      tabIndex="0"
    >
      <div
        style={{
          width: `${
            ROW_WIDTH -
            (width > PROF_CUT ? PROF_WIDTH : 0) -
            (width > MEET_CUT ? MEET_WIDTH : 0) -
            3 * RATE_WIDTH -
            BOOKMARK_WIDTH -
            PADDING
          }px`,
          paddingLeft: '15px',
        }}
        className={Styles.course_header + ' mr-auto'}
      >
        <div className={Styles.course_name}>{course['course.title']}</div>
        <Row className="m-auto">
          <div className={Styles.course_code}>{course.course_code}</div>
          <div className={Styles.skills_areas}>
            {course['course.skills'].map((skill) => (
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
            {course['course.areas'].map((area) => (
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
      </div>
      {width > PROF_CUT && (
        <div
          style={{ width: `${PROF_WIDTH}px` }}
          className={Styles.course_professors + ' pr-4'}
        >
          <ResponsiveEllipsis
            style={{ whiteSpace: 'pre-wrap' }}
            text={
              !course.professors || course.professors.length === 0
                ? 'TBA'
                : course.professors
            }
            maxLine={2}
            basedOn="words"
          />
        </div>
      )}
      {width > MEET_CUT && (
        <div style={{ width: `${MEET_WIDTH}px` }}>
          <div className={Styles.course_time}>
            {course['course.times_summary']}
          </div>
          <div className={Styles.course_location}>{courseLocation}</div>
        </div>
      )}
      <div
        style={{ whiteSpace: 'nowrap', width: `${RATE_WIDTH}px` }}
        className="d-flex"
      >
        <div
          style={{
            color: course['course.average_rating']
              ? ratingColormap(course['course.average_rating']).darken(2).css()
              : '#b5b5b5',
            backgroundColor: course['course.average_rating']
              ? chroma(ratingColormap(course['course.average_rating']))
                  .alpha(0.33)
                  .css()
              : '#ebebeb',
          }}
          className={Styles.rating_cell + ' m-auto'}
        >
          {course['course.average_rating']
            ? course['course.average_rating'].toFixed(1)
            : 'N/A'}
        </div>
      </div>
      <div
        style={{ whiteSpace: 'nowrap', width: `${RATE_WIDTH}px` }}
        className="d-flex"
      >
        <div
          style={{
            color: course['professor_avg_rating']
              ? ratingColormap(course['professor_avg_rating']).darken(2).css()
              : '#b5b5b5',
            backgroundColor: course['professor_avg_rating']
              ? chroma(ratingColormap(course['professor_avg_rating']))
                  .alpha(0.33)
                  .css()
              : '#ebebeb',
          }}
          className={Styles.rating_cell + ' m-auto'}
        >
          {course['professor_avg_rating']
            ? course['professor_avg_rating']
            : 'N/A'}
        </div>
      </div>
      <div
        style={{ whiteSpace: 'nowrap', width: `${RATE_WIDTH}px` }}
        className="d-flex"
      >
        <div
          style={{
            color: course['course.average_workload']
              ? workloadColormap(course['course.average_workload'])
                  .darken(2)
                  .css()
              : '#b5b5b5',
            backgroundColor: course['course.average_workload']
              ? chroma(workloadColormap(course['course.average_workload']))
                  .alpha(0.33)
                  .css()
              : '#ebebeb',
          }}
          className={Styles.rating_cell + ' m-auto'}
        >
          {course['course.average_workload']
            ? course['course.average_workload'].toFixed(1)
            : 'N/A'}
        </div>
      </div>
      <div style={{ width: `${BOOKMARK_WIDTH}px` }} />
      <div className={Styles.worksheet_btn}>
        <WorksheetToggleButton
          alwaysRed={true}
          crn={course.crn}
          season_code={course.season_code}
          modal={false}
          hasSeason={hasSeason}
        />
      </div>
    </Row>
  );
};

export default WorksheetExpandedListItem;
