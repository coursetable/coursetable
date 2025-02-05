import { useState } from 'react';
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
import styles from './Worksheet.module.css';

function Worksheet() {
  const {
    isMobile,
    authStatus,
    worksheetLoading,
    worksheetError,
    worksheetView,
    isExoticWorksheet,
  } = useStore(
    useShallow((state) => ({
      isMobile: state.isMobile,
      authStatus: state.authStatus,
      worksheetLoading: state.worksheetLoading,
      worksheetError: state.worksheetError,
      worksheetView: state.worksheetView,
      isExoticWorksheet: state.isExoticWorksheet,
    })),
  );
  const [expanded, setExpanded] = useState(false);

  // Wait for search query to finish
  if (worksheetError) {
    Sentry.captureException(worksheetError);
    return <ErrorPage message="There seems to be an issue with our server" />;
  }
  if (worksheetLoading) return <Spinner message="Loading worksheet data..." />;
  // For unauthed users, they can only view exotic worksheets
  if (authStatus === 'unauthenticated' && !isExoticWorksheet())
    return <NeedsLogin redirect="/worksheet" message="your worksheet" />;
  if (worksheetView === 'list' && !isMobile) return <WorksheetList />;
  const Icon = expanded ? FaCompressAlt : FaExpandAlt;
  return (
    <div className={styles.container}>
      {isMobile && !isExoticWorksheet() && (
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
        )}
      </SurfaceComponent>
      {(isMobile || !expanded) && (
        <div className={styles.calendarSidebar}>
          <WorksheetStats />
          <WorksheetCalendarList />
        </div>
      )}
    </div>
  );
}

export default Worksheet;
