import { useState } from 'react';
import * as Sentry from '@sentry/react';
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

import { useWorksheet } from '../contexts/worksheetContext';
import { useStore } from '../store';
import styles from './Worksheet.module.css';

// TODO enumerate

function Worksheet() {
  const isMobile = useStore((state) => state.isMobile);
  const { worksheetLoading, worksheetError, worksheetView } = useWorksheet();
  const [expanded, setExpanded] = useState(false);

  // Wait for search query to finish
  if (worksheetError) {
    Sentry.captureException(worksheetError);
    return <ErrorPage message="There seems to be an issue with our server" />;
  }
  if (worksheetLoading) return <Spinner />;
  if (worksheetView === 'list' && !isMobile) return <WorksheetList />;
  // eslint-disable-next-line no-useless-assignment
  const Icon = expanded ? FaCompressAlt : FaExpandAlt;
  return (
    <div className={styles.container}>
      {isMobile && (
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
