import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { Row, Col, Fade, Spinner } from 'react-bootstrap';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import posthog from 'posthog-js';
import { useWorksheetInfo } from '../queries/GetWorksheetListings';
import WeekSchedule from '../components/WeekSchedule';
import WorksheetList from '../components/WorksheetList';
import WorksheetAccordion from '../components/WorksheetAccordion';
import WorksheetExpandedList from '../components/WorksheetExpandedList';
import CourseModal from '../components/CourseModal';
import {
  SurfaceComponent,
  StyledExpandBtn,
} from '../components/StyledComponents';

import styles from './Worksheet.module.css';

import { useUser } from '../user';
import NoCoursesFound from '../images/no_courses_found.svg';
import ErrorPage from '../components/ErrorPage';

import { useSessionStorageState } from '../browserStorage';
import { useWindowDimensions } from '../components/WindowDimensionsProvider';

// Function to sort worksheet courses by course code
const sortByCourseCode = (a, b) => {
  if (a.course_code < b.course_code) return -1;
  return 1;
};

// List of colors for the calendar events
const colors = [
  'rgba(108, 194, 111, ',
  'rgba(202, 95, 83, ',
  'rgba(49, 164, 212, ',
  'rgba(223, 134, 83, ',
  'rgba(38, 186, 154, ',
  'rgba(186, 120, 129, ',
];

/**
 * Renders worksheet page
 */

function Worksheet() {
  // Fetch width of window
  const { width } = useWindowDimensions();
  const is_mobile = width < 768;

  // Get user context data
  const { user } = useUser();
  // Current user who's worksheet we are viewing
  const [fb_person, setFbPerson] = useSessionStorageState('fb_person', 'me');

  // Worksheet of the current person
  const cur_worksheet = useMemo(() => {
    /** @type typeof user.worksheet! */
    const when_not_defined = []; // TODO: change this to undefined
    if (fb_person === 'me') {
      return user.worksheet ?? when_not_defined;
    }
    const friend_worksheets = user.fbWorksheets?.worksheets;
    return friend_worksheets
      ? friend_worksheets[fb_person] ?? when_not_defined
      : when_not_defined;
  }, [user.worksheet, user.fbWorksheets, fb_person]);

  const season_codes = useMemo(() => {
    const season_codes_temp = [];
    if (cur_worksheet) {
      cur_worksheet.forEach((szn) => {
        if (season_codes_temp.indexOf(szn[0]) === -1)
          season_codes_temp.push(szn[0]);
      });
    }
    season_codes_temp.sort();
    season_codes_temp.reverse();
    return season_codes_temp;
  }, [cur_worksheet]);

  // Current season initialized to most recent season
  const [season, setSeason] = useSessionStorageState(
    'season',
    season_codes.length > 0 ? season_codes[0] : ''
  );
  // Determines when to show course modal and for what listing
  const [course_modal, setCourseModal] = useState([false, '']);
  // List of courses that the user has marked hidden
  const [hidden_courses, setHiddenCourses] = useSessionStorageState(
    'hidden_courses',
    {}
  );
  // The current listing that the user is hovering over
  const [hover_course, setHoverCourse] = useState();
  // Currently expanded component (calendar or list or none)
  const [cur_expand, setCurExpand] = useSessionStorageState(
    'cur_expand',
    'none'
  );

  const handleCurExpand = useCallback(
    (view) => {
      setCurExpand(view);
      // Scroll back to top when changing views
      window.scrollTo({ top: 0, left: 0 });
    },
    [setCurExpand]
  );

  const handleFBPersonChange = useCallback(
    (new_person) => {
      setFbPerson(new_person);
    },
    [setFbPerson]
  );

  // Function to change season
  const changeSeason = useCallback(
    (season_code) => {
      posthog.capture('worksheet-season', { new_season: season_code });
      setSeason(season_code);
    },
    [setSeason]
  );

  // Show course modal for the chosen listing
  const showModal = useCallback((listing) => {
    setCourseModal([true, listing]);
  }, []);

  // Hide course modal
  const hideModal = useCallback(() => {
    setCourseModal([false, '']);
  }, []);

  // Hide/Show this course
  const toggleCourse = useCallback(
    (crn) => {
      setHiddenCourses((old_hidden_courses) => {
        const new_hidden_courses = { ...old_hidden_courses };
        if (old_hidden_courses[crn]) new_hidden_courses[crn] = false;
        else new_hidden_courses[crn] = true;
        return new_hidden_courses;
      });
    },
    [setHiddenCourses]
  );

  // Fetch the worksheet info. This is eventually copied into the 'listings' variable.
  const { loading, error, data } = useWorksheetInfo(cur_worksheet, season);

  // Cache calendar colors. Reset whenever the season changes.
  const [colorMap, setColorMap] = useState({});
  useEffect(() => {
    setColorMap({});
  }, [season]);

  // Listings data - basically a color-annotated version of the worksheet info.
  const [listings, setListings] = useState([]);

  // Initialize listings state and color map.
  useEffect(() => {
    if (!loading && !error && cur_worksheet && data) {
      const temp = [...data];
      // Assign color to each course
      for (let i = 0; i < data.length; i++) {
        let choice = colors[i % colors.length];
        if (colorMap[temp[i].crn]) {
          choice = colorMap[temp[i].crn];
        } else {
          colorMap[temp[i].crn] = choice;
        }
        temp[i].color = choice.concat('0.85)');
        temp[i].border = choice.concat('1)');
      }
      // Sort list by course code
      temp.sort(sortByCourseCode);
      setListings(temp);
    }
  }, [loading, error, cur_worksheet, data, setListings, colorMap]);

  const season_listings = listings;

  // If user somehow isn't logged in and worksheet is null
  if (cur_worksheet == null) return <div>Error fetching worksheet</div>;
  // Display no courses page if no courses in worksheet
  if (cur_worksheet.length === 0 && !is_mobile && false) {
    // TODO: remove this part and add an empty state later on.
    // We don't want to prevent a user from seeing their friend's
    // worksheets if they haven't added anything to their own worksheet.
    return (
      <div style={{ height: '93vh', width: '100vw' }} className="d-flex">
        <div className="text-center m-auto">
          <img
            alt="No courses found."
            className="py-5"
            src={NoCoursesFound}
            style={{ width: '25%' }}
          />
          <h3>No courses found</h3>
          <div>Please add courses to your worksheet</div>
        </div>
      </div>
    );
  }
  // Wait for search query to finish
  if (error) {
    console.error(error);
    return (
      <div style={{ height: '93vh', width: '100vw' }} className="d-flex">
        <ErrorPage message="There seems to be an issue with our server" />
      </div>
    );
  }
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
  }
  if (data === undefined) {
    console.error('data is undefined but worksheet is not');
    return (
      <div style={{ height: '93vh', width: '100vw' }} className="d-flex">
        <ErrorPage message="Internal error with course data" />
      </div>
    );
  }
  // TODO: add something for when data.length === 0

  // Button size for expand icons
  const expand_btn_size = 12;

  return (
    <div className={styles.container}>
      {!is_mobile ? (
        /* Desktop View */
        <div className={styles.desktop_container}>
          <Row className={cur_expand === 'list' ? 'm-3' : 'mx-3 mb-3'}>
            {/* Calendar Component */}
            <Col
              // Width of component depends on if it is expanded or not
              md={cur_expand === 'calendar' ? 12 : 9}
              className={`${styles.calendar} mt-3 pl-0 ${
                cur_expand === 'calendar' ? 'pr-0 ' : 'pr-4 '
              }${cur_expand === 'list' ? styles.hidden : ''}`}
            >
              <SurfaceComponent
                layer={0}
                className={styles.calendar_style_container}
              >
                <WeekSchedule
                  showModal={showModal}
                  courses={season_listings}
                  hover_course={hover_course}
                  setHoverCourse={setHoverCourse}
                  hidden_courses={hidden_courses}
                />
                {/* Expand/Compress icons for calendar */}
                <StyledExpandBtn
                  className={`${styles.expand_btn} ${styles.top_right}`}
                >
                  {cur_expand === 'none' ? (
                    <FaExpandAlt
                      className={styles.expand_icon}
                      size={expand_btn_size}
                      style={{ display: 'block' }}
                      onClick={() => {
                        // Expand calendar
                        handleCurExpand('calendar');
                      }}
                    />
                  ) : (
                    <FaCompressAlt
                      className={styles.expand_icon}
                      size={expand_btn_size}
                      onClick={() => {
                        // Compress calendar
                        handleCurExpand('none');
                      }}
                    />
                  )}
                </StyledExpandBtn>
              </SurfaceComponent>
            </Col>
            {/* List Component */}
            <Col
              // Width depends on if it is expanded or not
              md={cur_expand === 'list' ? 12 : 3}
              className={`ml-auto ${
                cur_expand === 'list' ? ' px-2 ' : 'px-0 '
              }${cur_expand === 'calendar' ? styles.hidden : ''}`}
            >
              {/* Expanded List Component */}
              <Fade in={cur_expand === 'list'}>
                <div style={{ display: cur_expand === 'list' ? '' : 'none' }}>
                  <WorksheetExpandedList
                    courses={season_listings}
                    showModal={showModal}
                    cur_expand={cur_expand}
                    cur_season={season}
                    season_codes={season_codes}
                    onSeasonChange={changeSeason}
                    setFbPerson={handleFBPersonChange}
                    fb_person={fb_person}
                    setCurExpand={handleCurExpand}
                  />
                </div>
              </Fade>
              {/* Default List Component */}
              <Fade in={cur_expand !== 'list'}>
                <div style={{ display: cur_expand !== 'list' ? '' : 'none' }}>
                  <WorksheetList
                    courses={season_listings}
                    showModal={showModal}
                    cur_season={season}
                    season_codes={season_codes}
                    onSeasonChange={changeSeason}
                    toggleCourse={toggleCourse}
                    hidden_courses={hidden_courses}
                    setHoverCourse={setHoverCourse}
                    setFbPerson={handleFBPersonChange}
                    cur_person={fb_person}
                    setCurExpand={handleCurExpand}
                  />
                </div>
              </Fade>
            </Col>
          </Row>
        </div>
      ) : (
        /* Mobile View */
        <div>
          <Row className={`${styles.accordion} m-0 p-3`}>
            <Col className="p-0">
              <WorksheetAccordion
                onSeasonChange={changeSeason}
                cur_season={season}
                season_codes={season_codes}
                courses={season_listings}
                showModal={showModal}
                setFbPerson={handleFBPersonChange}
                cur_person={fb_person}
              />
            </Col>
          </Row>
        </div>
      )}
      {/* Course Modal */}
      <CourseModal
        hideModal={hideModal}
        show={course_modal[0]}
        listing={course_modal[1]}
      />
    </div>
  );
}

export default Worksheet;
