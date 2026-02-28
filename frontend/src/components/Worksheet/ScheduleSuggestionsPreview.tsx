import type { CSSProperties } from 'react';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';
import { Calendar } from 'react-big-calendar';

import { CalendarEventBody } from './CalendarEvent';
import { formatCredits } from './scheduleSuggestionsUtils';
import { localizer, type RBCEvent } from '../../utilities/calendar';
import styles from './ScheduleSuggestionsPreview.module.css';

function ScheduleSuggestionEvent({
  event,
  worksheetCourseCodes,
  onExcludeCourse,
}: {
  readonly event: RBCEvent;
  readonly worksheetCourseCodes: ReadonlySet<string>;
  readonly onExcludeCourse: (courseCode: string) => void;
}) {
  const isWorksheetCourse = worksheetCourseCodes.has(event.listing.course_code);

  return (
    <div className={styles.eventWrapper}>
      {!isWorksheetCourse && (
        <div className={styles.excludeButtonWrapper}>
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip id={`exclude-${event.listing.crn}`} {...props}>
                Exclude course
              </Tooltip>
            )}
          >
            <button
              type="button"
              className={styles.excludeButton}
              onClick={(e) => {
                e.stopPropagation();
                onExcludeCourse(event.listing.course_code);
              }}
              aria-label="Exclude course"
            >
              <MdClose size={10} />
            </button>
          </OverlayTrigger>
        </div>
      )}
      <div className={styles.eventContent}>
        <CalendarEventBody event={event} compact />
      </div>
    </div>
  );
}

type ScheduleSuggestionsPreviewProps = {
  readonly addedCourseLabels: readonly string[];
  readonly selectedIndex: number;
  readonly totalSchedules: number;
  readonly credits: number | undefined;
  readonly events: RBCEvent[];
  readonly earliest: Date;
  readonly latest: Date;
  readonly eventStyleGetter: (event: RBCEvent) => { style: CSSProperties };
  readonly worksheetCourseCodes: ReadonlySet<string>;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onCourseClick: (listing: {
    crn: number;
    course: { season_code: string };
  }) => void;
  readonly onExcludeCourse: (courseCode: string) => void;
};

export default function ScheduleSuggestionsPreview({
  addedCourseLabels,
  selectedIndex,
  totalSchedules,
  credits,
  events,
  earliest,
  latest,
  eventStyleGetter,
  worksheetCourseCodes,
  onPrevious,
  onNext,
  onCourseClick,
  onExcludeCourse,
}: ScheduleSuggestionsPreviewProps) {
  return (
    <>
      <div className={styles.addedRow}>
        <div className={styles.addedSummary}>
          <strong>New:</strong>{' '}
          {addedCourseLabels.length ? addedCourseLabels.join(', ') : 'None'}
        </div>
        <div className={styles.scheduleNav}>
          <Button
            variant="primary"
            size="sm"
            onClick={onPrevious}
            disabled={selectedIndex <= 0}
          >
            Previous
          </Button>

          <div className={styles.scheduleCount}>
            Schedule {selectedIndex + 1} of {totalSchedules}
            {credits !== undefined && (
              <span className={styles.credits}>
                {' '}
                · {formatCredits(credits)} credits
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onNext}
            disabled={selectedIndex >= totalSchedules - 1}
          >
            Next
          </Button>
        </div>
      </div>

      <div className={styles.calendarWrapper}>
        <div className={styles.calendarViewport}>
          {events.length === 0 ? (
            <Alert variant="info" className="mb-0">
              This schedule has no listed meeting times.
            </Alert>
          ) : (
            <Calendar
              defaultView="work_week"
              views={['work_week']}
              events={events}
              min={earliest}
              max={latest}
              localizer={localizer}
              toolbar={false}
              showCurrentTimeIndicator={false}
              onSelectEvent={(event) => onCourseClick(event.listing)}
              components={{
                event: ({ event }: { readonly event: RBCEvent }) => (
                  <ScheduleSuggestionEvent
                    event={event}
                    worksheetCourseCodes={worksheetCourseCodes}
                    onExcludeCourse={onExcludeCourse}
                  />
                ),
              }}
              eventPropGetter={eventStyleGetter}
              tooltipAccessor={undefined}
              className={styles.calendar}
            />
          )}
        </div>
      </div>
    </>
  );
}
