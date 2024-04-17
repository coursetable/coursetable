import React, { useState } from 'react';
import * as Sentry from '@sentry/react';
import clsx from 'clsx';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';

import ErrorPage from '../components/ErrorPage';
import Spinner from '../components/Spinner';
import { SurfaceComponent } from '../components/Typography';
import FriendsDropdown from '../components/Worksheet/FriendsDropdown';
import SeasonDropdown from '../components/Worksheet/SeasonDropdown';
import WorksheetCalendar from '../components/Worksheet/WorksheetCalendar';
import WorksheetCalendarList from '../components/Worksheet/WorksheetCalendarList';
import WorksheetList from '../components/Worksheet/WorksheetList';
import WorksheetNumDropdown from '../components/Worksheet/WorksheetNumberDropdown';
import WorksheetStats from '../components/Worksheet/WorksheetStats';

import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import { useWorksheet } from '../contexts/worksheetContext';
import styles from './Worksheet.module.css';

function WorksheetMobile() {
  return (
    <div className={styles.container}>
      <div>
        <WorksheetNumDropdown mobile />
        <div className={styles.subDropdowns}>
          <SeasonDropdown mobile />
          <FriendsDropdown mobile />
        </div>
        <SurfaceComponent className={styles.calendar}>
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
        <div className={styles.container}>
          <SurfaceComponent className={styles.calendar}>
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
    return <ErrorPage message="There seems to be an issue with our server" />;
  }
  if (worksheetLoading) return <Spinner />;

  return !isMobile ? <WorksheetDesktop /> : <WorksheetMobile />;
}

export default Worksheet;
