import React from 'react';

import { Row, Col, Fade, Spinner } from 'react-bootstrap';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import WorksheetCalendar from '../components/Worksheet/WorksheetCalendar';
import WorksheetCalendarList from '../components/Worksheet/WorksheetCalendarList';
import WorksheetMobileCalendar from '../components/Worksheet/WorksheetMobileCalendar';
import WorksheetList from '../components/Worksheet/WorksheetList';
import CourseModal from '../components/CourseModal/CourseModal';
import {
  SurfaceComponent,
  StyledExpandBtn,
} from '../components/StyledComponents';

import styles from './Worksheet.module.css';

import NoCoursesFound from '../images/no_courses_found.svg';
import ErrorPage from '../components/ErrorPage';

import { useWindowDimensions } from '../components/Providers/WindowDimensionsProvider';
import { useWorksheet } from '../contexts/worksheetContext';
import * as Sentry from '@sentry/react';

import styled from 'styled-components';

const StyledCalendarContainer = styled(SurfaceComponent)`
  transition:
    border-color ${({ theme }) => theme.trans_dur},
    background-color ${({ theme }) => theme.trans_dur},
    color ${({ theme }) => theme.trans_dur};
`;

function WorksheetStats() {
  const { courses, hidden_courses, cur_season } = useWorksheet();
  let courseCnt = 0, credits = 0, workload = 0, rating = 0;
  for (const c of courses) {
    if (hidden_courses[cur_season]?.[c.crn]) continue; // just skip hidden courses

    courseCnt += 1;
    credits += c.credits ?? 0;
    workload += c.average_workload ?? 0;
    rating += c.average_rating ?? 0;
  }

  const avgRating = courseCnt === 0 ? 0 : (rating / courseCnt).toFixed(2); // better to calculate not in the jsx

  return (
    <div className={styles.stats}>
      <ul>
        <li>Total courses: {courseCnt}</li>
        <li>Total credits: {credits}</li>
        <li>Total workload: {workload.toFixed(2)}</li>
        <li>Average rating: {avgRating}</li>
      </ul>
    </div>
  );
}

/**
 * Renders worksheet page
 */

function Worksheet() {
  // Fetch current device
  const { isMobile } = useWindowDimensions();

  const {
    cur_worksheet,
    worksheet_view,
    worksheetLoading,
    worksheetError,
    worksheetData,
    course_modal,
    handleWorksheetView,
    hideModal,
  } = useWorksheet();

  // If user somehow isn't logged in and worksheet is null
  if (cur_worksheet == null) return <div>Error fetching worksheet</div>;
  // Display no courses page if no courses in worksheet
  if (cur_worksheet.length === 0 && !isMobile && false) {
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
  if (worksheetError) {
    Sentry.captureException(worksheetError);
    return (
      <div style={{ height: '93vh', width: '100vw' }} className="d-flex">
        <ErrorPage message="There seems to be an issue with our server" />
      </div>
    );
  }
  if (worksheetLoading) {
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
  if (worksheetData === undefined) {
    Sentry.captureException('data is undefined but worksheet is not');
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
      {!isMobile ? (
        /* Desktop View */
        <div className={styles.desktop_container}>
          <Row
            className={worksheet_view.view === 'list' ? 'mx-0' : 'mx-3 mb-3'}
          >
            {/* Calendar Component */}
            <Col
              // Width of component depends on if it is expanded or not
              md={
                worksheet_view.view === 'calendar' &&
                worksheet_view.mode === 'expanded'
                  ? 12
                  : 9
              }
              className={`mt-3 pl-0 ${
                worksheet_view.view === 'calendar' &&
                worksheet_view.mode === 'expanded'
                  ? 'pr-0 '
                  : 'pr-3 '
              }${worksheet_view.view === 'list' ? styles.hidden : ''}`}
            >
              <StyledCalendarContainer
                layer={0}
                className={styles.calendar_style_container}
              >
                <WorksheetCalendar />
                <WorksheetStats />
                {/* Expand/Compress icons for calendar */}
                <StyledExpandBtn
                  className={`${styles.expand_btn} ${styles.top_right}`}
                >
                  {worksheet_view.view === 'calendar' &&
                  worksheet_view.mode !== 'expanded' ? (
                    <FaExpandAlt
                      className={styles.expand_icon}
                      size={expand_btn_size}
                      style={{ display: 'block' }}
                      onClick={() => {
                        // Expand calendar
                        handleWorksheetView({
                          view: 'calendar',
                          mode: 'expanded',
                        });
                      }}
                    />
                  ) : (
                    <FaCompressAlt
                      className={styles.expand_icon}
                      size={expand_btn_size}
                      onClick={() => {
                        // Compress calendar
                        handleWorksheetView({ view: 'calendar', mode: '' });
                      }}
                    />
                  )}
                </StyledExpandBtn>
              </StyledCalendarContainer>
            </Col>
            {/* List Component */}
            <Col
              // Width depends on if it is expanded or not
              md={worksheet_view.view === 'list' ? 12 : 3}
              className={`ml-auto px-0 ${
                worksheet_view.view === 'calendar' &&
                worksheet_view.mode === 'expanded'
                  ? styles.hidden
                  : ''
              }`}
            >
              {/* List Component */}
              <Fade in={worksheet_view.view === 'list'}>
                <div
                  style={{
                    display: worksheet_view.view === 'list' ? '' : 'none',
                  }}
                >
                  {worksheet_view.view === 'list' && <WorksheetList />}
                </div>
              </Fade>
              {/* Calendar List Component */}
              <Fade in={worksheet_view.view !== 'list'}>
                <div
                  style={{
                    display: worksheet_view.view !== 'list' ? '' : 'none',
                  }}
                >
                  <WorksheetCalendarList />
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
              <WorksheetMobileCalendar />
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
