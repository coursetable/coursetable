import React, { useState } from 'react';

import { FetchWorksheet } from '../queries/GetWorksheetListings';
import { Row, Col, Fade, Spinner } from 'react-bootstrap';
import WeekSchedule from '../components/WeekSchedule';
import WorksheetList from '../components/WorksheetList';
import WorksheetAccordion from '../components/WorksheetAccordion';
import WorksheetExpandedList from '../components/WorksheetExpandedList';
import CourseModal from '../components/CourseModal';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import styles from './Worksheet.module.css';

import { useUser } from '../user';
import { isInWorksheet } from '../utilities';
import NoCoursesFound from '../images/no_courses_found.svg';
import ServerError from '../images/server_error.svg';

/**
 * Renders worksheet page
 */

function Worksheet() {
  // Get user context data
  const { user } = useUser();
  // Current user who's worksheet we are viewing
  const [fb_person, setFbPerson] = useState('me');
  const handleFBPersonChange = (new_person) => {
    // Reset listings data when changing FB person
    setListings([]);
    setInitWorksheet(
      new_person === 'me'
        ? user.worksheet
        : user.fbWorksheets.worksheets[new_person]
    );
    setFbPerson(new_person);
  };
  // Worksheet of the current person
  const cur_worksheet =
    fb_person === 'me'
      ? user.worksheet
      : user.fbWorksheets.worksheets[fb_person];
  // List of season codes
  let season_codes = [];
  // Populates season_codes list and also updates the most recent season
  const updateRecentSeason = (populate_season_codes, season_code = null) => {
    let recentSeason = '200903';
    if (cur_worksheet) {
      cur_worksheet.forEach((szn) => {
        if (szn[0] !== season_code && szn[0] > recentSeason)
          recentSeason = szn[0];
        if (populate_season_codes && season_codes.indexOf(szn[0]) === -1)
          season_codes.push(szn[0]);
      });
    }
    return recentSeason;
  };
  // Sort season codes from most to least recent
  season_codes.sort();
  season_codes.reverse();
  // Current season initialized to most recent season
  const [season, setSeason] = useState(updateRecentSeason(true));
  // Listings data to be fetched from database
  const [listings, setListings] = useState([]);
  // Store the initial worksheet to be cached on the first listings query
  const [init_worksheet, setInitWorksheet] = useState(
    cur_worksheet ? cur_worksheet : []
  );
  // Determines when to show course modal and for what listing
  const [course_modal, setCourseModal] = useState([false, '']);
  // List of courses that the user has marked hidden
  const [hidden_courses, setHiddenCourses] = useState([]);
  // The current listing that the user is hovering over
  const [hover_course, setHoverCourse] = useState();
  // Which component (calendar or list or none) is the user hovering over. Determines which side gets the expand button
  const [hover_expand, setHoverExpand] = useState('none');
  // Currently expanded component (calendar or list or none)
  const [cur_expand, setCurExpand] = useState('none');
  // Reverse flex direction if list view is being expanded
  const [rev_flex_direction, setRevFlexDirection] = useState(false);
  // Fade animation has started
  const [start_fade, setStartFade] = useState(false);
  // Fade animation has ended
  const [end_fade, setEndFade] = useState(false);

  // Function to change season
  const changeSeason = (season_code) => {
    setSeason(season_code);
  };

  // Function to switch to most recent season if user has just removed the last course of this season
  const hasSeason = (season_code, crn) => {
    // Return if not removing course from this season
    if (season_code !== season) return;
    // Iterate through courses in worksheet
    for (let i = 0; i < cur_worksheet.length; i++) {
      // Return if other courses exist in this season
      if (
        cur_worksheet[i][0] === season &&
        cur_worksheet[i][1] !== crn.toString()
      )
        return;
    }
    // No more courses in this season, so switch to most recent
    changeSeason(updateRecentSeason(false, season_code));
  };

  // Show course modal for the chosen listing
  const showModal = (listing) => {
    setCourseModal([true, listing]);
  };

  // Hide course modal
  const hideModal = () => {
    setCourseModal([false, '']);
    setHoverExpand(cur_expand);
  };

  // Check to see if this course is hidden
  const isHidden = (season_code, crn) => {
    for (let i = 0; i < hidden_courses.length; i++) {
      if (hidden_courses[i][0] === season_code && hidden_courses[i][1] === crn)
        return i;
    }
    return -1;
  };

  // Hide/Show this course
  const toggleCourse = (season_code, crn, hidden) => {
    // Hide course
    if (!hidden) {
      setHiddenCourses([...hidden_courses, [season_code, crn]]);
    }
    // Show course
    else {
      let temp = [...hidden_courses];
      temp.splice(isHidden(season_code, crn), 1);
      setHiddenCourses(temp);
    }
  };

  // Function to sort worksheet courses by course code
  const sortByCourseCode = (a, b) => {
    if (a.course_code < b.course_code) return -1;
    return 1;
  };

  // Perform search query to fetch listing data for each worksheet course
  // Only performs search query once with the initial worksheet and then caches the result
  // This prevents the need to perform another search query and render "loading..." when removing a course
  const { loading, error, data } = FetchWorksheet(init_worksheet);

  // If user somehow isn't logged in and worksheet is null
  if (cur_worksheet == null) return <div>Error fetching worksheet</div>;
  // Display no courses page if no courses in worksheet
  if (cur_worksheet.length === 0)
    return (
      <div style={{ height: '93vh', width: '100vw' }} className="d-flex">
        <div className="text-center m-auto">
          <img
            alt="No courses found."
            className="py-5"
            src={NoCoursesFound}
            style={{ width: '25%' }}
          ></img>
          <h3>No courses found</h3>
          <div>Please add courses to your worksheet</div>
        </div>
      </div>
    );
  // Wait for search query to finish
  if (loading) {
    return (
      <div style={{ height: '93vh' }}>
        <Spinner
          className={styles.loading_spinner}
          animation="border"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (error) {
    return (
      <div style={{ height: '93vh', width: '100vw' }} className="d-flex">
        <div className="text-center m-auto">
          <img
            alt="No courses found."
            className="py-5"
            src={ServerError}
            style={{ width: '25%' }}
          ></img>
          <h3>There seems to be an issue with our server</h3>
          <div>
            Please file a <NavLink to="/feedback">report</NavLink> to let us
            know
          </div>
        </div>
      </div>
    );
  }
  // Error with query
  if (data === undefined || !data.length) return <div>Error with Query</div>;
  // List of colors for the calendar events
  const colors = [
    'rgba(108, 194, 111, ',
    'rgba(202, 95, 83, ',
    'rgba(49, 164, 212, ',
    'rgba(223, 134, 83, ',
    'rgba(38, 186, 154, ',
    'rgba(186, 120, 129, ',
  ];

  // Initialize listings state if haven't already
  if (!listings.length) {
    let temp = [...data];
    // Assign color to each course
    for (let i = 0; i < data.length; i++) {
      temp[i].color = colors[i % colors.length];
    }
    // Sort list by course code
    temp.sort(sortByCourseCode);
    setListings(temp);
  }

  // Holds the courses that are in the worksheet and in this current season
  // The listings list might have courses that have been removed from the worksheet because we don't fetch listings data again
  // So we need to filter for only the course that are in the worksheet as well as by season
  let season_listings = [];
  listings.forEach((listing) => {
    if (
      listing.season_code === season &&
      isInWorksheet(listing.season_code, listing.crn.toString(), cur_worksheet)
    ) {
      // Set hidden key of each listing
      listing.hidden = isHidden(listing.season_code, listing.crn) !== -1;
      season_listings.push(listing);
    }
  });

  // Button size for expand icons
  const expand_btn_size = 18;

  return (
    <div className={styles.container}>
      {/* Desktop View */}
      <div className="d-none d-md-block">
        <Row
          className={'m-4 ' + (rev_flex_direction ? 'flex-wrap-reverse' : '')}
        >
          {/* Calendar Component */}
          <Col
            // Width of componenet depends on if it is expanded or not
            md={cur_expand === 'calendar' ? 12 : 9}
            className={
              styles.calendar +
              ' m-0 p-0 ' +
              (rev_flex_direction
                ? styles.calendar_hidden
                : styles.calendar_expand) +
              ' ' +
              (cur_expand === 'list' ? styles.hidden + ' ' : '') +
              (cur_expand === 'calendar' ? styles.delay : '')
            }
            // Show hover icon
            onMouseEnter={() => setHoverExpand('calendar')}
            // Hide hover icon
            onMouseLeave={() => setHoverExpand('none')}
            // Start fade into expanded list when the calendar has finished transitioning out of view
            onTransitionEnd={(e) => {
              // console.log(e.propertyName);
              if (
                e.propertyName === 'transform' &&
                !start_fade &&
                cur_expand === 'list'
              )
                setStartFade(true);
            }}
          >
            <WeekSchedule
              showModal={showModal}
              courses={season_listings}
              hover_course={hover_course}
              setHoverCourse={setHoverCourse}
            />
            {/* Expand/Compress icons for calendar */}
            <Fade in={hover_expand === 'calendar'}>
              <div style={{ zIndex: 420 }}>
                {cur_expand === 'none' ? (
                  <FaExpandAlt
                    className={styles.expand_btn + ' ' + styles.top_right}
                    size={expand_btn_size}
                    onClick={() => {
                      // Expand calendar
                      setCurExpand('calendar');
                      // Normal flex direction so calendar doesn't wrap under list
                      setRevFlexDirection(false);
                    }}
                  />
                ) : (
                  <FaCompressAlt
                    className={styles.expand_btn + ' ' + styles.top_right}
                    size={expand_btn_size}
                    onClick={() => {
                      // Compress calendar
                      setCurExpand('none');
                      // Show hover icons for list because that is where mouse will end up
                      setHoverExpand('list');
                    }}
                  />
                )}
              </div>
            </Fade>
          </Col>
          {/* List Component*/}
          <Col
            // Width depends on if it is expanded or not
            md={cur_expand === 'list' ? 12 : 3}
            className={
              styles.table +
              ' pl-4 ml-auto ' +
              (rev_flex_direction ? styles.table_expand : styles.table_hidden) +
              ' ' +
              (cur_expand === 'list' ? styles.delay + ' pr-4 ' : 'pr-0 ') +
              (cur_expand === 'calendar' ? styles.hidden : '')
            }
            // Show hover icon
            onMouseEnter={() => setHoverExpand('list')}
            // Hide hover icon
            onMouseLeave={() => setHoverExpand('none')}
            // Once fade into expanded list ends, set end_fade to true
            onTransitionEnd={(e) => {
              // console.log(e.propertyName);
              if (
                e.propertyName === 'flex-basis' &&
                !end_fade &&
                cur_expand === 'list'
              )
                setEndFade(true);
            }}
          >
            {/* Expanded List Component */}
            <Fade in={start_fade}>
              <div style={{ display: start_fade ? '' : 'none' }}>
                <WorksheetExpandedList
                  courses={season_listings}
                  showModal={showModal}
                  end_fade={end_fade}
                  cur_season={season}
                  season_codes={season_codes}
                  onSeasonChange={changeSeason}
                  setFbPerson={handleFBPersonChange}
                  fb_person={fb_person}
                  hasSeason={hasSeason}
                />
              </div>
            </Fade>
            {/* Default List Component */}
            <Fade in={!start_fade}>
              <div style={{ display: !start_fade ? '' : 'none' }}>
                <WorksheetList
                  courses={season_listings}
                  showModal={showModal}
                  cur_season={season}
                  season_codes={season_codes}
                  onSeasonChange={changeSeason}
                  toggleCourse={toggleCourse}
                  setHoverCourse={setHoverCourse}
                  setFbPerson={handleFBPersonChange}
                  cur_person={fb_person}
                  hasSeason={hasSeason}
                />
              </div>
            </Fade>
            {/* Expand/Compress Icons for list */}
            <Fade in={hover_expand === 'list'}>
              <div style={{ zIndex: 420 }}>
                {cur_expand === 'none' ? (
                  <FaExpandAlt
                    className={styles.expand_btn + ' ' + styles.top_left}
                    size={expand_btn_size}
                    onClick={() => {
                      // Expand the list component
                      setCurExpand('list');
                      // Reverse the flex direction, so the list component doesnt wrap under the calendar component
                      setRevFlexDirection(true);
                    }}
                  />
                ) : (
                  <FaCompressAlt
                    className={styles.expand_btn + ' ' + styles.top_left}
                    size={expand_btn_size}
                    onClick={() => {
                      // Compress the list component
                      setCurExpand('none');
                      // Show hover icons for calendar because that is where mouse will end up
                      setHoverExpand('calendar');
                      // Reset fade states
                      if (start_fade === true) setStartFade(false);
                      if (end_fade === true) setEndFade(false);
                    }}
                  />
                )}
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
      {/* Mobile View */}
      <div className="d-md-none">
        <Row className={styles.accordion + ' m-0 p-3'}>
          <Col className="p-0">
            <WorksheetAccordion
              onSeasonChange={changeSeason}
              cur_season={season}
              season_codes={season_codes}
              courses={season_listings}
              hasSeason={hasSeason}
              showModal={showModal}
              setFbPerson={handleFBPersonChange}
              cur_person={fb_person}
            />
          </Col>
        </Row>
      </div>
      {/* Course Modal */}
      <CourseModal
        hideModal={hideModal}
        show={course_modal[0]}
        listing={course_modal[1]}
        hasSeason={hasSeason}
      />
    </div>
  );
}

export default Worksheet;
