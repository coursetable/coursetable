import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import ModalHeaderControls from './Header/ControlsRow';
import ModalHeaderInfo from './Header/InfoRow';
import { useModalHistory } from '../../contexts/modalHistoryContext';
import type { CourseModalPrefetchListingDataFragment } from '../../generated/graphql-types';
import {
  toSeasonDate,
  toSeasonString,
  truncatedText,
} from '../../utilities/course';
import { suspended } from '../../utilities/display';
import styles from './CourseModal.module.css';

// We can only split subviews of CourseModal because CourseModal contains core
// logic that determines whether itself is visible.
// Maybe we should split more code into the subviews?
const OverviewPanel = suspended(() => import('./OverviewPanel/OverviewPanel'));
const EvaluationsPanel = suspended(
  () => import('./EvaluationsPanel/EvaluationsPanel'),
);

export type ModalNavigationFunction = ((
  mode: 'push' | 'replace',
  l: CourseModalPrefetchListingDataFragment,
  target: 'evals' | 'overview',
) => void) &
  ((mode: 'pop', l: undefined, target: 'evals' | 'overview') => void) &
  ((mode: 'change-view', l: undefined, target: 'evals' | 'overview') => void);

function CourseModal({
  listing,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
}) {
  const [view, setView] = useState<'overview' | 'evals'>('overview');
  const { navigate, closeModal } = useModalHistory();

  const title = `${listing.course_code} ${listing.course.section.padStart(2, '0')}: ${listing.course.title} - Yale ${toSeasonString(listing.course.season_code)} | CourseTable`;
  const description = truncatedText(
    listing.course.description,
    300,
    'No description available',
  );
  const structuredJSON = JSON.stringify({
    '@context': 'https://schema.org/',
    name: { title },
    description: { description },
    datePublished: toSeasonDate(listing.course.season_code),
  });

  const onNavigation: ModalNavigationFunction = (mode, l, target) => {
    if (mode === 'pop') {
      setView('overview');
      navigate('pop');
    } else if (mode === 'change-view') {
      setView(target);
    } else {
      const nextView =
        // Only actually navigate to evals if the course has evals
        target === 'evals' && l!.course.evaluation_statistic
          ? 'evals'
          : 'overview';
      setView(nextView);
      if (
        l!.crn === listing.crn &&
        l!.course.season_code === listing.course.season_code
      )
        return;
      navigate(mode, { type: 'course', data: l! });
    }
  };

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
        show
        scrollable
        onHide={closeModal}
        dialogClassName={styles.dialog}
        animation={false}
        centered
      >
        <Modal.Header className={styles.modalHeader} closeButton>
          <ModalHeaderInfo listing={listing} onNavigation={onNavigation} />
          <ModalHeaderControls
            listing={listing}
            view={view}
            setView={setView}
          />
        </Modal.Header>
        <Modal.Body>
          {view === 'overview' ? (
            <OverviewPanel onNavigation={onNavigation} prefetched={listing} />
          ) : (
            <EvaluationsPanel
              seasonCode={listing.course.season_code}
              crn={listing.crn}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CourseModal;
