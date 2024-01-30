import React from 'react';
import { Row, Col, Fade, Spinner } from 'react-bootstrap';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import * as Sentry from '@sentry/react';
import clsx from 'clsx';

import WorksheetCalendar from '../components/Worksheet/WorksheetCalendar';
import WorksheetCalendarList from '../components/Worksheet/WorksheetCalendarList';
import WorksheetList from '../components/Worksheet/WorksheetList';
import { SurfaceComponent } from '../components/Typography';
import WorksheetNumDropdown from '../components/Worksheet/WorksheetNumberDropdown';
import SeasonDropdown from '../components/Worksheet/SeasonDropdown';
import FriendsDropdown from '../components/Worksheet/FriendsDropdown';

import styles from './Worksheet.module.css';

import ErrorPage from '../components/ErrorPage';

import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import { useWorksheet } from '../contexts/worksheetContext';

/**
 * Renders worksheet page
 */

function Worksheet() {
  // Fetch current device
  const { isMobile } = useWindowDimensions();

  const {
    worksheetView,
    worksheetLoading,
    worksheetError,
    handleWorksheetView,
  } = useWorksheet();

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
          className={styles.loadingSpinner}
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
        <div className={styles.desktopContainer}>
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
              <SurfaceComponent className={styles.calendarContainer}>
                <WorksheetCalendar />
                {/* Expand/Compress icons for calendar */}
                <div className={clsx(styles.expandBtn, styles.topRight)}>
                  {worksheetView.view === 'calendar' &&
                  worksheetView.mode !== 'expanded' ? (
                    <FaExpandAlt
                      className={styles.expandIcon}
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
                      className={styles.expandIcon}
                      size={expandBtnSize}
                      onClick={() => {
                        // Compress calendar
                        handleWorksheetView({ view: 'calendar', mode: '' });
                      }}
                    />
                  )}
                </div>
              </SurfaceComponent>
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
              <div>
                <div>
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
                <div className={styles.mobileCalendar}>
                  <WorksheetCalendar />
                </div>
                <div>
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
