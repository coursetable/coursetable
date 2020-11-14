import React, { useState, useEffect } from 'react';
import { Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants.js';
import chroma from 'chroma-js';

import WorksheetToggleButton from './WorksheetToggleButton';
import CourseConflictIcon from './CourseConflictIcon';
import styles from './SearchResultsGridItem.module.css';
import tag_styles from './SearchResultsItem.module.css';
import { useUser } from '../user';
import { fbFriendsAlsoTaking } from '../utilities';
import { FcCloseUpMode, FcReading } from 'react-icons/fc';
import { AiFillStar } from 'react-icons/ai';
import { IoMdSunny } from 'react-icons/io';
import { FaCanadianMapleLeaf, FaAppleAlt } from 'react-icons/fa';
import { SurfaceComponent } from './StyledComponents';

/**
 * Renders a grid item for a search result
 * @prop course - listing data for the current course
 * @prop showModal - function that shows the course modal for this listing
 * @prop isLoggedIn - boolean | is the user logged in?
 * @prop num_cols - integer that holds how many columns in grid view
 * @prop multiSeasons - boolean | are we displaying courses across multiple seasons
 */

const SearchResultsGridItem = ({
  course,
  showModal,
  isLoggedIn,
  num_cols,
  multiSeasons,
}) => {
  // How many decimal points to use in ratings
  const RATINGS_PRECISION = 1;
  // Bootstrap column width depending on the number of columns
  const col_width = 12 / num_cols;
  // Season code for this listing
  const season_code = course.season_code;
  const season = season_code[5];
  const year = season_code.substr(2, 2);
  // Size of season icons
  const icon_size = 13;
  const seasons = ['spring', 'summer', 'fall'];
  // Determine the icon for this season
  const icon =
    season === '1' ? (
      <FcCloseUpMode className="my-auto" size={icon_size} />
    ) : season === '2' ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={icon_size} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={icon_size} />
    );
  // Fetch user context data
  const { user } = useUser();
  // Fetch list of FB friends that are also shopping this class. NOT USING THIS RN
  let also_taking =
    user.fbLogin && user.fbWorksheets
      ? fbFriendsAlsoTaking(
          course.season_code,
          course.crn,
          user.fbWorksheets.worksheets,
          user.fbWorksheets.friendInfo
        )
      : [];

  // Has the component been mounted yet?
  const [mounted, setMounted] = useState(false);

  // Set mounted on mount
  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);

  // Variable used in list keys
  let key = 0;

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

  // Tooltip for hovering over class rating
  const class_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Class</span>
    </Tooltip>
  );

  // Tooltip for hovering over professor rating
  const prof_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Professor</span>
    </Tooltip>
  );

  // Tooltip for hovering over workload rating
  const workload_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Workload</span>
    </Tooltip>
  );

  // Tooltip for hovering over # of FB friends also taking. NOT USING RN
  const renderFBFriendsTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {also_taking.join(' • ')}
    </Tooltip>
  );

  return (
    <Col
      md={col_width}
      className={styles.container + ' px-2 pt-0 pb-3'}
      style={{ overflow: 'hidden' }}
    >
      <SurfaceComponent
        onClick={() => {
          showModal(course);
        }}
        className={styles.one_line + ' ' + styles.item_container + ' px-3 pb-3'}
        tabIndex="0"
      >
        <Row className="m-auto">
          {/* Course Code */}
          <Col xs={multiSeasons ? 8 : 12} className="p-0">
            <Row className="mx-auto mt-3">
              <small className={styles.course_codes}>
                {course.course_code ? course.course_code : ''}
                {course.section
                  ? ' ' +
                    (course.section.length > 1 ? '' : '0') +
                    course.section
                  : ''}
              </small>
            </Row>
          </Col>
          {/* Season tag */}
          {multiSeasons && (
            <Col xs={4} className="p-0">
              <Row className="m-auto">
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 500, hide: 250 }}
                  overlay={season_tooltip}
                >
                  <div
                    className={
                      styles.season_tag +
                      ' ml-auto px-1 pb-0 ' +
                      tag_styles[seasons[parseInt(season) - 1]]
                    }
                  >
                    <Row className="m-auto">
                      {icon}
                      <small style={{ fontWeight: 550 }}>
                        &nbsp;{"'" + year}
                      </small>
                    </Row>
                  </div>
                </OverlayTrigger>
              </Row>
            </Col>
          )}
        </Row>
        {/* Course Title */}
        <Row className="m-auto">
          <strong className={styles.one_line}>{course.title}</strong>
        </Row>
        <Row className="m-auto justify-content-between">
          <Col xs={7} className="p-0">
            {/* Course Professors */}
            <Row className="m-auto">
              <span className={styles.one_line + ' ' + styles.professors}>
                {course.professor_names.length > 0
                  ? course.professor_names.join(' • ')
                  : 'Professor: TBA'}
              </span>
            </Row>
            {/* Course Times */}
            <Row className="m-auto">
              <small className={styles.one_line + ' ' + styles.small_text}>
                {course.times_summary === 'TBA'
                  ? 'Times: TBA'
                  : course.times_summary}
              </small>
            </Row>
            {/* Course Location */}
            <Row className="m-auto">
              <small className={styles.one_line + ' ' + styles.small_text}>
                {course.locations_summary === 'TBA'
                  ? 'Location: TBA'
                  : course.locations_summary}
              </small>
            </Row>
            {/* Course Skills and Areas */}
            <Row className="m-auto">
              <div className={tag_styles.skills_areas}>
                {course.skills.map((skill) => (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag}
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
                    className={tag_styles.tag}
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
                {/* Render hidden badge as a spacer if no skills/areas */}
                {course.skills.length === 0 && course.areas.length === 0 && (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag}
                    key={key++}
                    style={{
                      color: skillsAreasColors['Hu'],
                      backgroundColor: chroma(skillsAreasColors['Hu'])
                        .alpha(0.16)
                        .css(),
                      opacity: 0,
                    }}
                  >
                    {'Hu'}
                  </Badge>
                )}
              </div>
            </Row>
          </Col>
          <Col xs="auto" className="p-0 d-flex align-items-end">
            <div>
              {/* Class Rating */}
              <OverlayTrigger
                placement="right"
                delay={{ show: 500, hide: 250 }}
                overlay={class_tooltip}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    // Only show eval data when user is signed in
                    className={styles.rating + ' mr-1'}
                    style={{
                      color:
                        course.average_rating && isLoggedIn
                          ? ratingColormap(course.average_rating)
                              .darken()
                              .saturate()
                          : '#cccccc',
                    }}
                  >
                    {course.average_rating && isLoggedIn
                      ? course.average_rating.toFixed(RATINGS_PRECISION)
                      : 'N/A'}
                  </div>
                  <AiFillStar color="#fac000" className="my-auto" />
                </Row>
              </OverlayTrigger>
              {/* Professor Rating */}
              <OverlayTrigger
                placement="right"
                delay={{ show: 500, hide: 250 }}
                overlay={prof_tooltip}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    // Only show eval data when user is signed in
                    className={styles.rating + ' mr-1'}
                    style={{
                      color:
                        course.professor_avg_rating && isLoggedIn
                          ? ratingColormap(course.professor_avg_rating)
                              .darken()
                              .saturate()
                          : '#cccccc',
                    }}
                  >
                    {course.professor_avg_rating && isLoggedIn
                      ? course.professor_avg_rating
                      : 'N/A'}
                  </div>
                  <FaAppleAlt color="#fa6e6e" className="my-auto" />
                </Row>
              </OverlayTrigger>
              {/* Workload Rating */}
              <OverlayTrigger
                placement="right"
                delay={{ show: 500, hide: 250 }}
                overlay={workload_tooltip}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    // Only show eval data when user is signed in
                    className={styles.rating + ' mr-1'}
                    style={{
                      color:
                        course.average_workload && isLoggedIn
                          ? workloadColormap(course.average_workload)
                              .darken()
                              .saturate()
                          : '#cccccc',
                    }}
                  >
                    {course.average_workload && isLoggedIn
                      ? course.average_workload.toFixed(RATINGS_PRECISION)
                      : 'N/A'}
                  </div>
                  <FcReading className="my-auto" />
                </Row>
              </OverlayTrigger>
            </div>
          </Col>
        </Row>
      </SurfaceComponent>
      {/* Bookmark Button */}
      <div className={styles.worksheet_btn}>
        {
          <WorksheetToggleButton
            worksheetView={false}
            crn={course.crn}
            season_code={course.season_code}
            modal={false}
          />
        }
      </div>
      {/* Render conflict icon only when component has been mounted */}
      {mounted && (
        <div className={styles.conflict_error}>
          <CourseConflictIcon course={course} />
        </div>
      )}
      {/* # of FB friens also taking this class. NOT USING RN */}
      {also_taking.length > 0 && 1 === 0 && (
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={renderFBFriendsTooltip}
        >
          <div className={styles.fb_friends}>{also_taking.length}</div>
        </OverlayTrigger>
      )}
    </Col>
  );
};

export default SearchResultsGridItem;
