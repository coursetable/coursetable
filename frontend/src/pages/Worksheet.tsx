import React, { useState } from 'react';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import * as Sentry from '@sentry/react';
import clsx from 'clsx';

import WorksheetCalendar from '../components/Worksheet/WorksheetCalendar';
import WorksheetCalendarList from '../components/Worksheet/WorksheetCalendarList';
import WorksheetStats from '../components/Worksheet/WorksheetStats';
import WorksheetList from '../components/Worksheet/WorksheetList';
import { SurfaceComponent } from '../components/Typography';
import WorksheetNumDropdown from '../components/Worksheet/WorksheetNumberDropdown';
import SeasonDropdown from '../components/Worksheet/SeasonDropdown';
import FriendsDropdown from '../components/Worksheet/FriendsDropdown';

import styles from './Worksheet.module.css';

import ErrorPage from '../components/ErrorPage';
import Spinner from '../components/Spinner';

import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import { useWorksheet } from '../contexts/worksheetContext';

function WorksheetMobile() {
  return (
    <div className={styles.mobileContainer}>
      <div>
        <WorksheetNumDropdown mobile />
        <div className={styles.subDropdowns}>
          <SeasonDropdown mobile />
          <FriendsDropdown mobile />
        </div>
        <SurfaceComponent className={styles.mobileCalendar}>
          <WorksheetCalendar />
        </SurfaceComponent>
      </div>
      <WorksheetStats />
      <WorksheetCalendarList />
    </div>
  );
}

function WorksheetDesktop() {
  const { worksheetView } = useWorksheet();
  const [expanded, setExpanded] = useState(false);
  switch (worksheetView) {
    case 'list':
      return <WorksheetList />;
    case 'calendar': {
      const Icon = expanded ? FaCompressAlt : FaExpandAlt;
      return (
        <div className={styles.desktopContainer}>
          <SurfaceComponent className={styles.desktopCalendar}>
            <WorksheetCalendar />
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => {
                setExpanded((x) => !x);
              }}
              aria-label={`${expanded ? 'Collapse' : 'Expand'} calendar`}
            >
              <Icon className={styles.expandIcon} size={12} />
            </button>
          </SurfaceComponent>
          {!expanded && (
            <div className={clsx(styles.calendarSidebar)}>
              <WorksheetStats />
              <WorksheetCalendarList />
            </div>
          )}
        </div>
      );
    }
  }
}

function Worksheet() {
  const { isMobile } = useWindowDimensions();
  const { worksheetLoading, worksheetError } = useWorksheet();

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
        <Spinner />
      </div>
    );
  }
  // TODO: add something for when data.length === 0

  return !isMobile ? <WorksheetDesktop /> : <WorksheetMobile />;
}

export default Worksheet;
