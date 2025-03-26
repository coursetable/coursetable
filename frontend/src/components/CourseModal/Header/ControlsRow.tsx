import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  DropdownButton,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import { IoIosMore } from 'react-icons/io';
import { toast } from 'react-toastify';

import { CUR_YEAR } from '../../../config';
import { useModalHistory } from '../../../contexts/modalHistoryContext';
import type { CourseModalPrefetchListingDataFragment } from '../../../generated/graphql-types';
import WorksheetToggleButton from '../../Worksheet/WorksheetToggleButton';
import styles from './ControlsRow.module.css';

function ShareButton({
  listing,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
}) {
  const copyToClipboard = () => {
    const params = new URLSearchParams(window.location.search);
    const url = `${window.location.origin}${window.location.pathname}${
      params.has('course-modal') ? `?${params.toString()}` : ''
    }`;
    const textToCopy = `${listing.course_code} -- CourseTable: ${url}`;

    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast.success('Course and URL copied to clipboard!');
      },
      (err: unknown) => {
        console.error('Error copying to clipboard: ', err);
      },
    );
  };

  return (
    <button
      type="button"
      className={styles.shareButton}
      onClick={copyToClipboard}
      aria-label="Share"
    >
      <FaRegShareFromSquare size={20} />
    </button>
  );
}

function MoreButton({
  listing,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
}) {
  const { closeModal } = useModalHistory();
  return (
    <DropdownButton
      as="div"
      drop="down"
      title={<IoIosMore size={20} />}
      variant="none"
      className={styles.moreDropdown}
    >
      <Dropdown.Item
        as={Link}
        to="/faq#how_do_i_report_a_data_error"
        onClick={closeModal}
      >
        Report an error
      </Dropdown.Item>
      <Dropdown.Item
        href={`https://courses.yale.edu/?details&srcdb=${listing.course.season_code}&crn=${listing.crn}`}
        target="_blank"
        rel="noreferrer"
      >
        Open in Yale Course Search
      </Dropdown.Item>
      <Dropdown.Item
        href={`https://ivy.yale.edu/course-stats/course/courseDetail?termCode=${listing.course.season_code}&courseNumber=${listing.course_code.split(' ')[1]!}&subjectCode=${encodeURIComponent(listing.course_code.split(' ')[0]!)}`}
        target="_blank"
        rel="noreferrer"
      >
        Open Course Demand Statistics
      </Dropdown.Item>
      {!CUR_YEAR.includes(listing.course.season_code) && (
        <Dropdown.Item
          href={`https://oce.app.yale.edu/ocedashboard/studentViewer/courseSummary?termCode=${listing.course.season_code}&crn=${listing.crn}`}
          target="_blank"
          rel="noreferrer"
        >
          Open in OCE
        </Dropdown.Item>
      )}
    </DropdownButton>
  );
}

type Tab = {
  readonly label: string;
  readonly value: 'overview' | 'evals';
  readonly disabled?: boolean;
};

function ViewTabs({
  currentTab,
  tabs,
  onSelectTab,
}: {
  readonly currentTab: Tab['value'];
  readonly tabs: Tab[];
  readonly onSelectTab: (value: Tab['value']) => void;
}) {
  return (
    <div className={styles.tabs}>
      {tabs.map(({ label, value, disabled }) => {
        if (disabled) {
          return (
            <OverlayTrigger
              key={value}
              placement="top"
              overlay={(props) => (
                <Tooltip {...props} id="popover-disabled-tab">
                  This course has no evaluations to show.
                </Tooltip>
              )}
            >
              <span className={clsx(styles.tabButton, styles.tabDisabled)}>
                {label}
              </span>
            </OverlayTrigger>
          );
        }
        return (
          <button
            key={value}
            aria-current={currentTab === value}
            type="button"
            onClick={() => onSelectTab(value)}
            className={clsx(
              styles.tabButton,
              currentTab === value && styles.tabSelected,
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function ModalHeaderControls({
  listing,
  view,
  setView,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
  readonly view: 'overview' | 'evals';
  readonly setView: (value: 'overview' | 'evals') => void;
}) {
  return (
    <div className={styles.modalControls}>
      <ViewTabs
        tabs={[
          { label: 'Overview', value: 'overview' },
          {
            label: 'Evaluations',
            value: 'evals',
            // Don't show eval tab if there are no responses to show
            disabled: !listing.course.evaluation_statistic,
          },
        ]}
        onSelectTab={setView}
        currentTab={view}
      />
      <div className={styles.toolBar}>
        <WorksheetToggleButton listing={listing} modal />
        <ShareButton listing={listing} />
        <MoreButton listing={listing} />
      </div>
    </div>
  );
}
