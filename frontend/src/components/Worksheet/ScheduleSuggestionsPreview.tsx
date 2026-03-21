import type { CSSProperties } from 'react';
import clsx from 'clsx';
import { Alert, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';
import chroma from 'chroma-js';
import { Calendar } from 'react-big-calendar';

import { formatCredits } from './scheduleSuggestionsUtils';
import { localizer, type CourseRBCEvent } from '../../utilities/calendar';
import styles from './ScheduleSuggestionsPreview.module.css';

function excludeTooltipId(event: CourseRBCEvent) {
  return `exclude-${event.listing.crn}-${event.start.getTime()}-${event.end.getTime()}`;
}

function ScheduleSuggestionEventBody({
  event,
}: {
  readonly event: CourseRBCEvent;
}) {
  const textColor =
    chroma.contrast(event.color, 'white') > 2 ? 'white' : 'black';
  const durationMin =
    (event.end.getTime() - event.start.getTime()) / (1000 * 60);
  const isShortClass = durationMin < 75;

  return (
    <div
      className={clsx(
        styles.suggestionEventInner,
        isShortClass && styles.suggestionEventInnerShort,
      )}
      style={{ color: textColor }}
    >
      <strong className={styles.suggestionEventCode}>{event.title}</strong>
      {!isShortClass && <br />}
      <span className={styles.suggestionEventTitle}>{event.description}</span>
      {!isShortClass && (
        <small className={styles.suggestionEventLoc}>{event.location}</small>
      )}
    </div>
  );
}

function ScheduleSuggestionEvent({
  event,
  fixedListingCrns,
  onExcludeCourse,
}: {
  readonly event: CourseRBCEvent;
  readonly fixedListingCrns: ReadonlySet<number>;
  readonly onExcludeCourse: (courseCode: string) => void;
}) {
  const isFixedListing = fixedListingCrns.has(event.listing.crn);
  const tooltipId = excludeTooltipId(event);

  return (
    <div className={styles.eventWrapper}>
      {!isFixedListing && (
        <div className={styles.excludeButtonWrapper}>
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip id={tooltipId} {...props}>
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
        <ScheduleSuggestionEventBody event={event} />
      </div>
    </div>
  );
}

type ScheduleSuggestionsPreviewProps = {
  readonly addedCourseLabels: readonly string[];
  readonly selectedIndex: number;
  readonly totalSchedules: number;
  readonly credits: number | undefined;
  readonly events: CourseRBCEvent[];
  readonly earliest: Date;
  readonly latest: Date;
  readonly eventStyleGetter: (event: CourseRBCEvent) => {
    style: CSSProperties;
  };
  readonly fixedListingCrns: ReadonlySet<number>;
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
  fixedListingCrns,
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
                event: ({ event }: { readonly event: CourseRBCEvent }) => (
                  <ScheduleSuggestionEvent
                    event={event}
                    fixedListingCrns={fixedListingCrns}
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
