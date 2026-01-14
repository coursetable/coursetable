import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import {
  FaLock,
  FaUnlock,
  FaCog,
  FaExpandAlt,
  FaCompressAlt,
} from 'react-icons/fa';
import { useShallow } from 'zustand/react/shallow';

import NeedsLogin from './NeedsLogin';
import ErrorPage from '../components/ErrorPage';
import Spinner from '../components/Spinner';
import { SurfaceComponent } from '../components/Typography';
import CalendarLockSettingsModal from '../components/Worksheet/CalendarLockSettingsModal';
import FriendsDropdown from '../components/Worksheet/FriendsDropdown';
import SeasonDropdown from '../components/Worksheet/SeasonDropdown';
import WorksheetCalendar from '../components/Worksheet/WorksheetCalendar';
import WorksheetCalendarList from '../components/Worksheet/WorksheetCalendarList';
import WorksheetList from '../components/Worksheet/WorksheetList';
import WorksheetNumDropdown from '../components/Worksheet/WorksheetNumberDropdown';
import WorksheetStats from '../components/Worksheet/WorksheetStats';

import { parseCoursesFromURL } from '../slices/WorksheetSlice';
import { useStore } from '../store';
import styles from './Worksheet.module.css';

function Worksheet() {
  const {
    isMobile,
    authStatus,
    worksheetLoading,
    worksheetError,
    worksheetView,
    isExoticWorksheet,
    isCalendarViewLocked,
    setCalendarViewLocked,
    setCalendarLockSettingsOpen,
  } = useStore(
    useShallow((state) => ({
      isMobile: state.isMobile,
      authStatus: state.authStatus,
      worksheetLoading: state.worksheetLoading,
      worksheetError: state.worksheetError,
      worksheetView: state.worksheetView,
      isExoticWorksheet: state.worksheetMemo.getIsExoticWorksheet(state),
      isCalendarViewLocked: state.isCalendarViewLocked,
      setCalendarViewLocked: state.setCalendarViewLocked,
      setCalendarLockSettingsOpen: state.setCalendarLockSettingsOpen,
    })),
  );
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const exoticWorksheet = parseCoursesFromURL();
    useStore.setState({ exoticWorksheet });
  }, []);

  // Wait for search query to finish
  if (worksheetError) {
    Sentry.captureException(worksheetError);
    return <ErrorPage message="There seems to be an issue with our server" />;
  }
  if (worksheetLoading) return <Spinner message="Loading worksheet data..." />;
  // For unauthed users, they can only view exotic worksheets
  if (authStatus === 'unauthenticated' && !isExoticWorksheet)
    return <NeedsLogin redirect="/worksheet" message="your worksheet" />;
  if (worksheetView === 'list' && !isMobile) return <WorksheetList />;
  const LockIcon = isCalendarViewLocked ? FaLock : FaUnlock;
  const lockLabel = isCalendarViewLocked ? 'Unlock view' : 'Lock view';

  const FullScreenIcon = expanded ? FaCompressAlt : FaExpandAlt;
  const fullScreenLabel = expanded ? 'Compress calendar' : 'Expand calendar';

  return (
    <div className={styles.container}>
      {isMobile && !isExoticWorksheet && (
        <div className={styles.dropdowns}>
          <WorksheetNumDropdown mobile />
          <div className="d-flex">
            <SeasonDropdown mobile />
            <FriendsDropdown mobile />
          </div>
        </div>
      )}
      <SurfaceComponent className={styles.calendar}>
        <WorksheetCalendar />
        {!isMobile && (
          <div className={styles.calendarControls}>
            <button
              type="button"
              className={styles.controlsTrigger}
              onClick={() => setExpanded((x) => !x)}
              aria-label={fullScreenLabel}
              title={`${fullScreenLabel} + new buttons! (beta)`}
            >
              <FullScreenIcon className={styles.triggerIcon} size={11} />
              <span className={styles.betaIndicator} aria-hidden="true" />
            </button>

            <div className={styles.controlsMenu}>
              <button
                type="button"
                className={styles.controlBtn}
                onClick={() => setCalendarViewLocked(!isCalendarViewLocked)}
                aria-label={lockLabel}
                title={lockLabel}
              >
                <LockIcon size={11} />
              </button>

              <button
                type="button"
                className={styles.controlBtn}
                onClick={() => setCalendarLockSettingsOpen(true)}
                aria-label="Calendar time range settings"
                title="Calendar time range settings"
              >
                <FaCog size={11} />
              </button>
            </div>
          </div>
        )}
      </SurfaceComponent>
      {(isMobile || !expanded) && (
        <div className={styles.calendarSidebar}>
          <WorksheetStats />
          <WorksheetCalendarList />
        </div>
      )}
      <CalendarLockSettingsModal />
    </div>
  );
}

export default Worksheet;
