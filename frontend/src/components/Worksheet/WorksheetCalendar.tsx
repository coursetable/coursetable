import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import chroma from 'chroma-js';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useShallow } from 'zustand/react/shallow';
import CalendarEvent, {
  type WalkModalInteraction,
  useEventStyle,
} from './CalendarEvent';
import PersonalBlockModal from './PersonalBlockModal';
import {
  ColorPickerModal,
  WorksheetMoveModal,
} from './WorksheetItemActionsButton';
import { useStore } from '../../store';
import {
  localizer,
  getCalendarEvents,
  getPersonalBlockEvents,
  type WorksheetRBCEvent,
  type CourseRBCEvent,
  type WalkBefore,
} from '../../utilities/calendar';
import { getPersonalBlockConflicts } from '../../utilities/course';
import type { PersonalBlock } from '../../utilities/personalBlock';
import {
  getBuildingCodeFromLocation,
  getWalkingMinutes,
} from '../../utilities/walking';
import './react-big-calendar-override.css';

const MAX_WALK_GAP_MINUTES = 30;
const WALK_MODAL_SELECT_SUPPRESSION_MS = 350;
const WALK_MODAL_CLOSE_SUPPRESSION_MS = 600;

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
  const personalBlocks = useStore((state) =>
    state.worksheetMemo.getIsReadonlyWorksheet(state)
      ? undefined
      : state.worksheetMemo
          .getCurWorksheet(state)
          .get(state.viewedSeason)
          ?.get(state.viewedWorksheetNumber)?.personalBlocks,
  );
  const isReadonlyWorksheet = useStore((state) =>
    state.worksheetMemo.getIsReadonlyWorksheet(state),
  );
  const worksheetNumber = useStore((state) => state.viewedWorksheetNumber);
  const viewedPerson = useStore((state) => state.viewedPerson);
  const user = useStore((state) => state.user);
  // Keep an open editor tied to the worksheet it was opened from.
  const worksheetKey = [
    user?.netId,
    viewedPerson,
    viewedSeason,
    worksheetNumber,
    isReadonlyWorksheet,
  ].join(':');
  const [editor, setEditor] = useState<{
    worksheetKey: string;
    block?: PersonalBlock;
  } | null>(null);
  const eventStyleGetter = useEventStyle();
  const allEvents = useMemo(
    (): WorksheetRBCEvent[] => [
      ...getCalendarEvents('rbc', courses, viewedSeason),
      ...getPersonalBlockEvents(personalBlocks ?? []),
    ],
    [courses, viewedSeason, personalBlocks],
  );
  const { earliest, latest, parsedEvents } = useMemo(() => {
    if (isCalendarViewLocked) {
      const filteredEvents = allEvents.filter((event) => {
        const eventEndHour = event.end.getHours();
        const eventEndMinutes = event.end.getMinutes();
        const eventStartHour = event.start.getHours();

        const endsBeforeStart =
          eventEndHour < calendarLockStart ||
          (eventEndHour === calendarLockStart && eventEndMinutes === 0);

        const startsAfterEnd = eventStartHour >= calendarLockEnd;

        return !endsBeforeStart && !startsAfterEnd;
      });

      return {
        earliest: new Date(0, 0, 0, calendarLockStart),
        latest: new Date(0, 0, 0, calendarLockEnd),
        parsedEvents: filteredEvents,
      };
    }
    if (allEvents.length === 0) {
      return {
        earliest: new Date(0, 0, 0, 8),
        latest: new Date(0, 0, 0, 18),
        parsedEvents: allEvents,
      };
    }
    const earliest = new Date(allEvents[0]!.start);
    const latest = new Date(allEvents[0]!.end);
    earliest.setMinutes(0);
    latest.setMinutes(59);
    for (const event of allEvents) {
      if (event.start.getHours() < earliest.getHours())
        earliest.setHours(event.start.getHours());
      if (event.end.getHours() > latest.getHours())
        latest.setHours(event.end.getHours());
    }
    return { earliest, latest, parsedEvents: allEvents };
  }, [allEvents, isCalendarViewLocked, calendarLockStart, calendarLockEnd]);

  const [walkBeforeByKey, setWalkBeforeByKey] = useState(
    new Map<string, WalkBefore>(),
  );
  const [selectedEvent, setSelectedEvent] = useState<CourseRBCEvent | null>(
    null,
  );
  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      const computed = buildWalkBeforeMap(
        parsedEvents.filter(
          (event): event is CourseRBCEvent => event.kind === 'course',
        ),
      );
      if (!cancelled) setWalkBeforeByKey(computed);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [parsedEvents]);

  const displayEvents = useMemo(() => {
    if (!showWalkingTimes || walkBeforeByKey.size === 0) return parsedEvents;
    return parsedEvents.map((event) => {
      if (event.kind === 'personal') return event;
      const walkBefore = walkBeforeByKey.get(eventKey(event));
      return walkBefore ? { ...event, walkBefore } : event;
    });
  }, [parsedEvents, showWalkingTimes, walkBeforeByKey]);
  const suppressSelectEventUntilRef = useRef(0);
  const walkModalOpenRef = useRef(false);
  const skipNextSelectEventRef = useRef(false);
  const clearSkipSelectTimeoutRef = useRef<number | null>(null);
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
      event: ({ event }: { readonly event: WorksheetRBCEvent }) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {event.kind === 'personal' ? (
            <strong>Personal: {event.title}</strong>
          ) : (
            <>
              {getPersonalBlockConflicts(personalBlocks ?? [], event.listing)
                .length > 0 && (
                <span title="Conflicts with a personal commitment">
                  <BsExclamationTriangleFill aria-hidden="true" /> Personal
                  conflict
                </span>
              )}
              <CalendarEvent
                event={event}
                onWalkModalInteraction={suppressCalendarEventSelection}
              />
            </>
          )}
        </div>
      ),
    }),
    [suppressCalendarEventSelection, personalBlocks],
  );
  useEffect(() => {
    if (!selectedEvent) return;
    const hasSelectedEvent = displayEvents.some(
      (event) =>
        event.kind === 'course' &&
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
    (event: WorksheetRBCEvent, clickEvent: SyntheticEvent<HTMLElement>) => {
      if (event.kind === 'personal') {
        if (!isReadonlyWorksheet)
          setEditor({ worksheetKey, block: event.block });
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
    [setSearchParams, isReadonlyWorksheet, worksheetKey],
  );
  return (
    <>
      {!isReadonlyWorksheet && user && (
        <Button
          size="sm"
          className="mb-2"
          onClick={() => setEditor({ worksheetKey })}
        >
          Add commitment
        </Button>
      )}
      {editor?.worksheetKey === worksheetKey && !isReadonlyWorksheet && (
        <PersonalBlockModal
          key={`${worksheetKey}-${editor.block?.id ?? 'new'}`}
          block={editor.block}
          blocks={personalBlocks ?? []}
          season={viewedSeason}
          worksheetNumber={worksheetNumber}
          onClose={() => setEditor(null)}
        />
      )}
      <Calendar
        // Show Mon-Fri
        defaultView="work_week"
        views={['work_week']}
        events={displayEvents}
        // Include commitments in the visible time range
        min={earliest}
        // Latest event time or 6pm when empty
        max={latest}
        localizer={localizer}
        toolbar={false}
        showCurrentTimeIndicator
        selected={selectedEvent}
        onSelectEvent={handleSelectEvent}
        components={calendarComponents}
        eventPropGetter={(event) =>
          event.kind === 'course'
            ? eventStyleGetter(event)
            : {
                style: {
                  backgroundColor: event.color,
                  color:
                    chroma.contrast(event.color, 'white') > 2
                      ? 'white'
                      : 'black',
                  border: '2px dashed white',
                },
              }
        }
        tooltipAccessor={undefined}
      />
      <ColorPickerModal onClose={() => setOpenColorPickerEvent(null)} />
      <WorksheetMoveModal onClose={() => setOpenWorksheetMoveEvent(null)} />
    </>
  );
}
export default WorksheetCalendar;
