import { useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
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
import WorksheetMap from '../components/Worksheet/WorksheetMap';
import WorksheetNumDropdown from '../components/Worksheet/WorksheetNumberDropdown';
import WorksheetStats from '../components/Worksheet/WorksheetStats';

import { parseCoursesFromURL } from '../slices/WorksheetSlice';
import { useStore } from '../store';
import styles from './Worksheet.module.css';

const SHOW_WALKING_TIMES_STORAGE_KEY = 'worksheet-calendar-show-walking-times';

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
  const [showWalkingTimes, setShowWalkingTimes] = useState(() => {
    if (typeof window === 'undefined') return true;
    const savedPreference = window.localStorage.getItem(
      SHOW_WALKING_TIMES_STORAGE_KEY,
    );
    if (savedPreference === null) return true;
    return savedPreference !== '0' && savedPreference !== 'false';
  });
  const emptyMissingBuildingCodes = useMemo(() => new Set<string>(), []);

  useEffect(() => {
    const exoticWorksheet = parseCoursesFromURL();
    useStore.setState({ exoticWorksheet });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      SHOW_WALKING_TIMES_STORAGE_KEY,
      showWalkingTimes ? '1' : '0',
    );
  }, [showWalkingTimes]);

  // Wait for search query to finish
  if (worksheetError) {
    Sentry.captureException(worksheetError);
    return <ErrorPage message="There seems to be an issue with our server" />;
  }
  if (worksheetLoading) return <Spinner message="Loading worksheet data..." />;
  // For unauthed users, they can only view exotic worksheets
  if (authStatus === 'unauthenticated' && !isExoticWorksheet)
    return <NeedsLogin redirect="/worksheet" message="your worksheet" />;
  if (worksheetView === 'map') return <WorksheetMap />;
  if (worksheetView === 'list' && !isMobile) return <WorksheetList />;
  const LockIcon = isCalendarViewLocked ? FaLock : FaUnlock;
  const lockLabel = isCalendarViewLocked ? 'Unlock view' : 'Lock view';

  const FullScreenIcon = expanded ? FaCompressAlt : FaExpandAlt;
  const fullScreenLabel = expanded ? 'Compress calendar' : 'Expand calendar';

  // Mobile list view - show dropdowns and list
  if (worksheetView === 'list' && isMobile) {
    return (
      <>
        {!isExoticWorksheet && (
          <div className={styles.mobileListDropdowns}>
            <WorksheetNumDropdown mobile />
            <div className="d-flex">
              <SeasonDropdown mobile />
              <FriendsDropdown mobile />
            </div>
          </div>
        )}
        <WorksheetList />
      </>
    );
  }

  // Calendar view (default)
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
        <WorksheetCalendar showWalkingTimes={showWalkingTimes} />
        {!isMobile && (
          <div className={styles.calendarControls}>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="worksheet-fullscreen-tooltip">
                  {fullScreenLabel} + new buttons! (beta)
                </Tooltip>
              }
            >
              <button
                type="button"
                className={styles.controlsTrigger}
                onClick={() => setExpanded((x) => !x)}
                aria-label={fullScreenLabel}
              >
                <FullScreenIcon className={styles.triggerIcon} size={11} />
                <span className={styles.betaIndicator} aria-hidden="true" />
              </button>
            </OverlayTrigger>

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
          <WorksheetCalendarList
            highlightBuilding={null}
            showLocation={false}
            showMissingLocationIcon={false}
            controlsMode="full"
            missingBuildingCodes={emptyMissingBuildingCodes}
            hideTooltipContext="calendar"
            showWalkingTimes={showWalkingTimes}
            onShowWalkingTimesChange={setShowWalkingTimes}
          />
        </div>
      )}
      <CalendarLockSettingsModal />
    </div>
  );
}

export default Worksheet;
