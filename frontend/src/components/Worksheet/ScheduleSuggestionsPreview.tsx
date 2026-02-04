import type { CSSProperties } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Calendar } from 'react-big-calendar';

import { CalendarEventBody } from './CalendarEvent';
import { formatCredits } from './scheduleSuggestionsUtils';
import { localizer, type RBCEvent } from '../../utilities/calendar';
import styles from './ScheduleSuggestionsPreview.module.css';

type ScheduleSuggestionsPreviewProps = {
  readonly addedCourseLabels: readonly string[];
  readonly selectedIndex: number;
  readonly totalSchedules: number;
  readonly credits: number | undefined;
  readonly events: RBCEvent[];
  readonly earliest: Date;
  readonly latest: Date;
  readonly eventStyleGetter: (event: RBCEvent) => { style: CSSProperties };
  readonly onPrevious: () => void;
  readonly onNext: () => void;
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
  onPrevious,
  onNext,
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
              components={{
                event: ({ event }: { readonly event: RBCEvent }) => (
                  <CalendarEventBody event={event} />
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
