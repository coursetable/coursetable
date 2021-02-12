import React, { useState, useEffect, useMemo } from 'react';

import { Badge, OverlayTrigger, Popover, Tooltip, Row } from 'react-bootstrap';

import chroma from 'chroma-js';
import { IoMdSunny } from 'react-icons/io';
import { FcCloseUpMode } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import styled from 'styled-components';
import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants';

import WorksheetToggleButton from './WorksheetToggleButton';
import CourseConflictIcon from './CourseConflictIcon';
import { TextComponent, StyledPopover, StyledRating } from './StyledComponents';

import Styles from './SearchResultsItem.module.css';
import { getOverallRatings } from '../courseUtilities';

// Row for search results item
const StyledResultsItem = styled(Row)`
  max-width: 1600px;
`;

const StyledSpacer = styled.div`
  border-top: solid 1px ${({ theme }) => theme.border};
  transition: border 0.2s linear;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.select_hover};
  }
`;

/**
 * Renders a list item for a search result and expanded worksheet list item
 * @prop course - listing data for the current course
 * @prop showModal - function that shows the course modal for this listing
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 * @prop isFirst - boolean | is this the first course of the search results?
 * @prop COL_SPACING - dictionary with widths of each column
 * @prop isScrolling - boolean | is the user scrolling? if so, hide bookmark and conflict icon
 * @prop expanded - boolean | is the catalog expanded or not
 * @prop fb_friends - list of fb friends also taking this course
 */

const SearchResultsItem = ({
  course,
  showModal,
  multiSeasons,
  isFirst,
  COL_SPACING,
  isScrolling = false,
  expanded,
  fb_friends,
}) => {
  // Has the component been mounted?
  const [mounted, setMounted] = useState(false);

  // Set mounted on mount
  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  // Season code for this listing
  const { season_code } = course;
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

  // Fetch overall rating value and string representation
  const course_rating = useMemo(() => getOverallRatings(course), [course]);

  // Tooltip for hovering over season
  const season_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>
        {`${
          seasons[season - 1].charAt(0).toUpperCase() +
          seasons[season - 1].slice(1)
        } ${season_code.substr(0, 4)}`}
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
              : `${course.description.slice(0, 500)}...`
            : 'no description'}
          <br />
          <div className="text-danger">
            {course.requirements &&
              (course.requirements.length <= 250
                ? course.requirements
                : `${course.requirements.slice(0, 250)}...`)}
          </div>
        </Popover.Content>
      </StyledPopover>
    );
  };

  // Render tooltip with names of FB friends also shopping
  const renderFBFriendsTooltip = (props) =>
    fb_friends.length > 0 ? (
      <Tooltip id="button-tooltip" {...props}>
        {fb_friends.join(' • ')}
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
  const rate_overall_style = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_OVERALL_WIDTH}px`,
  };
  const rate_workload_style = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_WORKLOAD_WIDTH}px`,
  };
  const rate_prof_style = {
    whiteSpace: 'nowrap',
    width: `${COL_SPACING.RATE_PROF_WIDTH}px`,
  };
  const prof_style = { width: `${COL_SPACING.PROF_WIDTH}px` };
  const meet_style = { width: `${COL_SPACING.MEET_WIDTH}px` };
  const loc_style = { width: `${COL_SPACING.LOC_WIDTH}px` };
  const num_style = { width: `${COL_SPACING.NUM_WIDTH}px` };
  const sa_style = { width: `${COL_SPACING.SA_WIDTH}px` };

  return (
    <StyledSpacer
      className={`${isFirst ? Styles.first_search_result_item : ''} ${
        course.extra_info !== 'ACTIVE' ? ` ${Styles.cancelled_class}` : ''
      }`}
      onClick={() => {
        showModal(course);
      }}
      tabIndex="0"
    >
      <StyledResultsItem
        className={`mx-auto pl-4 pr-2 py-0 justify-content-between ${Styles.search_result_item}`}
      >
        {multiSeasons && (
          <div style={szn_style} className="d-flex">
            <OverlayTrigger
              placement="top"
              delay={{ show: 500, hide: 250 }}
              overlay={season_tooltip}
            >
              <div className={`${Styles.skills_areas} my-auto`}>
                <Badge
                  variant="secondary"
                  className={`${Styles.tag} ${
                    Styles[seasons[parseInt(season, 10) - 1]]
                  }`}
                  key={season}
                >
                  <div style={{ display: 'inline-block' }}>{icon}</div>
                  &nbsp;{`'${year}`}
                </Badge>
              </div>
            </OverlayTrigger>
          </div>
        )}
        {/* Course Code */}
        <div
          style={code_style}
          className={`${Styles.ellipsis_text} font-weight-bold`}
        >
          {course.course_code}
          <TextComponent type={1}>
            {course.section
              ? ` ${course.section.length > 1 ? '' : '0'}${course.section}`
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
        <div style={rate_overall_style} className="d-flex">
          <StyledRating
            rating={course_rating}
            colormap={ratingColormap}
            className={`${Styles.rating_cell} m-auto`}
          >
            {
              // String representation of rating to be displayed
              course.average_rating_same_professors
                ? course_rating // Use same professor if possible. Displayed as is
                : course.average_rating
                ? `~` // Use all professors otherwise and add tilda ~
                : 'N/A' // No ratings at all
            }
          </StyledRating>
        </div>
        {/* Professor Rating */}
        {/* <div style={rate_prof_style} className="d-flex">
          <StyledRating
            rating={course.average_professor}
            colormap={ratingColormap}
            className={`${Styles.rating_cell} m-auto`}
          >
            {course.average_professor
              ? course.average_professor.toFixed(1)
              : 'N/A'}
          </StyledRating>
        </div> */}
        {/* Workload Rating */}
        <div style={rate_workload_style} className="d-flex">
          <StyledRating
            rating={course.average_workload}
            colormap={workloadColormap}
            className={`${Styles.rating_cell} m-auto`}
          >
            {course.average_workload
              ? course.average_workload.toFixed(1)
              : 'N/A'}
          </StyledRating>
        </div>
        {/* Course Professors & Professor Rating */}
        <div style={prof_style} className="d-flex align-items-center">
          <div style={rate_prof_style} className="mr-1">
            <StyledRating
              rating={course.average_professor}
              colormap={ratingColormap}
              className={`${Styles.rating_cell}`}
            >
              {course.average_professor
                ? course.average_professor.toFixed(1)
                : 'N/A'}
            </StyledRating>
          </div>
          <div className={Styles.ellipsis_text}>
            {course.professor_names.length === 0
              ? 'TBA'
              : course.professor_names.join(' • ')}
          </div>
        </div>
        {/* Skills and Areas */}
        <div style={sa_style} className="d-flex">
          <span className={`${Styles.skills_areas} `}>
            {course.skills.map((skill, index) => (
              <Badge
                variant="secondary"
                className={`${Styles.tag} my-auto`}
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
                className={`${Styles.tag} my-auto`}
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
        {/* Course Meets */}
        <div style={meet_style}>
          <div className={Styles.ellipsis_text}>{course.times_summary}</div>
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
        {/* Course Location */}
        <div style={loc_style}>
          <div className={Styles.ellipsis_text}>{course.locations_summary}</div>
        </div>
        {/* # FB Friends also shopping */}
        <div style={num_style} className="d-flex ">
          <OverlayTrigger
            placement="top"
            delay={{ show: 100, hide: 100 }}
            overlay={renderFBFriendsTooltip}
          >
            <span className="m-auto">
              {fb_friends.length > 0 ? fb_friends.length : ''}
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
    </StyledSpacer>
  );
};

const SearchResultsItemMemo = React.memo(SearchResultsItem);
// SearchResultsItemMemo.whyDidYouRender = true;
export default SearchResultsItemMemo;
