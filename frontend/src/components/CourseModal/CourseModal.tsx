import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import { FaRegShareFromSquare } from 'react-icons/fa6';
import { IoMdArrowRoundBack, IoIosMore } from 'react-icons/io';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';

import { CUR_YEAR } from '../../config';
import { useFerry } from '../../contexts/ferryContext';
import type { Option } from '../../contexts/searchContext';
import type {
  CourseSectionsQuery,
  Listings,
} from '../../generated/graphql-types';
import { useCourseSectionsQuery } from '../../queries/graphql-queries';
import type { Season, Crn, Weekdays } from '../../queries/graphql-types';
import { useStore } from '../../store';
import { extraInfo } from '../../utilities/constants';
import {
  abbreviateWorkdays,
  to12HourTime,
  toSeasonDate,
  toSeasonString,
  truncatedText,
} from '../../utilities/course';
import { suspended, createCourseModalLink } from '../../utilities/display';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
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

function getSectionData(
  section: CourseSectionsQuery['listings'][number],
  hasDifferentTitles: boolean,
) {
  const times = new Map<string, Set<Weekdays>>();
  for (const [day, info] of Object.entries(section.course.times_by_day)) {
    for (const [startTime, endTime] of info) {
      const timespan = `${to12HourTime(startTime)}-${to12HourTime(endTime)}`;
      if (!times.has(timespan)) times.set(timespan, new Set());
      times.get(timespan)!.add(day as Weekdays);
    }
  }
  const timeString = [...times.entries()]
    .map(
      ([timespan, days]) =>
        `${abbreviateWorkdays([...days]).join('')} ${timespan}`,
    )
    .join(', ');
  const professors =
    section.course.course_professors
      .map((professor) => professor.professor.name)
      .join(' ') || 'TBA';
  return {
    value: section.section.padStart(2, '0'),
    label: hasDifferentTitles ? (
      <span title={section.course.title}>
        <b>{section.section.padStart(2, '0')}</b>{' '}
        {truncatedText(section.course.title, 40, '')}
        <br />
        <small>
          {professors}
          {timeString ? ' - ' : ''}
          {timeString}
        </small>
      </span>
    ) : (
      <span>
        <b>{section.section.padStart(2, '0')}</b>{' '}
        <small>
          {professors}
          {timeString ? ' - ' : ''}
          {timeString}
        </small>
      </span>
    ),
  };
}

function SectionsDropdown({
  listing,
  sections,
  onSelect,
}: {
  readonly listing: CourseModalHeaderData;
  readonly sections: CourseSectionsQuery['listings'];
  readonly onSelect: (option: Option | null) => void;
}) {
  const hasDifferentTitles =
    new Set(sections.map((section) => section.course.title)).size > 1;
  const sectionsOptions: Map<string, Option> = new Map<string, Option>(
    // @ts-expect-error: TODO it actually works to have a ReactNode as label
    sections.map((section) => [
      section.section,
      getSectionData(section, hasDifferentTitles),
    ]),
  );
  return (
    <Popout
      buttonText="Sections"
      selectedOptions={sectionsOptions.get(listing.section)}
      clearIcon={false}
      className={styles.sectionsDropdown}
    >
      <PopoutSelect<Option, false>
        value={sectionsOptions.get(listing.section)}
        options={[...sectionsOptions.values()]}
        onChange={onSelect}
        isSearchable={false}
        showControl={false}
      />
    </Popout>
  );
}

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
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const [view, setView] = useState<'overview' | 'evals'>('overview');
  // Stack for listings that the user has viewed
  const [history, setHistory] = useState<CourseModalHeaderData[]>([]);
  // This will update when history updates
  const listing = history[history.length - 1];
  const courseCode = listing?.course_code;
  const season = listing?.season_code;
  const { data, loading, error } = useCourseSectionsQuery({
    variables: {
      course_code: courseCode || '',
      season: season || '',
    },
    skip: !courseCode || !season,
  });
  const sections =
    loading || error || !data?.listings
      ? []
      : [...data.listings].sort((a, b) =>
          a.section.localeCompare(b.section, 'en-US', { numeric: true }),
        );
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

  const backTarget = createCourseModalLink(
    history[history.length - 2],
    searchParams,
  );

  if (!listing) return null;

  const title = `${listing.course_code} ${listing.section.padStart(2, '0')}: ${listing.course.title} - Yale ${toSeasonString(listing.season_code)} | CourseTable`;
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
  const structuredJSON = JSON.stringify({
    '@context': 'https://schema.org/',
    name: { title },
    description: { description },
    datePublished: toSeasonDate(listing.season_code),
  });
  return (
    <div className="d-flex justify-content-center">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <script className="structured-data-list" type="application/ld+json">
          {structuredJSON}
        </script>
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
                <SectionsDropdown
                  listing={listing}
                  sections={sections}
                  onSelect={(selectedSection) => {
                    const newSection = sections.find(
                      (section) =>
                        `0${section.section}` === selectedSection!.value,
                    );
                    setHistory([...history.slice(0, -1), newSection!]);
                    navigate(createCourseModalLink(newSection, searchParams));
                  }}
                />
                <p className={styles.courseCodes}>
                  <TextComponent type="tertiary">
                    {listing.course.listings.map((l, i) => (
                      <React.Fragment key={l.crn}>
                        {i > 0 && ' • '}
                        {l.crn === listing.crn ? (
                          // Make current listing appear more important in case
                          // of cross-listings; otherwise other links are
                          // underlined and are more prominent than this one
                          listing.course.listings.length > 1 ? (
                            <b>{l.course_code}</b>
                          ) : (
                            l.course_code
                          )
                        ) : (
                          <Link
                            className={styles.crossListingLink}
                            to={createCourseModalLink(
                              { crn: l.crn, season_code: listing.season_code },
                              searchParams,
                            )}
                            // We replace instead of pushing to history. I don't
                            // think navigating between cross-listings should be
                            // treated as an actual navigation
                            onClick={() => {
                              setHistory([
                                ...history.slice(0, -1),
                                { ...listing, ...l },
                              ]);
                            }}
                          >
                            {l.course_code}
                          </Link>
                        )}
                      </React.Fragment>
                    ))}
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
            onNavigation={(l, goToEvals) => {
              user.hasEvals && goToEvals
                ? setView('evals')
                : setView('overview');
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
