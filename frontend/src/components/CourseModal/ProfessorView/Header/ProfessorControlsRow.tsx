import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import { IoIosMore } from 'react-icons/io';
import { toast } from 'react-toastify';

import { CUR_YEAR } from '../../../../config';
import type { Listings } from '../../../../generated/graphql-types';
import { useStore } from '../../../../store';
import WorksheetToggleButton from '../../../Worksheet/WorksheetToggleButton';
import styles from './ControlsRow.module.css';

export type CourseModalHeaderData = Pick<
  Listings,
  'season_code' | 'crn' | 'course_code' | 'section'
> & {
  course: Pick<
    Listings['course'],
    | 'title'
    | 'skills'
    | 'areas'
    | 'extra_info'
    | 'description'
    | 'times_by_day'
    | 'same_course_id'
  > & {
    listings: Pick<Listings, 'crn' | 'course_code'>[];
    course_professors: {
      professor: {
        professor_id: number;
      };
    }[];
  };
};

function ShareButton({ listing }: { readonly listing: CourseModalHeaderData }) {
  const copyToClipboard = () => {
    const textToCopy = `${listing.course_code} -- CourseTable: ${window.location.href}`;
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
  hide,
}: {
  readonly listing: CourseModalHeaderData;
  readonly hide: () => void;
}) {
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
        onClick={hide}
      >
        Report an error
      </Dropdown.Item>
      <Dropdown.Item
        href={`https://courses.yale.edu/?details&srcdb=${listing.season_code}&crn=${listing.crn}`}
        target="_blank"
        rel="noreferrer"
      >
        Open in Yale Course Search
      </Dropdown.Item>
      {!CUR_YEAR.includes(listing.season_code) && (
        <Dropdown.Item
          href={`https://oce.app.yale.edu/ocedashboard/studentViewer/courseSummary?termCode=${listing.season_code}&crn=${listing.crn}`}
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
  readonly hidden?: boolean;
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
      {tabs.map(({ label, value, hidden }) => {
        if (hidden) return null;
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
  hide,
}: {
  readonly listing: CourseModalHeaderData;
  readonly view: 'overview' | 'evals';
  readonly setView: (value: 'overview' | 'evals') => void;
  readonly hide: () => void;
}) {
  const user = useStore((state) => state.user);
  return (
    <div className={styles.modalControls}>
      <ViewTabs
        tabs={[
          { label: 'Overview', value: 'overview' },
          {
            label: 'Evaluations',
            value: 'evals',
            // Don't show eval tab if it's current year or no auth
            hidden: CUR_YEAR.includes(listing.season_code) || !user.hasEvals,
          },
        ]}
        onSelectTab={setView}
        currentTab={view}
      />
      <div className={styles.toolBar}>
        <WorksheetToggleButton listing={listing} modal />
        <ShareButton listing={listing} />
        <MoreButton listing={listing} hide={hide} />
      </div>
    </div>
  );
}
