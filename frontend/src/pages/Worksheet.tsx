import React from 'react';
import { Row, Col, Fade, Spinner } from 'react-bootstrap';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import * as Sentry from '@sentry/react';
import styled from 'styled-components';
import clsx from 'clsx';

import WorksheetCalendar from '../components/Worksheet/WorksheetCalendar';
import WorksheetCalendarList from '../components/Worksheet/WorksheetCalendarList';
import WorksheetList from '../components/Worksheet/WorksheetList';
import {
  SurfaceComponent,
  StyledExpandBtn,
} from '../components/StyledComponents';
import WorksheetNumDropdown from '../components/Navbar/WorksheetNumberDropdown';
import SeasonDropdown from '../components/Search/SeasonDropdown';
import FriendsDropdown from '../components/Navbar/FriendsDropdown';

import styles from './Worksheet.module.css';

import NoCoursesFound from '../images/no_courses_found.svg';
import ErrorPage from '../components/ErrorPage';

import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import { useWorksheet } from '../contexts/worksheetContext';

const StyledCalendarContainer = styled(SurfaceComponent)`
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};
`;

/**
 * Renders worksheet page
 */

function Worksheet() {
  // Fetch current device
  const { isMobile } = useWindowDimensions();

  const {
    curWorksheet,
    worksheetView,
    worksheetLoading,
    worksheetError,
    handleWorksheetView,
  } = useWorksheet();

  // Display no courses page if no courses in worksheet
  // eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
  if (curWorksheet.length === 0 && !isMobile && false) {
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
  // TODO: add something for when data.length === 0

  // Button size for expand icons
  const expandBtnSize = 12;

  return (
    <div className={styles.container}>
      {!isMobile ? (
        /* Desktop View */
        <div className={styles.desktop_container}>
          <Row className={worksheetView.view === 'list' ? 'mx-0' : 'mx-3 mb-3'}>
            {/* Calendar Component */}
            <Col
              // Width of component depends on if it is expanded or not
              md={
                worksheetView.view === 'calendar' &&
                worksheetView.mode === 'expanded'
                  ? 12
                  : 9
              }
              className={clsx(
                'mt-3 pl-0',
                worksheetView.view === 'calendar' &&
                  worksheetView.mode === 'expanded'
                  ? 'pr-0'
                  : 'pr-3',
                worksheetView.view === 'list' && styles.hidden,
              )}
            >
              <StyledCalendarContainer
                layer={0}
                className={styles.calendar_style_container}
              >
                <WorksheetCalendar />
                {/* Expand/Compress icons for calendar */}
                <StyledExpandBtn
                  className={clsx(styles.expand_btn, styles.top_right)}
                >
                  {worksheetView.view === 'calendar' &&
                  worksheetView.mode !== 'expanded' ? (
                    <FaExpandAlt
                      className={styles.expand_icon}
                      size={expandBtnSize}
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
                      size={expandBtnSize}
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
              md={worksheetView.view === 'list' ? 12 : 3}
              className={clsx(
                'ml-auto px-0',
                worksheetView.view === 'calendar' &&
                  worksheetView.mode === 'expanded' &&
                  styles.hidden,
              )}
            >
              {/* List Component */}
              <Fade in={worksheetView.view === 'list'}>
                <div
                  style={{
                    display: worksheetView.view === 'list' ? '' : 'none',
                  }}
                >
                  {worksheetView.view === 'list' && <WorksheetList />}
                </div>
              </Fade>
              {/* Calendar List Component */}
              <Fade in={worksheetView.view !== 'list'}>
                <div
                  style={{
                    display: worksheetView.view !== 'list' ? '' : 'none',
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
          <Row className={clsx(styles.accordion, 'm-0 p-3')}>
            <Col className="p-0">
              <div className="mobile-calendar-container">
                <div className="mobile-dropdowns">
                  <WorksheetNumDropdown />
                  <Row className={clsx(styles.dropdowns, 'mx-auto')}>
                    <Col xs={6} className="m-0 p-0">
                      <SeasonDropdown />
                    </Col>
                    <Col xs={6} className="m-0 p-0">
                      <FriendsDropdown />
                    </Col>
                  </Row>
                </div>
                <div className="mobile-calendar">
                  <WorksheetCalendar />
                </div>
                <div className="mobile-list">
                  <WorksheetCalendarList />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default Worksheet;
