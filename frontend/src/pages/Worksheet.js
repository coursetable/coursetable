import React from 'react';

import { Row, Col, Fade, Spinner } from 'react-bootstrap';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
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

import NoCoursesFound from '../images/no_courses_found.svg';
import ErrorPage from '../components/ErrorPage';

import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import { useWorksheet } from '../worksheetContext';

/**
 * Renders worksheet page
 */

function Worksheet() {
  // Fetch width of window
  const { width } = useWindowDimensions();
  const is_mobile = width < 768;

  const {
    cur_worksheet,
    cur_expand,
    worksheetLoading,
    worksheetError,
    worksheetData,
    course_modal,
    handleCurExpand,
    hideModal,
  } = useWorksheet();

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
  if (worksheetError) {
    console.error(worksheetError);
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
          <Row className={cur_expand === 'list' ? 'mx-0' : 'mx-3 mb-3'}>
            {/* Calendar Component */}
            <Col
              // Width of component depends on if it is expanded or not
              md={cur_expand === 'calendar' ? 12 : 9}
              className={`mt-3 pl-0 ${
                cur_expand === 'calendar' ? 'pr-0 ' : 'pr-3 '
              }${cur_expand === 'list' ? styles.hidden : ''}`}
            >
              <SurfaceComponent
                layer={0}
                className={styles.calendar_style_container}
              >
                <WeekSchedule />
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
              className={`ml-auto px-0 ${
                cur_expand === 'calendar' ? styles.hidden : ''
              }`}
            >
              {/* Expanded List Component */}
              <Fade in={cur_expand === 'list'}>
                <div style={{ display: cur_expand === 'list' ? '' : 'none' }}>
                  <WorksheetExpandedList />
                </div>
              </Fade>
              {/* Default List Component */}
              <Fade in={cur_expand !== 'list'}>
                <div style={{ display: cur_expand !== 'list' ? '' : 'none' }}>
                  <WorksheetList />
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
              <WorksheetAccordion />
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
