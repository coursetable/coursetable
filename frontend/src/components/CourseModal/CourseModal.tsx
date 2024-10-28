import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import ModalHeaderControls from './Header/ControlsRow';
import ModalHeaderInfo from './Header/InfoRow';
import { useFerry } from '../../contexts/ferryContext';
import type { Listings } from '../../generated/graphql-types';
import type { Season, Crn } from '../../queries/graphql-types';
import { useStore } from '../../store';
import {
  toSeasonDate,
  toSeasonString,
  truncatedText,
} from '../../utilities/course';
import { suspended, createCourseModalLink } from '../../utilities/display';
import styles from './CourseModal.module.css';

// This data contains all the "critical data" that must be prefetched before
// navigation. This ensures the user sees some content rather than a loading
// spinner.
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

// We can only split subviews of CourseModal because CourseModal contains core
// logic that determines whether itself is visible.
// Maybe we should split more code into the subviews?
const OverviewPanel = suspended(() => import('./OverviewPanel/OverviewPanel'));
const EvaluationsPanel = suspended(
  () => import('./EvaluationsPanel/EvaluationsPanel'),
);

export type ModalNavigationFunction = ((
  mode: 'push' | 'replace',
  l: CourseModalHeaderData,
  target: 'evals' | 'overview',
) => void) &
  ((mode: 'pop', l: undefined, target: 'evals' | 'overview') => void);

function CourseModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { requestSeasons, courses } = useFerry();
  const user = useStore((state) => state.user);

  const [view, setView] = useState<'overview' | 'evals'>('overview');
  // Stack for listings that the user has viewed
  const [history, setHistory] = useState<CourseModalHeaderData[]>([]);
  // This will update when history updates
  const listing = history[history.length - 1];
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
  const backTarget =
    history.length > 1
      ? createCourseModalLink(history[history.length - 2], searchParams)
      : undefined;

  if (!listing) return null;
  const title = `${listing.course_code} ${listing.section.padStart(2, '0')}: ${listing.course.title} - Yale ${toSeasonString(listing.season_code)} | CourseTable`;
  const description = truncatedText(
    listing.course.description,
    300,
    'No description available',
  );
  const onNavigation: ModalNavigationFunction = (mode, l, target) => {
    if (!user.hasEvals) setView('overview');
    else setView(target);
    if (mode === 'pop') {
      setHistory(history.slice(0, -1));
    } else {
      if (l!.crn === listing.crn && l!.season_code === listing.season_code)
        return;
      if (mode === 'replace') setHistory([...history.slice(0, -1), l!]);
      else setHistory([...history, l!]);
    }
  };
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
          <ModalHeaderInfo
            listing={listing}
            backTarget={backTarget}
            onNavigation={onNavigation}
          />
          <ModalHeaderControls
            listing={listing}
            view={view}
            setView={setView}
            hide={hide}
          />
        </Modal.Header>
        <Modal.Body>
          {view === 'overview' ? (
            <OverviewPanel onNavigation={onNavigation} header={listing} />
          ) : (
            <EvaluationsPanel
              seasonCode={listing.season_code}
              crn={listing.crn}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CourseModal;
