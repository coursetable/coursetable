import { useSearchParams } from 'react-router-dom';
import { Alert, Button, Modal } from 'react-bootstrap';

import { useEventStyle } from './CalendarEvent';
import ScheduleSuggestionsControls from './ScheduleSuggestionsControls';
import ScheduleSuggestionsPreview from './ScheduleSuggestionsPreview';
import useScheduleSuggestionsModel, {
  type ScheduleSuggestionsStatus,
} from './useScheduleSuggestionsModel';
import styles from './ScheduleSuggestionsModal.module.css';

type ScheduleSuggestionsModalProps = {
  readonly show: boolean;
  readonly onHide: () => void;
};

function statusAlert(status: ScheduleSuggestionsStatus) {
  switch (status.kind) {
    case 'ok':
      return null;

    case 'no_catalog':
      return (
        <Alert variant="warning" className="mt-3 mb-0">
          Catalog data is unavailable for this season.
        </Alert>
      );

    case 'invalid_credits':
      return (
        <Alert variant="warning" className="mt-3 mb-0">
          Enter a valid credits value.
        </Alert>
      );

    case 'target_below_fixed':
      return (
        <Alert variant="warning" className="mt-3 mb-0">
          Target courses is lower than your current worksheet count.
        </Alert>
      );

    case 'insufficient_eligible':
      return (
        <Alert variant="warning" className="mt-3 mb-0">
          Need to add {status.needed} course{status.needed === 1 ? '' : 's'},
          but only {status.eligible} eligible after exclusions.
        </Alert>
      );

    case 'missing_tags':
      return (
        <Alert variant="warning" className="mt-3 mb-0">
          No eligible courses found.
        </Alert>
      );

    case 'base_conflict':
      return (
        <Alert variant="warning" className="mt-3 mb-0">
          Your current worksheet courses conflict with each other. Resolve those
          conflicts first.
        </Alert>
      );

    case 'no_schedules':
      return (
        <Alert variant="info" className="mt-3 mb-0">
          No schedules matched these settings. Try fewer requirements or
          adjusting exclusions/targets.
        </Alert>
      );

    default:
      return null;
  }
}

export default function ScheduleSuggestionsModal({
  show,
  onHide,
}: ScheduleSuggestionsModalProps) {
  const [, setSearchParams] = useSearchParams();
  const model = useScheduleSuggestionsModel({ show });
  const eventStyleGetter = useEventStyle();

  const alert = statusAlert(model.status);

  const onCourseClick = (listing: {
    crn: number;
    course: { season_code: string };
  }) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('course-modal', `${listing.course.season_code}-${listing.crn}`);
      return next;
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      scrollable
      dialogClassName={styles.dialog}
    >
      <Modal.Header closeButton>
        <Modal.Title>Potential schedules</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {model.catalogLoading ? (
          <Alert variant="info" className="mb-0">
            Loading catalog data...
          </Alert>
        ) : (
          <>
            <ScheduleSuggestionsControls
              targetCoursesInput={model.targetCoursesInput}
              targetCreditsInput={model.targetCreditsInput}
              parsedTargetCredits={model.parsedTargetCredits}
              allAvailableTags={model.allAvailableTags}
              requiredTags={model.requiredTags}
              exclusionOptions={model.exclusionOptions}
              selectedExclusionOptions={model.selectedExclusionOptions}
              menuPortalTarget={model.menuPortalTarget}
              onTargetCoursesInputChange={model.onTargetCoursesInputChange}
              onTargetCoursesBlur={model.onTargetCoursesBlur}
              onTargetCreditsInputChange={model.onTargetCreditsInputChange}
              onTargetCreditsBlur={model.onTargetCreditsBlur}
              onToggleTag={model.onToggleTag}
              onExcludedCourseCodesChange={model.onExcludedCourseCodesChange}
            />

            {alert ?? (
              <ScheduleSuggestionsPreview
                addedCourseLabels={model.addedCourseLabels}
                selectedIndex={model.selectedIndex}
                totalSchedules={model.validSchedulesCount}
                credits={model.currentCredits}
                events={model.events}
                earliest={model.earliest}
                latest={model.latest}
                eventStyleGetter={eventStyleGetter}
                worksheetCourseCodes={model.worksheetCourseCodes}
                onPrevious={model.onPreviousSchedule}
                onNext={model.onNextSchedule}
                onCourseClick={onCourseClick}
                onExcludeCourse={model.onExcludeCourse}
              />
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {model.canRunEnumeration && model.nodesVisited > 0 && (
          <span className={styles.searchMeta}>
            Explored {model.nodesVisited.toLocaleString()} combinations
          </span>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
