import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useShallow } from 'zustand/react/shallow';
import CalendarEvent, { useEventStyle } from './CalendarEvent';
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
import {
  getBuildingCodeFromLocation,
  getWalkingMinutes,
} from '../../utilities/walking';
import './react-big-calendar-override.css';

const MAX_WALK_GAP_MINUTES = 30;

type WalkPair = {
  minutes: number;
  fromCode: string;
  toCode: string;
  color: string;
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
      if (minutes === null) continue;
      if (!best || minutes > best.minutes) {
        best = {
          minutes,
          fromCode,
          toCode,
          color: next.color,
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

      if (event.start <= current.end) {
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
      if (gapMinutes <= 0 || gapMinutes > MAX_WALK_GAP_MINUTES) continue;

      const farthest = findFarthestWalkPair(previous.events, next.events);
      if (!farthest) continue;

      walkBeforeMap.set(eventKey(farthest.nextEvent), {
        minutes: farthest.minutes,
        gapMinutes,
        fromCode: farthest.fromCode,
        toCode: farthest.toCode,
        color: farthest.color,
      });
    }
  }

  return walkBeforeMap;
}

function WorksheetCalendar() {
  const [, setSearchParams] = useSearchParams();
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
    const allCoursesList = allCourses;
    if (isCalendarViewLocked) {
      const filteredCourses = allCoursesList.filter((course) => {
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
    if (allCoursesList.length === 0) {
      return {
        earliest: new Date(0, 0, 0, 8),
        latest: new Date(0, 0, 0, 18),
        parsedCourses: allCoursesList,
      };
    }
    const earliest = new Date(allCoursesList[0]!.start);
    const latest = new Date(allCoursesList[0]!.end);
    earliest.setMinutes(0);
    latest.setMinutes(59);
    for (const c of allCoursesList) {
      if (c.start.getHours() < earliest.getHours())
        earliest.setHours(c.start.getHours());
      if (c.end.getHours() > latest.getHours())
        latest.setHours(c.end.getHours());
    }
    return { earliest, latest, parsedCourses: allCoursesList };
  }, [allCourses, isCalendarViewLocked, calendarLockStart, calendarLockEnd]);

  const [walkBeforeByKey, setWalkBeforeByKey] = useState<
    Map<string, WalkBefore>
  >(new Map());
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
    if (walkBeforeByKey.size === 0) return parsedCourses;
    return parsedCourses.map((event) => {
      const walkBefore = walkBeforeByKey.get(eventKey(event));
      return walkBefore ? { ...event, walkBefore } : event;
    });
  }, [parsedCourses, walkBeforeByKey]);
  return (
    <>
      <Calendar
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
        onSelectEvent={(event) => {
          setSearchParams((prev) => {
            prev.set(
              'course-modal',
              `${event.listing.course.season_code}-${event.listing.crn}`,
            );
            return prev;
          });
        }}
        components={{
          event: ({ event }: { readonly event: CourseRBCEvent }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <CalendarEvent event={event} />
            </div>
          ),
        }}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={undefined}
      />
      <ColorPickerModal onClose={() => setOpenColorPickerEvent(null)} />
      <WorksheetMoveModal onClose={() => setOpenWorksheetMoveEvent(null)} />
    </>
  );
}
export default WorksheetCalendar;
