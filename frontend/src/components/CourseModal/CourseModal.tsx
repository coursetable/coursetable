import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import { IoMdArrowRoundBack, IoIosMore } from 'react-icons/io';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';

import { CUR_YEAR } from '../../config';
import { useFerry } from '../../contexts/ferryContext';
import { useUser } from '../../contexts/userContext';
import type { Listings } from '../../generated/graphql-types';
import type { Season, Crn } from '../../queries/graphql-types';
import { extraInfo } from '../../utilities/constants';
import { toSeasonString, truncatedText } from '../../utilities/course';
import { suspended, useCourseModalLink } from '../../utilities/display';
import SkillBadge from '../SkillBadge';
import { TextComponent } from '../Typography';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import styles from './CourseModal.module.css';

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
      (err) => {
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

// We can only split subviews of CourseModal because CourseModal contains core
// logic that determines whether itself is visible.
// Maybe we should split more code into the subviews?
const CourseModalOverview = suspended(() => import('./CourseModalOverview'));
const CourseModalEvaluations = suspended(
  () => import('./CourseModalEvaluations'),
);

function CourseModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { requestSeasons, courses } = useFerry();
  const { user } = useUser();

  const [view, setView] = useState<'overview' | 'evals'>('overview');
  // Stack for listings that the user has viewed
  const [history, setHistory] = useState<CourseModalHeaderData[]>([]);
  useEffect(() => {
    if (history.length !== 0) return;
    const courseModal = searchParams.get('course-modal');
    if (!courseModal) return;
    const [seasonCode, crn] = courseModal.split('-') as [Season, string];
    void requestSeasons([seasonCode]).then(() => {
      const listingFromQuery = courses[seasonCode]?.get(Number(crn) as Crn);
      if (!listingFromQuery) return;
      setHistory([listingFromQuery]);
    });
  }, [history.length, searchParams, requestSeasons, courses]);
  const listing = history[history.length - 1];
  const backTarget = useCourseModalLink(history[history.length - 2]);

  if (!listing) return null;
  const title = `${listing.course_code} ${listing.section.padStart(2, '0')} ${listing.course.title} | CourseTable`;
  const description = truncatedText(
    listing.course.description,
    300,
    'No description available',
  );
  const hide = () => {
    setHistory([]);
    setView('overview');
    setSearchParams((prev) => {
      prev.delete('course-modal');
      return prev;
    });
  };
  return (
    <div className="d-flex justify-content-center">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Modal
        show={Boolean(listing)}
        scrollable
        onHide={hide}
        dialogClassName={styles.dialog}
        animation={false}
        centered
      >
        <Modal.Header className={styles.modalHeader} closeButton>
          <div className={styles.modalTop}>
            {history.length > 1 && (
              <Link
                to={backTarget}
                onClick={() => {
                  setHistory(history.slice(0, -1));
                  setView('overview');
                }}
                className={styles.backArrow}
              >
                <IoMdArrowRoundBack size={30} />
              </Link>
            )}
            <div>
              <Modal.Title>
                <div className={styles.modalTitle}>
                  {listing.course.extra_info !== 'ACTIVE' ? (
                    <span className={styles.cancelledText}>
                      {extraInfo[listing.course.extra_info]}{' '}
                    </span>
                  ) : (
                    ''
                  )}
                  {listing.course.title}{' '}
                  <TextComponent type="tertiary">
                    ({toSeasonString(listing.season_code)})
                  </TextComponent>
                </div>
              </Modal.Title>

              <div className={styles.badges}>
                <p className={styles.courseCodes}>
                  <TextComponent type="tertiary">
                    {listing.course.listings
                      .map((l) => l.course_code)
                      .join(' • ')}
                  </TextComponent>
                </p>
                {[...listing.course.skills, ...listing.course.areas].map(
                  (skill) => (
                    <SkillBadge skill={skill} key={skill} />
                  ),
                )}
              </div>
            </div>
          </div>
          <div className={styles.modalControls}>
            <ViewTabs
              tabs={[
                { label: 'Overview', value: 'overview' },
                {
                  label: 'Evaluations',
                  value: 'evals',
                  // Don't show eval tab if it's current year or no auth
                  hidden:
                    CUR_YEAR.includes(listing.season_code) || !user.hasEvals,
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
        </Modal.Header>
        {view === 'overview' ? (
          <CourseModalOverview
            gotoCourse={(l) => {
              user.hasEvals ? setView('evals') : setView('overview');
              if (
                l.crn === listing.crn &&
                l.season_code === listing.season_code
              )
                return;
              setHistory([...history, l]);
            }}
            header={listing}
          />
        ) : (
          <CourseModalEvaluations
            seasonCode={listing.season_code}
            crn={listing.crn}
          />
        )}
      </Modal>
    </div>
  );
}

export default CourseModal;
