// Src/pages/Worksheet.tsx
import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import { useShallow } from 'zustand/react/shallow';

import NeedsLogin from './NeedsLogin';
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

import { useStore } from '../store';
import {
  useEnumeration,
  type CourseWithTime,
} from '../utilities/useEnumeration';
import styles from './Worksheet.module.css';

function Worksheet() {
  // 1) Always call store hooks & local hooks up top
  const {
    isMobile,
    authStatus,
    worksheetLoading,
    worksheetError,
    worksheetView,
    isExoticWorksheet,
    enumerationMode,
    setEnumState,
  } = useStore(
    useShallow((state) => ({
      isMobile: state.isMobile,
      authStatus: state.authStatus,
      worksheetLoading: state.worksheetLoading,
      worksheetError: state.worksheetError,
      worksheetView: state.worksheetView,
      isExoticWorksheet: state.isExoticWorksheet,
      enumerationMode: state.enumerationMode,
      setEnumState: state.setEnumState,
    })),
  );
  const [expanded, setExpanded] = useState(false);

  console.log('enumerationMode:', enumerationMode);

  // 3) Always call the enumeration hook, passing fallback courses
  const {
    currentCombo,
    currentIndex,
    totalCombos,
    handleNext,
    handlePrevious,
  } = useEnumeration(4);

  console.log(
    'Enumeration results: currentIndex=',
    currentIndex,
    ' totalCombos=',
    totalCombos,
  );
  console.log('currentCombo size:', currentCombo?.length);

  // 4) Sync enumeration info to the store (so the navbar can read it)
  useEffect(() => {
    console.log('Setting enumeration data in global store');
    setEnumState(handleNext, handlePrevious, currentIndex, totalCombos);
  }, [handleNext, handlePrevious, currentIndex, totalCombos, setEnumState]);

  // 5) Decide what to actually render
  let content: React.ReactNode;

  if (worksheetError) {
    Sentry.captureException(worksheetError);
    content = (
      <ErrorPage message="There seems to be an issue with our server" />
    );
  } else if (worksheetLoading) {
    content = <Spinner message="Loading worksheet data..." />;
  } else if (authStatus === 'unauthenticated' && !isExoticWorksheet()) {
    content = <NeedsLogin redirect="/worksheet" message="your worksheet" />;
  } else if (worksheetView === 'list' && !isMobile) {
    content = <WorksheetList />;
  } else {
    const Icon = expanded ? FaCompressAlt : FaExpandAlt;
    const coursesForCalendar =
      enumerationMode && currentCombo ? currentCombo : undefined;
    console.log('coursesForCalendar length:', coursesForCalendar?.length);

    content = (
      <>
        <SurfaceComponent className={styles.calendar}>
          <WorksheetCalendar coursesOverride={coursesForCalendar} />
          {!isMobile && (
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={`${expanded ? 'Collapse' : 'Expand'} calendar`}
            >
              <Icon className={styles.expandIcon} size={12} />
            </button>
          )}
        </SurfaceComponent>
        {(isMobile || !expanded) && (
          <div className={styles.calendarSidebar}>
            <WorksheetStats />
            <WorksheetCalendarList />
          </div>
        )}
      </>
    );
  }

  // 6) Return a stable wrapper
  return <div className={styles.container}>{content}</div>;
}

export default Worksheet;
