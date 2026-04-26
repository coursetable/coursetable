import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useShallow } from 'zustand/react/shallow';
import CalendarEvent, {
  BigCalendarGhostFocusWrapper,
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
  type WalkBefore,
} from '../../utilities/calendar';
import stackConcurrentSlotLayout, {
  attachOverlapClusters,
} from '../../utilities/calendarStackLayout';
import {
  getBuildingCodeFromLocation,
  getWalkingMinutes,
} from '../../utilities/walking';
import './react-big-calendar-override.css';

const MAX_WALK_GAP_MINUTES = 30;
const WALK_MODAL_SELECT_SUPPRESSION_MS = 350;
const WALK_MODAL_CLOSE_SUPPRESSION_MS = 600;

const RBC_EVENT_WRAP_STYLE = {
  display: 'flex' as const,
  flexDirection: 'column' as const,
  height: '100%',
};

function promoteWalkBeforeToStackedPrimaries(events: CourseRBCEvent[]) {
  for (const e of events) {
    const cluster = e.overlapCluster;
    if (!cluster || cluster.peers.length < 2) continue;
    const [primary] = cluster.peers;
    if (!primary || primary.walkBefore) continue;
    const donor = cluster.peers.find((p) => p.walkBefore);
    if (donor?.walkBefore) primary.walkBefore = donor.walkBefore;
  }
}

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

  const [walkBeforeByKey, setWalkBeforeByKey] = useState(
    new Map<string, WalkBefore>(),
  );
  const [selectedEvent, setSelectedEvent] = useState<CourseRBCEvent | null>(
    null,
  );
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
    const withWalk =
      showWalkingTimes && walkBeforeByKey.size > 0
        ? parsedCourses.map((event) => {
            const walkBefore = walkBeforeByKey.get(eventKey(event));
            return walkBefore ? { ...event, walkBefore } : event;
          })
        : parsedCourses;
    const clustered = attachOverlapClusters(withWalk);
    promoteWalkBeforeToStackedPrimaries(clustered);
    return clustered;
  }, [parsedCourses, showWalkingTimes, walkBeforeByKey]);
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
  const openCourseModal = useCallback(
    (course: CourseRBCEvent) => {
      setSearchParams((prev) => {
        prev.set(
          'course-modal',
          `${course.listing.course.season_code}-${course.listing.crn}`,
        );
        return prev;
      });
    },
    [setSearchParams],
  );
  const handlePickFromStack = useCallback(
    (picked: CourseRBCEvent, clickEvent: SyntheticEvent) => {
      clickEvent.stopPropagation();
      if (walkModalOpenRef.current) return;
      if (Date.now() < suppressSelectEventUntilRef.current) return;
      setSelectedEvent(picked);
      openCourseModal(picked);
    },
    [openCourseModal],
  );
  const calendarSelected = useMemo(() => {
    if (!selectedEvent) return null;
    const { overlapCluster } = selectedEvent;
    if (!overlapCluster || overlapCluster.peers.length < 2)
      return selectedEvent;
    return overlapCluster.peers[0] ?? selectedEvent;
  }, [selectedEvent]);
  const calendarComponents = useMemo(
    () => ({
      eventWrapper: BigCalendarGhostFocusWrapper,
      event({ event }: { readonly event: CourseRBCEvent }) {
        const cluster = event.overlapCluster;
        if (cluster && cluster.peers.length > 1 && cluster.index > 0)
          return <div style={RBC_EVENT_WRAP_STYLE} aria-hidden />;

        if (cluster && cluster.peers.length > 1 && cluster.index === 0) {
          return (
            <div style={RBC_EVENT_WRAP_STYLE}>
              <CalendarEvent
                event={event}
                stackPeers={cluster.peers}
                onPickStackCourse={handlePickFromStack}
                onWalkModalInteraction={suppressCalendarEventSelection}
              />
            </div>
          );
        }
        return (
          <div style={RBC_EVENT_WRAP_STYLE}>
            <CalendarEvent
              event={event}
              onWalkModalInteraction={suppressCalendarEventSelection}
            />
          </div>
        );
      },
    }),
    [handlePickFromStack, suppressCalendarEventSelection],
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
    (event: CourseRBCEvent, clickEvent: SyntheticEvent<HTMLElement>) => {
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
      openCourseModal(event);
    },
    [openCourseModal],
  );
  return (
    <>
      <Calendar<CourseRBCEvent>
        // Show Mon-Fri
        defaultView="work_week"
        views={['work_week']}
        events={displayEvents}
        // Earliest course time or 8am if no courses
        min={earliest}
        // Latest course time or 6pm if no courses
        max={latest}
        localizer={localizer}
        toolbar={false}
        showCurrentTimeIndicator
        selected={calendarSelected}
        onSelectEvent={handleSelectEvent}
        components={calendarComponents}
        eventPropGetter={eventStyleGetter}
        dayLayoutAlgorithm={stackConcurrentSlotLayout}
        tooltipAccessor={undefined}
      />
      <ColorPickerModal onClose={() => setOpenColorPickerEvent(null)} />
      <WorksheetMoveModal onClose={() => setOpenWorksheetMoveEvent(null)} />
    </>
  );
}
export default WorksheetCalendar;
