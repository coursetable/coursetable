import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import { Calendar, type SlotInfo } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useShallow } from 'zustand/react/shallow';
import CalendarEvent, {
  type WalkModalInteraction,
  useEventStyle,
} from './CalendarEvent';
import {
  ColorPickerModal,
  WorksheetMoveModal,
} from './WorksheetItemActionsButton';
import { useStore } from '../../store';
import {
  localizer,
  getCalendarEvents,
  type CourseRBCEvent,
  type CustomRBCEvent,
  type WalkBefore,
  type WorksheetCalendarEvent,
} from '../../utilities/calendar';
import {
  getBuildingCodeFromLocation,
  getWalkingMinutes,
} from '../../utilities/walking';
import './react-big-calendar-override.css';

const MAX_WALK_GAP_MINUTES = 30;
const WALK_MODAL_SELECT_SUPPRESSION_MS = 350;
const WALK_MODAL_CLOSE_SUPPRESSION_MS = 600;
const CUSTOM_EVENT_DURATION_MINUTES = 30;
const CUSTOM_EVENT_LABEL = 'Custom Event';

type WorksheetCalendarProps = {
  readonly showWalkingTimes?: boolean;
};

type WalkPair = {
  minutes: number;
  gapMinutes: number;
  fromCode: string;
  toCode: string;
  previousEvent: CourseRBCEvent;
  nextEvent: CourseRBCEvent;
};

type EventCluster = {
  start: Date;
  end: Date;
  events: CourseRBCEvent[];
};

function findFarthestWalkPair(
  previousEvents: CourseRBCEvent[],
  nextEvents: CourseRBCEvent[],
): WalkPair | null {
  let best: WalkPair | null = null;
  for (const previous of previousEvents) {
    const fromCode = getBuildingCodeFromLocation(previous.location);
    if (!fromCode) continue;
    for (const next of nextEvents) {
      const gapMinutes =
        (next.start.getTime() - previous.end.getTime()) / 60000;
      if (gapMinutes < 0 || gapMinutes > MAX_WALK_GAP_MINUTES) continue;
      const toCode = getBuildingCodeFromLocation(next.location);
      if (!toCode) continue;
      const minutes = getWalkingMinutes(fromCode, toCode);
      if (minutes === null || minutes <= 0) continue;
      if (!best || minutes > best.minutes) {
        best = {
          minutes,
          gapMinutes,
          fromCode,
          toCode,
          previousEvent: previous,
          nextEvent: next,
        };
      }
    }
  }
  return best;
}

function eventKey(event: CourseRBCEvent) {
  return `${event.listing.crn}-${event.start.getTime()}-${event.end.getTime()}`;
}

function getMinutesSinceMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function toTimeInputValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function applyTimeToDate(baseDate: Date, timeValue: string) {
  const [hours, minutes] = timeValue.split(':');
  const next = new Date(baseDate);
  next.setHours(Number(hours), Number(minutes), 0, 0);
  return next;
}

function buildWalkBeforeMap(events: CourseRBCEvent[]): Map<string, WalkBefore> {
  const byDay = new Map<number, CourseRBCEvent[]>();
  for (const event of events) {
    const day = event.start.getDay();
    const dayEvents = byDay.get(day) ?? [];
    dayEvents.push(event);
    byDay.set(day, dayEvents);
  }

  const walkBeforeMap = new Map<string, WalkBefore>();
  for (const dayEvents of byDay.values()) {
    const sorted = [...dayEvents].sort(
      (a, b) =>
        a.start.getTime() - b.start.getTime() ||
        a.end.getTime() - b.end.getTime(),
    );

    const clusters: EventCluster[] = [];
    let current: EventCluster | null = null;

    for (const event of sorted) {
      if (!current) {
        current = { start: event.start, end: event.end, events: [event] };
        continue;
      }

      if (event.start < current.end) {
        current.events.push(event);
        if (event.end > current.end) current.end = event.end;
        continue;
      }

      clusters.push(current);
      current = { start: event.start, end: event.end, events: [event] };
    }

    if (current) clusters.push(current);

    for (let i = 0; i < clusters.length - 1; i += 1) {
      const previous = clusters[i]!;
      const next = clusters[i + 1]!;
      const gapMinutes =
        (next.start.getTime() - previous.end.getTime()) / 60000;
      if (gapMinutes < 0 || gapMinutes > MAX_WALK_GAP_MINUTES) continue;

      const farthest = findFarthestWalkPair(previous.events, next.events);
      if (!farthest) continue;

      walkBeforeMap.set(eventKey(farthest.nextEvent), {
        minutes: farthest.minutes,
        gapMinutes: farthest.gapMinutes,
        fromCode: farthest.fromCode,
        toCode: farthest.toCode,
        fromClass: {
          courseCode: farthest.previousEvent.title,
          courseTitle: farthest.previousEvent.description,
          location: farthest.previousEvent.location || farthest.fromCode,
          start: farthest.previousEvent.start,
          end: farthest.previousEvent.end,
          color: farthest.previousEvent.color,
        },
        toClass: {
          courseCode: farthest.nextEvent.title,
          courseTitle: farthest.nextEvent.description,
          location: farthest.nextEvent.location || farthest.toCode,
          start: farthest.nextEvent.start,
          end: farthest.nextEvent.end,
          color: farthest.nextEvent.color,
        },
      });
    }
  }

  return walkBeforeMap;
}

function WorksheetCalendar({
  showWalkingTimes = true,
}: WorksheetCalendarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    courses,
    viewedSeason,
    setOpenColorPickerEvent,
    setOpenWorksheetMoveEvent,
    isCalendarViewLocked,
    calendarLockStart,
    calendarLockEnd,
  } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      viewedSeason: state.viewedSeason,
      setOpenColorPickerEvent: state.setOpenColorPickerEvent,
      setOpenWorksheetMoveEvent: state.setOpenWorksheetMoveEvent,
      isCalendarViewLocked: state.isCalendarViewLocked,
      calendarLockStart: state.calendarLockStart,
      calendarLockEnd: state.calendarLockEnd,
    })),
  );
  const eventStyleGetter = useEventStyle();
  const allCourses = useMemo(
    () => getCalendarEvents('rbc', courses, viewedSeason),
    [courses, viewedSeason],
  );
  const { earliest, latest, parsedCourses } = useMemo(() => {
    if (isCalendarViewLocked) {
      const filteredCourses = allCourses.filter((course) => {
        const courseEndHour = course.end.getHours();
        const courseEndMinutes = course.end.getMinutes();
        const courseStartHour = course.start.getHours();

        const endsBeforeStart =
          courseEndHour < calendarLockStart ||
          (courseEndHour === calendarLockStart && courseEndMinutes === 0);

        const startsAfterEnd = courseStartHour >= calendarLockEnd;

        return !endsBeforeStart && !startsAfterEnd;
      });

      return {
        earliest: new Date(0, 0, 0, calendarLockStart),
        latest: new Date(0, 0, 0, calendarLockEnd),
        parsedCourses: filteredCourses,
      };
    }
    if (allCourses.length === 0) {
      return {
        earliest: new Date(0, 0, 0, 8),
        latest: new Date(0, 0, 0, 18),
        parsedCourses: allCourses,
      };
    }
    const earliest = new Date(allCourses[0]!.start);
    const latest = new Date(allCourses[0]!.end);
    earliest.setMinutes(0);
    latest.setMinutes(59);
    for (const c of allCourses) {
      if (c.start.getHours() < earliest.getHours())
        earliest.setHours(c.start.getHours());
      if (c.end.getHours() > latest.getHours())
        latest.setHours(c.end.getHours());
    }
    return { earliest, latest, parsedCourses: allCourses };
  }, [allCourses, isCalendarViewLocked, calendarLockStart, calendarLockEnd]);

  const [walkBeforeByKey, setWalkBeforeByKey] = useState<
    Map<string, WalkBefore>
  >(new Map());
  const [selectedEvent, setSelectedEvent] = useState<CourseRBCEvent | null>(
    null,
  );
  const [customEvents, setCustomEvents] = useState<CustomRBCEvent[]>([]);
  const customEventIdRef = useRef(0);
  const [editingCustomEventId, setEditingCustomEventId] = useState<
    string | null
  >(null);
  const [customEventNameDraft, setCustomEventNameDraft] = useState('');
  const [customEventLocationDraft, setCustomEventLocationDraft] = useState('');
  const [customEventStartDraft, setCustomEventStartDraft] = useState('');
  const [customEventEndDraft, setCustomEventEndDraft] = useState('');
  const [customEventFormError, setCustomEventFormError] = useState<
    string | null
  >(null);
  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      const computed = buildWalkBeforeMap(parsedCourses);
      if (!cancelled) setWalkBeforeByKey(computed);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [parsedCourses]);

  const displayEvents = useMemo(() => {
    if (!showWalkingTimes || walkBeforeByKey.size === 0) return parsedCourses;
    return parsedCourses.map((event) => {
      const walkBefore = walkBeforeByKey.get(eventKey(event));
      return walkBefore ? { ...event, walkBefore } : event;
    });
  }, [parsedCourses, showWalkingTimes, walkBeforeByKey]);
  const hasRangeConflict = useCallback(
    (
      day: number,
      rangeStart: number,
      rangeEnd: number,
      ignoreCustomEventId?: string,
    ) => {
      const overlaps = (start: number, end: number) =>
        start < rangeEnd && end > rangeStart;

      for (const event of parsedCourses) {
        if (event.start.getDay() !== day) continue;
        const classStart = getMinutesSinceMidnight(event.start);
        const classEnd = getMinutesSinceMidnight(event.end);
        if (overlaps(classStart, classEnd)) return true;

        const walkBefore = walkBeforeByKey.get(eventKey(event));
        if (!walkBefore) continue;
        const walkEnd = classStart;
        const walkStart = walkEnd - walkBefore.gapMinutes;
        if (overlaps(walkStart, walkEnd)) return true;
      }

      for (const customEvent of customEvents) {
        if (customEvent.id === ignoreCustomEventId) continue;
        if (customEvent.start.getDay() !== day) continue;
        const customStart = getMinutesSinceMidnight(customEvent.start);
        const customEnd = getMinutesSinceMidnight(customEvent.end);
        if (overlaps(customStart, customEnd)) return true;
      }

      return false;
    },
    [parsedCourses, walkBeforeByKey, customEvents],
  );
  const suppressSelectEventUntilRef = useRef(0);
  const walkModalOpenRef = useRef(false);
  const skipNextSelectEventRef = useRef(false);
  const clearSkipSelectTimeoutRef = useRef<number | null>(null);
  const openCustomEventEditor = useCallback((event: CustomRBCEvent) => {
    setEditingCustomEventId(event.id);
    setCustomEventNameDraft(event.title);
    setCustomEventLocationDraft(event.location);
    setCustomEventStartDraft(toTimeInputValue(event.start));
    setCustomEventEndDraft(toTimeInputValue(event.end));
    setCustomEventFormError(null);
  }, []);
  const closeCustomEventEditor = useCallback(() => {
    setEditingCustomEventId(null);
    setCustomEventFormError(null);
  }, []);
  const createCustomEvent = useCallback(
    (slotStartDate: Date) => {
      const slotStart = new Date(slotStartDate);
      slotStart.setSeconds(0, 0);
      slotStart.setMinutes(
        Math.floor(slotStart.getMinutes() / CUSTOM_EVENT_DURATION_MINUTES) *
          CUSTOM_EVENT_DURATION_MINUTES,
      );
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + CUSTOM_EVENT_DURATION_MINUTES);
      const day = slotStart.getDay();
      const slotStartMinutes = getMinutesSinceMidnight(slotStart);
      const slotEndMinutes = slotStartMinutes + CUSTOM_EVENT_DURATION_MINUTES;
      if (hasRangeConflict(day, slotStartMinutes, slotEndMinutes)) return;

      const customEvent: CustomRBCEvent = {
        kind: 'custom',
        id: `custom-${slotStart.getTime()}-${customEventIdRef.current}`,
        title: CUSTOM_EVENT_LABEL,
        location: '',
        start: slotStart,
        end: slotEnd,
      };
      customEventIdRef.current += 1;
      setCustomEvents((prev) => [...prev, customEvent]);
      openCustomEventEditor(customEvent);
    },
    [hasRangeConflict, openCustomEventEditor],
  );
  const handleSelectSlot = useCallback(
    ({ start, action }: SlotInfo) => {
      if (action === 'doubleClick') return;
      createCustomEvent(start);
    },
    [createCustomEvent],
  );
  useEffect(() => {
    setCustomEvents([]);
    customEventIdRef.current = 0;
    setEditingCustomEventId(null);
  }, [viewedSeason]);
  const editingCustomEvent = useMemo(
    () =>
      customEvents.find((event) => event.id === editingCustomEventId) ?? null,
    [customEvents, editingCustomEventId],
  );
  const saveCustomEventChanges = useCallback(() => {
    if (!editingCustomEvent) return;
    if (!customEventStartDraft || !customEventEndDraft) {
      setCustomEventFormError('Please set both start and end times.');
      return;
    }
    const nextStart = applyTimeToDate(
      editingCustomEvent.start,
      customEventStartDraft,
    );
    const nextEnd = applyTimeToDate(
      editingCustomEvent.start,
      customEventEndDraft,
    );
    if (nextEnd <= nextStart) {
      setCustomEventFormError('End time must be after start time.');
      return;
    }
    const day = nextStart.getDay();
    const nextStartMinutes = getMinutesSinceMidnight(nextStart);
    const nextEndMinutes = getMinutesSinceMidnight(nextEnd);
    if (
      hasRangeConflict(
        day,
        nextStartMinutes,
        nextEndMinutes,
        editingCustomEvent.id,
      )
    ) {
      setCustomEventFormError(
        'Time overlaps another class, walking block, or custom event.',
      );
      return;
    }

    setCustomEvents((prev) =>
      prev.map((event) =>
        event.id === editingCustomEvent.id
          ? {
              ...event,
              title: customEventNameDraft.trim() || CUSTOM_EVENT_LABEL,
              location: customEventLocationDraft.trim(),
              start: nextStart,
              end: nextEnd,
            }
          : event,
      ),
    );
    closeCustomEventEditor();
  }, [
    editingCustomEvent,
    customEventStartDraft,
    customEventEndDraft,
    hasRangeConflict,
    customEventNameDraft,
    customEventLocationDraft,
    closeCustomEventEditor,
  ]);
  const armSelectSuppression = useCallback((durationMs: number) => {
    skipNextSelectEventRef.current = true;
    suppressSelectEventUntilRef.current = Math.max(
      suppressSelectEventUntilRef.current,
      Date.now() + durationMs,
    );
    if (clearSkipSelectTimeoutRef.current)
      window.clearTimeout(clearSkipSelectTimeoutRef.current);
    clearSkipSelectTimeoutRef.current = window.setTimeout(() => {
      skipNextSelectEventRef.current = false;
      clearSkipSelectTimeoutRef.current = null;
    }, durationMs);
  }, []);
  const suppressCalendarEventSelection = useCallback(
    (interaction: WalkModalInteraction) => {
      if (interaction === 'open') walkModalOpenRef.current = true;
      if (interaction === 'close') walkModalOpenRef.current = false;
      const suppressionWindowMs =
        interaction === 'close'
          ? WALK_MODAL_CLOSE_SUPPRESSION_MS
          : WALK_MODAL_SELECT_SUPPRESSION_MS;
      armSelectSuppression(suppressionWindowMs);
      setSelectedEvent(null);
    },
    [armSelectSuppression],
  );
  const calendarComponents = useMemo(
    () => ({
      event({ event }: { readonly event: WorksheetCalendarEvent }) {
        if (event.kind === 'custom') {
          return (
            <div className="ct-custom-event-content">
              <span className="ct-custom-event-title">{event.title}</span>
              <span className="ct-custom-event-meta">
                {event.location || 'Custom Event'}
              </span>
            </div>
          );
        }

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <CalendarEvent
              event={event}
              onWalkModalInteraction={suppressCalendarEventSelection}
            />
          </div>
        );
      },
    }),
    [suppressCalendarEventSelection],
  );
  const calendarEvents = useMemo<WorksheetCalendarEvent[]>(
    () => [...displayEvents, ...customEvents],
    [displayEvents, customEvents],
  );
  useEffect(() => {
    if (!selectedEvent) return;
    const hasSelectedEvent = displayEvents.some(
      (event) =>
        event.listing.crn === selectedEvent.listing.crn &&
        event.start.getTime() === selectedEvent.start.getTime() &&
        event.end.getTime() === selectedEvent.end.getTime(),
    );
    if (!hasSelectedEvent) setSelectedEvent(null);
  }, [displayEvents, selectedEvent]);
  useEffect(() => {
    if (!searchParams.has('course-modal')) setSelectedEvent(null);
  }, [searchParams]);
  useEffect(
    () => () => {
      if (clearSkipSelectTimeoutRef.current)
        window.clearTimeout(clearSkipSelectTimeoutRef.current);
      walkModalOpenRef.current = false;
    },
    [],
  );
  const handleSelectEvent = useCallback(
    (
      event: WorksheetCalendarEvent,
      clickEvent: SyntheticEvent<HTMLElement>,
    ) => {
      if (event.kind === 'custom') {
        openCustomEventEditor(event);
        return;
      }
      if (walkModalOpenRef.current) return;
      const { target } = clickEvent;
      if (
        target instanceof Element &&
        target.closest('[data-walk-modal-trigger="true"]')
      ) {
        setSelectedEvent(null);
        return;
      }
      if (skipNextSelectEventRef.current) {
        skipNextSelectEventRef.current = false;
        if (clearSkipSelectTimeoutRef.current) {
          window.clearTimeout(clearSkipSelectTimeoutRef.current);
          clearSkipSelectTimeoutRef.current = null;
        }
        setSelectedEvent(null);
        return;
      }
      if (Date.now() < suppressSelectEventUntilRef.current) {
        setSelectedEvent(null);
        return;
      }
      setSelectedEvent(event);
      setSearchParams((prev) => {
        prev.set(
          'course-modal',
          `${event.listing.course.season_code}-${event.listing.crn}`,
        );
        return prev;
      });
    },
    [setSearchParams, openCustomEventEditor],
  );
  return (
    <>
      <Calendar
        // Show Mon-Fri
        defaultView="work_week"
        views={['work_week']}
        events={calendarEvents}
        // Earliest course time or 8am if no courses
        min={earliest}
        // Latest course time or 6pm if no courses
        max={latest}
        localizer={localizer}
        toolbar={false}
        selectable="ignoreEvents"
        showCurrentTimeIndicator
        selected={selectedEvent}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        components={calendarComponents}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={undefined}
      />
      <Modal
        show={editingCustomEvent !== null}
        onHide={closeCustomEventEditor}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Custom Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="custom-event-name">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              value={customEventNameDraft}
              onChange={(e) => setCustomEventNameDraft(e.target.value)}
              placeholder={CUSTOM_EVENT_LABEL}
              maxLength={120}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="custom-event-location">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={customEventLocationDraft}
              onChange={(e) => setCustomEventLocationDraft(e.target.value)}
              placeholder="Optional"
              maxLength={120}
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Form.Group className="flex-fill" controlId="custom-event-start">
              <Form.Label>Start</Form.Label>
              <Form.Control
                type="time"
                step={60}
                value={customEventStartDraft}
                onChange={(e) => setCustomEventStartDraft(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="flex-fill" controlId="custom-event-end">
              <Form.Label>End</Form.Label>
              <Form.Control
                type="time"
                step={60}
                value={customEventEndDraft}
                onChange={(e) => setCustomEventEndDraft(e.target.value)}
              />
            </Form.Group>
          </div>
          {customEventFormError && (
            <p className="text-danger mt-3 mb-0">{customEventFormError}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCustomEventEditor}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveCustomEventChanges}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <ColorPickerModal onClose={() => setOpenColorPickerEvent(null)} />
      <WorksheetMoveModal onClose={() => setOpenWorksheetMoveEvent(null)} />
    </>
  );
}
export default WorksheetCalendar;
