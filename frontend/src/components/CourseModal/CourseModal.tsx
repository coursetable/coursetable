import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { IoMdArrowRoundBack, IoIosMore } from 'react-icons/io';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import clsx from 'clsx';

import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import styles from './CourseModal.module.css';
import { TextComponent, LinkLikeText } from '../Typography';
import SkillBadge from '../SkillBadge';
import { suspended } from '../../utilities/display';
import { toSeasonString, truncatedText } from '../../utilities/course';
import { useFerry } from '../../contexts/ferryContext';
import { useUser } from '../../contexts/userContext';
import type { Season, Crn, Listing } from '../../utilities/common';
import { CUR_YEAR } from '../../config';

const extraInfoMap: { [info in Listing['extra_info']]: string } = {
  ACTIVE: 'ACTIVE',
  MOVED_TO_SPRING_TERM: 'MOVED TO SPRING',
  CANCELLED: 'CANCELLED',
  MOVED_TO_FALL_TERM: 'MOVED TO FALL',
  CLOSED: 'CLOSED',
  NUMBER_CHANGED: 'NUMBER CHANGED',
};

function ShareButton({ courseCode }: { readonly courseCode: string }) {
  const copyToClipboard = () => {
    const textToCopy = `${courseCode} -- CourseTable: ${window.location.href}`;
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
      <FaRegShareFromSquare size={20} color="#007bff" />
    </button>
  );
}

function MoreButton({ hide }: { readonly hide: () => void }) {
  const navigate = useNavigate();
  return (
    <DropdownButton
      as="div"
      drop="down"
      title={<IoIosMore size={20} color="#007bff" />}
      variant="none"
      className={styles.moreDropdown}
    >
      <Dropdown.Item eventKey="1">
        <button
          type="button"
          onClick={() => {
            hide();
            navigate('/faq#how_do_i_report_a_data_error');
          }}
        >
          Report an error
        </button>
      </Dropdown.Item>
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
  const [history, setHistory] = useState<Listing[]>([]);
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

  if (!listing) return null;
  const title = `${listing.course_code} ${listing.section.padStart(2, '0')} ${listing.title} | CourseTable`;
  const description = truncatedText(
    listing.description,
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
              <LinkLikeText
                onClick={() => {
                  setHistory(history.slice(0, -1));
                  setView('overview');
                }}
                className={styles.backArrow}
              >
                <IoMdArrowRoundBack size={30} />
              </LinkLikeText>
            )}
            <div>
              <Modal.Title>
                <div className={styles.modalTitle}>
                  {listing.extra_info !== 'ACTIVE' ? (
                    <span className={styles.cancelledText}>
                      {extraInfoMap[listing.extra_info]}{' '}
                    </span>
                  ) : (
                    ''
                  )}
                  {listing.title}{' '}
                  <TextComponent type="tertiary">
                    ({toSeasonString(listing.season_code)})
                  </TextComponent>
                </div>
              </Modal.Title>

              <div className={styles.badges}>
                <p className={styles.courseCodes}>
                  <TextComponent type="tertiary">
                    {listing.all_course_codes.join(' • ')}
                  </TextComponent>
                </p>
                {[...listing.skills, ...listing.areas].map((skill) => (
                  <SkillBadge skill={skill} key={skill} />
                ))}
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
              <ShareButton courseCode={listing.course_code} />
              <MoreButton hide={hide} />
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
              setSearchParams((prev) => {
                prev.set('course-modal', `${l.season_code}-${l.crn}`);
                return prev;
              });
            }}
            listing={listing}
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
