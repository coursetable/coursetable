import React, { useState, useEffect, useMemo } from 'react';

import { Badge, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants.js';

import chroma from 'chroma-js';

import WorksheetToggleButton from './WorksheetToggleButton';
import CourseConflictIcon from './CourseConflictIcon';
import { useUser } from '../user';
import { fbFriendsAlsoTaking } from '../utilities';
import { IoMdSunny } from 'react-icons/io';
import { FcCloseUpMode } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import {
  TextComponent,
  StyledResultsItem,
  StyledPopover,
  StyledRating,
} from './StyledComponents';

import Styles from './SearchResultsItem.module.css';

/**
 * Renders a list item for a search result and expanded worksheet list item
 * @prop course - listing data for the current course
 * @prop showModal - function that shows the course modal for this listing
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 * @prop isLast - boolean | is this the last course of the search results?
 * @prop COL_SPACING - dictionary with widths of each column
 * @prop isScrolling - boolean | is the user scrolling? if so, hide bookmark and conflict icon
 * @prop expanded - boolean | is the catalog expanded or not
 */

const SearchResultsItem = ({
  course,
  showModal,
  multiSeasons,
  isLast,
  COL_SPACING,
  isScrolling = false,
  expanded,
}) => {
  // Has the component been mounted?
  const [mounted, setMounted] = useState(false);

  // Fetch user context data
  const { user } = useUser();
  // Fetch list of FB Friends that are also shopping this class
  let also_taking = useMemo(() => {
    return user.fbLogin && user.fbWorksheets
      ? fbFriendsAlsoTaking(
          course.season_code,
          course.crn,
          user.fbWorksheets.worksheets,
          user.fbWorksheets.friendInfo
        )
      : [];
  }, [user.fbLogin, user.fbWorksheets, course]);

  // Set mounted on mount
  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  // Season code for this listing
  const season_code = course.season_code;
  const season = season_code[5];
  const year = season_code.substr(2, 2);
  // Size of season icons
  const icon_size = 10;
  const seasons = ['spring', 'summer', 'fall'];
  // Determine the icon for this season
  const icon = useMemo(() => {
    return season === '1' ? (
      <FcCloseUpMode className="my-auto" size={icon_size} />
    ) : season === '2' ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={icon_size} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={icon_size} />
    );
  }, [season]);

  // Tooltip for hovering over season
  const season_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>
        {seasons[season - 1].charAt(0).toUpperCase() +
          seasons[season - 1].slice(1) +
          ' ' +
          season_code.substr(0, 4)}
      </small>
    </Tooltip>
  );

  // Render popover that contains title, description, and requirements when hovering over course name
  const renderTitlePopover = (props) => {
    return (
      <StyledPopover {...props} id="title_popover">
        <Popover.Title>
          <strong>
            {course.extra_info !== 'ACTIVE' ? (
              <span className={Styles.cancelled_text}>CANCELLED </span>
            ) : (
              ''
            )}
            {course.title}
          </strong>
        </Popover.Title>
        <Popover.Content>
          {course.description
            ? course.description.length <= 500
              ? course.description
              : course.description.slice(0, 500) + '...'
            : 'no description'}
          <br />
          <div className="text-danger">
            {course.requirements &&
              (course.requirements.length <= 250
                ? course.requirements
                : course.requirements.slice(0, 250) + '...')}
          </div>
        </Popover.Content>
      </StyledPopover>
    );
  };

  // Render tooltip with names of FB friends also shopping
  const renderFBFriendsTooltip = (props) =>
    also_taking.length > 0 ? (
      <Tooltip id="button-tooltip" {...props}>
        {also_taking.join(' • ')}
      </Tooltip>
    ) : (
      <div />
    );

  const szn_style = {
    width: `${COL_SPACING.SZN_WIDTH}px`,
    paddingLeft: '15px',
  };
  const code_style = {
    width: `${COL_SPACING.CODE_WIDTH}px`,
    paddingLeft: !multiSeasons ? '15px' : '0px',
  };
  const title_style = { width: `${COL_SPACING.TITLE_WIDTH}px` };
  const rate_style = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_WIDTH}px`,
  };
  const prof_style = { width: `${COL_SPACING.PROF_WIDTH}px` };
  const meet_style = { width: `${COL_SPACING.MEET_WIDTH}px` };
  const loc_style = { width: `${COL_SPACING.LOC_WIDTH}px` };
  const num_style = { width: `${COL_SPACING.NUM_WIDTH}px` };
  const sa_style = { width: `${COL_SPACING.SA_WIDTH}px` };

  return (
    <StyledResultsItem
      className={
        'mx-auto pl-4 pr-2 py-0 justify-content-between ' +
        Styles.search_result_item +
        ' ' +
        (isLast ? Styles.last_search_result_item : '') +
        // red background if class is cancelled
        (course.extra_info !== 'ACTIVE' ? ' ' + Styles.cancelled_class : '')
      }
      onClick={() => {
        showModal(course);
      }}
      tabIndex="0"
    >
      {multiSeasons && (
        <div style={szn_style} className="d-flex">
          <OverlayTrigger
            placement="top"
            delay={{ show: 500, hide: 250 }}
            overlay={season_tooltip}
          >
            <div className={Styles.skills_areas + ' my-auto'}>
              <Badge
                variant="secondary"
                className={
                  Styles.tag + ' ' + Styles[seasons[parseInt(season) - 1]]
                }
                key={season}
              >
                <div style={{ display: 'inline-block' }}>{icon}</div>
                &nbsp;{"'" + year}
              </Badge>
            </div>
          </OverlayTrigger>
        </div>
      )}
      {/* Course Code*/}
      <div
        style={code_style}
        className={Styles.ellipsis_text + ' font-weight-bold'}
      >
        {course.course_code}
        <TextComponent type={1}>
          {course.section
            ? ' ' + (course.section.length > 1 ? '' : '0') + course.section
            : ''}
        </TextComponent>
      </div>
      <OverlayTrigger
        placement={expanded ? 'right' : 'left'}
        overlay={renderTitlePopover}
      >
        {/* Course Title */}
        <div style={title_style}>
          <div className={Styles.ellipsis_text}>{course.title}</div>
        </div>
      </OverlayTrigger>
      {/* Class Rating */}
      <div style={rate_style} className="d-flex">
        <StyledRating
          rating={course.average_rating}
          colormap={ratingColormap}
          className={Styles.rating_cell + ' m-auto'}
        >
          {course.average_rating ? course.average_rating.toFixed(1) : 'N/A'}
        </StyledRating>
      </div>
      {/* Professor Rating */}
      <div style={rate_style} className="d-flex">
        <StyledRating
          rating={course.average_professor}
          colormap={ratingColormap}
          className={Styles.rating_cell + ' m-auto'}
        >
          {course.average_professor
            ? course.average_professor.toFixed(1)
            : 'N/A'}
        </StyledRating>
      </div>
      {/* Workload Rating */}
      <div style={rate_style} className="d-flex">
        <StyledRating
          rating={course.average_workload}
          colormap={workloadColormap}
          className={Styles.rating_cell + ' m-auto'}
        >
          {course.average_workload ? course.average_workload.toFixed(1) : 'N/A'}
        </StyledRating>
      </div>
      {/* Enrollment */}
      <div style={num_style} className="d-flex">
        <span className="m-auto">
          {course.enrolled
            ? course.enrolled
            : course.last_enrollment && course.last_enrollment_same_professors
            ? course.last_enrollment
            : course.last_enrollment
            ? `~${course.last_enrollment}`
            : ''}
        </span>
      </div>

      {/* Course Professors */}
      <div style={prof_style} className={Styles.ellipsis_text}>
        {course.professor_names.length === 0
          ? 'TBA'
          : course.professor_names.join(' • ')}
      </div>

      {/* Course Meets */}

      <div style={meet_style}>
        <div className={Styles.ellipsis_text}>{course.times_summary}</div>
      </div>

      {/* Course Location */}

      <div style={loc_style}>
        <div className={Styles.ellipsis_text}>{course.locations_summary}</div>
      </div>

      {/* Skills and Areas */}

      <div style={sa_style} className="d-flex">
        <span className={Styles.skills_areas + ' '}>
          {course.skills.map((skill, index) => (
            <Badge
              variant="secondary"
              className={Styles.tag + ' my-auto'}
              key={index}
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
          {course.areas.map((area, index) => (
            <Badge
              variant="secondary"
              className={Styles.tag + ' my-auto'}
              key={index}
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
        </span>
      </div>
      {/* # FB Friends also shopping */}
      <div style={num_style} className="d-flex ">
        <OverlayTrigger
          placement="top"
          delay={{ show: 100, hide: 100 }}
          overlay={renderFBFriendsTooltip}
        >
          <span className="m-auto">
            {also_taking.length > 0 ? also_taking.length : ''}
          </span>
        </OverlayTrigger>
      </div>

      {/* Bookmark button */}
      <div className={Styles.worksheet_btn}>
        <WorksheetToggleButton
          crn={course.crn}
          season_code={course.season_code}
          modal={false}
        />
      </div>
      {/* Render conflict icon only when component has been mounted */}
      {mounted && !isScrolling && (
        <div className={Styles.conflict_error}>
          <CourseConflictIcon course={course} />
        </div>
      )}
    </StyledResultsItem>
  );
};

const SearchResultsItemMemo = React.memo(SearchResultsItem);
// SearchResultsItemMemo.whyDidYouRender = true;
export default SearchResultsItemMemo;
