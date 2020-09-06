import React, { useState, useEffect } from 'react';

import { Row, Badge, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

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
import { useWindowDimensions } from './WindowDimensionsProvider';
import { useUser } from '../user';
import { fbFriendsAlsoTaking } from '../utilities';

import Styles from './SearchResultsItem.module.css';

/**
 * Renders a list item for a search result and expanded worksheet list item
 * @prop course - listing data for the current course
 * @prop showModal - function that shows the course modal for this listing
 * @prop isLast - boolean | is this the last course of the search results?
 * @prop hasSeason - function to pass to bookmark button
 * @prop ROW_WIDTH - integer that holds width of the row
 * @prop PROF_WIDTH - integer that holds width of the professor column
 * @prop MEET_WIDTH - integer that holds width of the meets column
 * @prop RATE_WIDTH - integer that holds width of the ratings columns
 * @prop BOOKMARK_WIDTH - integer that holds width of the last column
 * @prop PADDING - integer that holds width of padding between course and rest of columns
 * @prop PROF_CUT - integer that determines at what window width to stop displaying prof column
 * @prop MEET_CUT - integer that determines at what window width to stop displaying meets column
 */

const SearchResultsItem = ({
  course,
  showModal,
  isLast,
  hasSeason = null,
  ROW_WIDTH,
  PROF_WIDTH,
  MEET_WIDTH,
  RATE_WIDTH,
  BOOKMARK_WIDTH,
  PADDING,
  PROF_CUT,
  MEET_CUT,
}) => {
  // Used to cut off Professors list at 2 lines
  const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
  // Variable used in list keys
  let key = 1;
  // Has the component been mounted?
  const [mounted, setMounted] = useState(false);
  // Fetch width of window
  const { width } = useWindowDimensions();
  // Fetch user context data
  const { user } = useUser();
  // Fetch list of FB Friends that are also shopping this class
  let also_taking =
    user.fbLogin && user.fbWorksheets
      ? fbFriendsAlsoTaking(
          course.season_code,
          course.crn,
          user.fbWorksheets.worksheets,
          user.fbWorksheets.friendInfo
        )
      : [];

  // Set mounted on mount
  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  // Course location HTML
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

  // Render popover that contains title, description, and requirements when hovering over course name
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
          <br />
          <div className="text-danger">
            {course.requirements &&
              (course.requirements.length <= 250
                ? course.requirements
                : course.requirements.slice(0, 250) + '...')}
          </div>
        </Popover.Content>
      </Popover>
    );
  };

  // Render tooltip with names of FB friends also shopping
  const renderFBFriendsTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {also_taking.join(' • ')}
    </Tooltip>
  );

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
        {/* Course Title, Code, and Skills/Area column */}
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
          className={Styles.course_header}
        >
          {/* Course Title */}
          <div className={Styles.course_name}>{course.title}</div>
          <Row className="m-auto">
            {/* Course Code */}
            <div className={Styles.course_code}>{course.course_code}</div>
            {/* Course Skills/Areas */}
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
            {/* Course Extra Info */}
            {course.extra_info !== 'ACTIVE' && (
              <div className={Styles.extra_info + ' ml-1'}>CANCELLED</div>
            )}
          </Row>
        </div>
      </OverlayTrigger>
      {/* Course Professors */}
      {width > PROF_CUT && (
        <div
          style={{ width: `${PROF_WIDTH}px` }}
          className={Styles.course_professors + ' pr-4'}
        >
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
        </div>
      )}
      {/* Course Meets and Location */}
      {width > MEET_CUT && (
        <div style={{ width: `${MEET_WIDTH}px` }}>
          <div className={Styles.course_time}>{course.times_summary}</div>
          <div className={Styles.course_location}>{courseLocation}</div>
        </div>
      )}
      {/* Class Rating */}
      <div
        style={{ whiteSpace: 'nowrap', width: `${RATE_WIDTH}px` }}
        className="d-flex"
      >
        <div
          style={{
            color: course.average_rating
              ? ratingColormap(course.average_rating).darken(3).css()
              : '#b5b5b5',
            backgroundColor: course.average_rating
              ? chroma(ratingColormap(course.average_rating)).alpha(0.75).css()
              : '#ebebeb',
          }}
          className={Styles.rating_cell + ' m-auto'}
        >
          {course.average_rating ? course.average_rating.toFixed(1) : 'N/A'}
        </div>
      </div>
      {/* Professor Rating */}
      <div
        style={{ whiteSpace: 'nowrap', width: `${RATE_WIDTH}px` }}
        className="d-flex"
      >
        <div
          style={{
            color: course.average_professor
              ? ratingColormap(course.average_professor).darken(3).css()
              : '#b5b5b5',
            backgroundColor: course.average_professor
              ? chroma(ratingColormap(course.average_professor))
                  .alpha(0.75)
                  .css()
              : '#ebebeb',
          }}
          className={Styles.rating_cell + ' m-auto'}
        >
          {course.average_professor
            ? course.average_professor.toFixed(1)
            : 'N/A'}
        </div>
      </div>
      {/* Workload Rating */}
      <div
        style={{ whiteSpace: 'nowrap', width: `${RATE_WIDTH}px` }}
        className="d-flex"
      >
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
          className={Styles.rating_cell + ' m-auto'}
        >
          {course.average_workload ? course.average_workload.toFixed(1) : 'N/A'}
        </div>
      </div>
      {/* # FB Friends also shopping */}
      <div
        style={{
          width: `${BOOKMARK_WIDTH}px`,
        }}
        className="d-flex px-1"
      >
        {also_taking.length > 0 && (
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderFBFriendsTooltip}
          >
            <div className={Styles.fb_friends + ' m-auto'}>
              {also_taking.length}
            </div>
          </OverlayTrigger>
        )}
      </div>
      {/* Bookmark button */}
      <div className={Styles.worksheet_btn}>
        <WorksheetToggleButton
          worksheetView={hasSeason != null}
          crn={course.crn}
          season_code={course.season_code}
          modal={false}
          hasSeason={hasSeason}
        />
      </div>
      {/* Render conflict icon only when component has been mounted */}
      {mounted && !hasSeason && (
        <div className={Styles.conflict_error}>
          <CourseConflictIcon course={course} />
        </div>
      )}
    </Row>
  );
};

export default SearchResultsItem;
