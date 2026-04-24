import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  Button,
  Dropdown,
  DropdownButton,
  Form,
  Modal,
  Overlay,
  OverlayTrigger,
  Popover,
  Tooltip,
} from 'react-bootstrap';
import { FaEllipsisH } from 'react-icons/fa';
import { MdDelete, MdEdit, MdMoveToInbox } from 'react-icons/md';
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
import { useWorksheetNumberOptions } from '../../slices/WorksheetSlice';
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
import customEventStyles from './WorksheetCustomEvent.module.css';
import './react-big-calendar-override.css';

const MAX_WALK_GAP_MINUTES = 30;
const WALK_MODAL_SELECT_SUPPRESSION_MS = 350;
const WALK_MODAL_CLOSE_SUPPRESSION_MS = 600;
const CUSTOM_EVENT_DURATION_MINUTES = 30;
const CUSTOM_EVENT_MIN_DURATION_MINUTES = 5;
const CUSTOM_EVENT_RESIZE_STEP_MINUTES = 5;
const CUSTOM_EVENT_LABEL = 'Custom Event';
const CUSTOM_EVENT_DEFAULT_COLOR = '#5f6771';

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

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

type CustomResizeEdge = 'start' | 'end';

type ActiveCustomResize = {
  customEventId: string;
  edge: CustomResizeEdge;
  pointerStartY: number;
  initialStart: Date;
  initialEnd: Date;
  day: number;
  slotHeight: number;
  visibleMinutes: number;
  lastAppliedDelta: number;
};

type CustomEventLine = {
  key: string;
  type: 'title' | 'description' | 'location';
  value: string;
};

function CustomCalendarEventContent({
  event,
  onDelete,
  onOpenColorPicker,
  onOpenMoveModal,
  onResizePointerDown,
}: {
  readonly event: CustomRBCEvent;
  readonly onDelete: (customEventId: string) => void;
  readonly onOpenColorPicker: (customEventId: string) => void;
  readonly onOpenMoveModal: (customEventId: string) => void;
  readonly onResizePointerDown: (
    customEventId: string,
    edge: CustomResizeEdge,
    pointerY: number,
  ) => void;
}) {
  const eventContentRef = useRef<HTMLDivElement | null>(null);
  const actionsButtonRef = useRef<HTMLButtonElement | null>(null);
  const [actionsPopoverOpen, setActionsPopoverOpen] = useState(false);
  const [hideFromLineIndex, setHideFromLineIndex] = useState<number | null>(
    null,
  );
  const isReadonlyWorksheet = useStore((state) =>
    state.worksheetMemo.getIsReadonlyWorksheet(state),
  );
  const lines = useMemo<CustomEventLine[]>(() => {
    const nextLines: CustomEventLine[] = [
      {
        key: 'title',
        type: 'title',
        value: event.title || CUSTOM_EVENT_LABEL,
      },
    ];
    if (event.description.trim()) {
      nextLines.push({
        key: 'description',
        type: 'description',
        value: event.description,
      });
    }
    if (event.location.trim()) {
      nextLines.push({
        key: 'location',
        type: 'location',
        value: event.location,
      });
    }
    return nextLines;
  }, [event.title, event.description, event.location]);

  useLayoutEffect(() => {
    const contentNode = eventContentRef.current;
    if (!contentNode) return undefined;

    let frame = 0;
    const measureLineHeight = (lineNode: HTMLElement) => {
      const clone = lineNode.cloneNode(true) as HTMLElement;
      if (customEventStyles.eventLineHidden)
        clone.classList.remove(customEventStyles.eventLineHidden);
      clone.style.position = 'absolute';
      clone.style.visibility = 'hidden';
      clone.style.pointerEvents = 'none';
      clone.style.left = '0';
      clone.style.top = '0';
      clone.style.width = `${contentNode.clientWidth}px`;
      clone.style.height = 'auto';
      clone.style.maxHeight = 'none';
      clone.style.overflow = 'visible';
      contentNode.appendChild(clone);
      const isHiddenByStyles =
        window.getComputedStyle(clone).display === 'none';
      const { height } = clone.getBoundingClientRect();
      clone.remove();
      if (isHiddenByStyles) return null;
      return Number.isFinite(height) && height > 0 ? height : null;
    };

    const updateVisibleLines = () => {
      const eventLineNodes = Array.from(
        contentNode.querySelectorAll<HTMLElement>('[data-event-line="true"]'),
      );
      if (eventLineNodes.length === 0) return;
      const [titleLineNode] = eventLineNodes;
      if (!titleLineNode) return;

      const availableHeight = contentNode.clientHeight;
      const titleHeight = measureLineHeight(titleLineNode) ?? 0;
      let usedHeight = titleHeight;
      let nextHideFromLine: number | null = null;

      for (const [index, lineNode] of eventLineNodes.entries()) {
        if (index === 0) continue;
        const lineHeight = measureLineHeight(lineNode);
        if (lineHeight === null) continue;
        if (usedHeight + lineHeight <= availableHeight + 0.5) {
          usedHeight += lineHeight;
          continue;
        }
        nextHideFromLine = index;
        break;
      }

      setHideFromLineIndex((prev) =>
        prev === nextHideFromLine ? prev : nextHideFromLine,
      );
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateVisibleLines);
    };

    scheduleUpdate();

    if (typeof ResizeObserver === 'undefined')
      return () => window.cancelAnimationFrame(frame);

    const observer = new ResizeObserver(() => scheduleUpdate());
    observer.observe(contentNode);
    const lineNodes = contentNode.querySelectorAll<HTMLElement>(
      '[data-event-line="true"]',
    );
    for (const lineNode of lineNodes) observer.observe(lineNode);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [lines]);

  return (
    <>
      <div className={customEventStyles.event}>
        <button
          type="button"
          className={clsx(
            customEventStyles.customResizeHandle,
            customEventStyles.customResizeHandleTop,
          )}
          aria-label="Adjust custom event start time"
          onPointerDown={(pointerEvent) => {
            pointerEvent.preventDefault();
            pointerEvent.stopPropagation();
            onResizePointerDown(event.id, 'start', pointerEvent.clientY);
          }}
          onClick={(clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
          }}
        />
        <button
          type="button"
          className={clsx(
            customEventStyles.customResizeHandle,
            customEventStyles.customResizeHandleBottom,
          )}
          aria-label="Adjust custom event end time"
          onPointerDown={(pointerEvent) => {
            pointerEvent.preventDefault();
            pointerEvent.stopPropagation();
            onResizePointerDown(event.id, 'end', pointerEvent.clientY);
          }}
          onClick={(clickEvent) => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
          }}
        />
        <div ref={eventContentRef} className={customEventStyles.eventContent}>
          {lines.map((line, index) => {
            const hidden =
              hideFromLineIndex !== null && hideFromLineIndex <= index
                ? customEventStyles.eventLineHidden
                : null;
            if (line.type === 'title') {
              return (
                <strong
                  key={line.key}
                  data-event-line="true"
                  className={clsx(
                    customEventStyles.eventLine,
                    customEventStyles.courseCodeText,
                    hidden,
                  )}
                >
                  {line.value}
                </strong>
              );
            }

            if (line.type === 'description') {
              return (
                <div
                  key={line.key}
                  data-event-line="true"
                  className={clsx(customEventStyles.eventLine, hidden)}
                >
                  <span className={customEventStyles.courseNameText}>
                    {line.value}
                  </span>
                </div>
              );
            }

            return (
              <small
                key={line.key}
                data-event-line="true"
                className={clsx(
                  customEventStyles.eventLine,
                  customEventStyles.locationText,
                  hidden,
                )}
              >
                {line.value}
              </small>
            );
          })}
        </div>
      </div>
      {!isReadonlyWorksheet && (
        <div className={customEventStyles.eventButtons}>
          <OverlayTrigger
            placement="bottom"
            overlay={(props) => (
              <Tooltip
                id={`custom-event-delete-${event.id}-tooltip`}
                {...props}
              >
                <small>Delete custom event</small>
              </Tooltip>
            )}
          >
            <button
              type="button"
              className={customEventStyles.worksheetHideButton}
              aria-label="Delete custom event"
              onClick={(clickEvent) => {
                clickEvent.preventDefault();
                clickEvent.stopPropagation();
                onDelete(event.id);
                setActionsPopoverOpen(false);
              }}
            >
              <MdDelete color="var(--color-text-dark)" />
            </button>
          </OverlayTrigger>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <OverlayTrigger
              placement="bottom"
              overlay={(props) => (
                <Tooltip
                  id={`custom-event-actions-${event.id}-tooltip`}
                  {...props}
                >
                  <small>More options</small>
                </Tooltip>
              )}
            >
              <button
                type="button"
                className={customEventStyles.worksheetHideButton}
                ref={actionsButtonRef}
                aria-label="Custom event actions"
                onClick={(clickEvent) => {
                  clickEvent.preventDefault();
                  clickEvent.stopPropagation();
                  setActionsPopoverOpen((prev) => !prev);
                }}
              >
                <FaEllipsisH color="var(--color-text-dark)" />
              </button>
            </OverlayTrigger>
            <Overlay
              target={actionsButtonRef}
              show={actionsPopoverOpen}
              placement="bottom"
              containerPadding={20}
              rootClose
              onHide={() => setActionsPopoverOpen(false)}
            >
              {(props) => (
                <Popover id={`custom-event-actions-${event.id}`} {...props}>
                  <Popover.Body>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={(tooltipProps) => (
                          <Tooltip
                            id={`custom-event-color-${event.id}-tooltip`}
                            {...tooltipProps}
                          >
                            <small>Change color</small>
                          </Tooltip>
                        )}
                      >
                        <button
                          type="button"
                          className={customEventStyles.worksheetHideButton}
                          aria-label="Change custom event color"
                          onClick={(clickEvent) => {
                            clickEvent.preventDefault();
                            clickEvent.stopPropagation();
                            onOpenColorPicker(event.id);
                            setActionsPopoverOpen(false);
                          }}
                        >
                          <MdEdit color="var(--color-text-dark)" />
                        </button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        overlay={(tooltipProps) => (
                          <Tooltip
                            id={`custom-event-move-${event.id}-tooltip`}
                            {...tooltipProps}
                          >
                            <small>Move to another worksheet</small>
                          </Tooltip>
                        )}
                      >
                        <button
                          type="button"
                          className={customEventStyles.worksheetHideButton}
                          aria-label="Move custom event"
                          onClick={(clickEvent) => {
                            clickEvent.preventDefault();
                            clickEvent.stopPropagation();
                            onOpenMoveModal(event.id);
                            setActionsPopoverOpen(false);
                          }}
                        >
                          <MdMoveToInbox color="var(--color-text-dark)" />
                        </button>
                      </OverlayTrigger>
                    </div>
                  </Popover.Body>
                </Popover>
              )}
            </Overlay>
          </div>
        </div>
      )}
    </>
  );
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
    viewedWorksheetNumber,
    changeViewedWorksheetNumber,
    setOpenColorPickerEvent,
    setOpenWorksheetMoveEvent,
    isCalendarViewLocked,
    calendarLockStart,
    calendarLockEnd,
  } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      changeViewedWorksheetNumber: state.changeViewedWorksheetNumber,
      setOpenColorPickerEvent: state.setOpenColorPickerEvent,
      setOpenWorksheetMoveEvent: state.setOpenWorksheetMoveEvent,
      isCalendarViewLocked: state.isCalendarViewLocked,
      calendarLockStart: state.calendarLockStart,
      calendarLockEnd: state.calendarLockEnd,
    })),
  );
  const eventStyleGetter = useEventStyle();
  const worksheetNumberOptions = useWorksheetNumberOptions('me', viewedSeason);
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
  const [customEvents, setCustomEvents] = useState<CustomRBCEvent[]>([]);
  const customEventIdRef = useRef(0);
  const [editingCustomEventId, setEditingCustomEventId] = useState<
    string | null
  >(null);
  const [customEventNameDraft, setCustomEventNameDraft] = useState('');
  const [customEventDescriptionDraft, setCustomEventDescriptionDraft] =
    useState('');
  const [customEventLocationDraft, setCustomEventLocationDraft] = useState('');
  const [customEventStartDraft, setCustomEventStartDraft] = useState('');
  const [customEventEndDraft, setCustomEventEndDraft] = useState('');
  const [customEventFormError, setCustomEventFormError] = useState<
    string | null
  >(null);
  const customEventTitleInputRef = useRef<HTMLInputElement | null>(null);
  const [coloringCustomEventId, setColoringCustomEventId] = useState<
    string | null
  >(null);
  const [movingCustomEventId, setMovingCustomEventId] = useState<string | null>(
    null,
  );
  const [customEventColorDraft, setCustomEventColorDraft] = useState(
    CUSTOM_EVENT_DEFAULT_COLOR,
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
        if (customEvent.worksheetNumber !== viewedWorksheetNumber) continue;
        if (customEvent.start.getDay() !== day) continue;
        const customStart = getMinutesSinceMidnight(customEvent.start);
        const customEnd = getMinutesSinceMidnight(customEvent.end);
        if (overlaps(customStart, customEnd)) return true;
      }

      return false;
    },
    [parsedCourses, walkBeforeByKey, customEvents, viewedWorksheetNumber],
  );
  const suppressSelectEventUntilRef = useRef(0);
  const walkModalOpenRef = useRef(false);
  const skipNextSelectEventRef = useRef(false);
  const clearSkipSelectTimeoutRef = useRef<number | null>(null);
  const dragHintTimeoutRef = useRef<number | null>(null);
  const activeCustomResizeRef = useRef<ActiveCustomResize | null>(null);
  const [showDragHint, setShowDragHint] = useState(false);
  const stopCustomEventResize = useCallback(() => {
    activeCustomResizeRef.current = null;
    document.body.classList.remove('ct-custom-event-resizing');
  }, []);
  const startCustomEventResize = useCallback(
    (customEventId: string, edge: CustomResizeEdge, pointerStartY: number) => {
      const customEvent = customEvents.find(
        (event) => event.id === customEventId,
      );
      if (!customEvent) return;

      const daySlot = document.querySelector<HTMLElement>(
        '.rbc-time-content .rbc-day-slot',
      );
      if (!daySlot) return;

      const slotHeight = daySlot.getBoundingClientRect().height;
      if (!Number.isFinite(slotHeight) || slotHeight <= 0) return;

      const visibleMinutes = Math.max(
        60,
        getMinutesSinceMidnight(latest) - getMinutesSinceMidnight(earliest),
      );
      activeCustomResizeRef.current = {
        customEventId,
        edge,
        pointerStartY,
        initialStart: new Date(customEvent.start),
        initialEnd: new Date(customEvent.end),
        day: customEvent.start.getDay(),
        slotHeight,
        visibleMinutes,
        lastAppliedDelta: Number.NaN,
      };
      document.body.classList.add('ct-custom-event-resizing');
    },
    [customEvents, earliest, latest],
  );
  const resizeCustomEvent = useCallback(
    (pointerY: number) => {
      const activeResize = activeCustomResizeRef.current;
      if (!activeResize) return;

      const deltaMinutesRaw =
        ((pointerY - activeResize.pointerStartY) / activeResize.slotHeight) *
        activeResize.visibleMinutes;
      const deltaMinutes =
        Math.round(deltaMinutesRaw / CUSTOM_EVENT_RESIZE_STEP_MINUTES) *
        CUSTOM_EVENT_RESIZE_STEP_MINUTES;
      if (deltaMinutes === activeResize.lastAppliedDelta) return;
      activeResize.lastAppliedDelta = deltaMinutes;

      const dayStart = new Date(activeResize.initialStart);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(activeResize.initialStart);
      dayEnd.setHours(23, 59, 0, 0);

      if (activeResize.edge === 'start') {
        let nextStart = addMinutes(activeResize.initialStart, deltaMinutes);
        const latestAllowedStart = addMinutes(
          activeResize.initialEnd,
          -CUSTOM_EVENT_MIN_DURATION_MINUTES,
        );
        if (nextStart < dayStart) nextStart = dayStart;
        if (nextStart > latestAllowedStart) nextStart = latestAllowedStart;
        nextStart.setSeconds(0, 0);

        const resizedStartMinutes = getMinutesSinceMidnight(nextStart);
        const initialEndMinutes = getMinutesSinceMidnight(
          activeResize.initialEnd,
        );
        if (
          initialEndMinutes - resizedStartMinutes <
          CUSTOM_EVENT_MIN_DURATION_MINUTES
        )
          return;
        if (
          hasRangeConflict(
            activeResize.day,
            resizedStartMinutes,
            initialEndMinutes,
            activeResize.customEventId,
          )
        )
          return;

        setCustomEvents((previous) =>
          previous.map((event) =>
            event.id === activeResize.customEventId
              ? {
                  ...event,
                  start: nextStart,
                }
              : event,
          ),
        );
        if (editingCustomEventId === activeResize.customEventId)
          setCustomEventStartDraft(toTimeInputValue(nextStart));
        return;
      }

      let nextEnd = addMinutes(activeResize.initialEnd, deltaMinutes);
      const earliestAllowedEnd = addMinutes(
        activeResize.initialStart,
        CUSTOM_EVENT_MIN_DURATION_MINUTES,
      );
      if (nextEnd > dayEnd) nextEnd = dayEnd;
      if (nextEnd < earliestAllowedEnd) nextEnd = earliestAllowedEnd;
      nextEnd.setSeconds(0, 0);

      const initialStartMinutes = getMinutesSinceMidnight(
        activeResize.initialStart,
      );
      const resizedEndMinutes = getMinutesSinceMidnight(nextEnd);
      if (
        resizedEndMinutes - initialStartMinutes <
        CUSTOM_EVENT_MIN_DURATION_MINUTES
      )
        return;
      if (
        hasRangeConflict(
          activeResize.day,
          initialStartMinutes,
          resizedEndMinutes,
          activeResize.customEventId,
        )
      )
        return;

      setCustomEvents((previous) =>
        previous.map((event) =>
          event.id === activeResize.customEventId
            ? {
                ...event,
                end: nextEnd,
              }
            : event,
        ),
      );
      if (editingCustomEventId === activeResize.customEventId)
        setCustomEventEndDraft(toTimeInputValue(nextEnd));
    },
    [editingCustomEventId, hasRangeConflict],
  );
  useEffect(() => {
    const onPointerMove = (pointerEvent: PointerEvent) => {
      if (!activeCustomResizeRef.current) return;
      pointerEvent.preventDefault();
      resizeCustomEvent(pointerEvent.clientY);
    };
    const onPointerUp = () => {
      if (!activeCustomResizeRef.current) return;
      stopCustomEventResize();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [resizeCustomEvent, stopCustomEventResize]);
  const openCustomEventEditor = useCallback((event: CustomRBCEvent) => {
    setEditingCustomEventId(event.id);
    setCustomEventNameDraft(event.title);
    setCustomEventDescriptionDraft(event.description);
    setCustomEventLocationDraft(event.location);
    setCustomEventStartDraft(toTimeInputValue(event.start));
    setCustomEventEndDraft(toTimeInputValue(event.end));
    setCustomEventFormError(null);
  }, []);
  const closeCustomEventEditor = useCallback(() => {
    setEditingCustomEventId(null);
    setCustomEventFormError(null);
  }, []);
  const handleCustomEventModalEntered = useCallback(() => {
    const titleInput = customEventTitleInputRef.current;
    if (!titleInput) return;
    titleInput.focus();
    titleInput.select();
  }, []);
  const handleCustomEventNameDraftChange = useCallback((value: string) => {
    setCustomEventNameDraft(value);
    setCustomEventFormError(null);
  }, []);
  const handleCustomEventDescriptionDraftChange = useCallback(
    (value: string) => {
      setCustomEventDescriptionDraft(value);
      setCustomEventFormError(null);
    },
    [],
  );
  const handleCustomEventLocationDraftChange = useCallback((value: string) => {
    setCustomEventLocationDraft(value);
    setCustomEventFormError(null);
  }, []);
  const handleCustomEventStartDraftChange = useCallback((value: string) => {
    setCustomEventStartDraft(value);
    setCustomEventFormError(null);
  }, []);
  const handleCustomEventEndDraftChange = useCallback((value: string) => {
    setCustomEventEndDraft(value);
    setCustomEventFormError(null);
  }, []);
  const showDragHintTemporarily = useCallback(() => {
    setShowDragHint(true);
    if (dragHintTimeoutRef.current)
      window.clearTimeout(dragHintTimeoutRef.current);
    dragHintTimeoutRef.current = window.setTimeout(() => {
      setShowDragHint(false);
      dragHintTimeoutRef.current = null;
    }, 3000);
  }, []);
  const createCustomEvent = useCallback(
    (slotStartDate: Date, slotEndDate?: Date) => {
      const slotStart = new Date(slotStartDate);
      slotStart.setSeconds(0, 0);
      const slotEnd = slotEndDate ? new Date(slotEndDate) : new Date(slotStart);
      slotEnd.setSeconds(0, 0);
      if (slotEnd <= slotStart) {
        slotEnd.setMinutes(
          slotStart.getMinutes() + CUSTOM_EVENT_DURATION_MINUTES,
        );
      }
      const day = slotStart.getDay();
      const slotStartMinutes = getMinutesSinceMidnight(slotStart);
      const slotEndMinutes = getMinutesSinceMidnight(slotEnd);
      if (hasRangeConflict(day, slotStartMinutes, slotEndMinutes)) return;

      const customEvent: CustomRBCEvent = {
        kind: 'custom',
        id: `custom-${slotStart.getTime()}-${customEventIdRef.current}`,
        title: CUSTOM_EVENT_LABEL,
        description: '',
        location: '',
        color: CUSTOM_EVENT_DEFAULT_COLOR,
        worksheetNumber: viewedWorksheetNumber,
        start: slotStart,
        end: slotEnd,
      };
      customEventIdRef.current += 1;
      setCustomEvents((prev) => [...prev, customEvent]);
      openCustomEventEditor(customEvent);
    },
    [hasRangeConflict, openCustomEventEditor, viewedWorksheetNumber],
  );
  const handleSelectSlot = useCallback(
    ({ start, end, action }: SlotInfo) => {
      if (action !== 'select') {
        showDragHintTemporarily();
        return;
      }
      setShowDragHint(false);
      if (dragHintTimeoutRef.current) {
        window.clearTimeout(dragHintTimeoutRef.current);
        dragHintTimeoutRef.current = null;
      }
      createCustomEvent(start, end);
    },
    [createCustomEvent, showDragHintTemporarily],
  );
  useEffect(() => {
    setCustomEvents([]);
    customEventIdRef.current = 0;
    setEditingCustomEventId(null);
    setColoringCustomEventId(null);
    setMovingCustomEventId(null);
    setCustomEventColorDraft(CUSTOM_EVENT_DEFAULT_COLOR);
  }, [viewedSeason]);
  const editingCustomEvent = useMemo(
    () =>
      customEvents.find((event) => event.id === editingCustomEventId) ?? null,
    [customEvents, editingCustomEventId],
  );
  const coloringCustomEvent = useMemo(
    () =>
      customEvents.find((event) => event.id === coloringCustomEventId) ?? null,
    [customEvents, coloringCustomEventId],
  );
  const movingCustomEvent = useMemo(
    () =>
      customEvents.find((event) => event.id === movingCustomEventId) ?? null,
    [customEvents, movingCustomEventId],
  );
  const moveWorksheetOptions = useMemo(
    () =>
      Object.values(worksheetNumberOptions).filter(
        ({ value }) => value !== movingCustomEvent?.worksheetNumber,
      ),
    [worksheetNumberOptions, movingCustomEvent],
  );
  const closeCustomEventColorModal = useCallback(() => {
    setColoringCustomEventId(null);
    setCustomEventColorDraft(CUSTOM_EVENT_DEFAULT_COLOR);
  }, []);
  const closeCustomEventMoveModal = useCallback(() => {
    setMovingCustomEventId(null);
  }, []);
  useEffect(() => {
    if (!coloringCustomEvent) {
      setCustomEventColorDraft(CUSTOM_EVENT_DEFAULT_COLOR);
      return;
    }
    setCustomEventColorDraft(coloringCustomEvent.color);
  }, [coloringCustomEvent]);
  const saveCustomEventColor = useCallback(() => {
    if (!coloringCustomEvent) return;
    setCustomEvents((prev) =>
      prev.map((event) =>
        event.id === coloringCustomEvent.id
          ? { ...event, color: customEventColorDraft }
          : event,
      ),
    );
    closeCustomEventColorModal();
  }, [coloringCustomEvent, customEventColorDraft, closeCustomEventColorModal]);
  const handleMoveCustomEventSelect = useCallback(
    (worksheetKey: string | null) => {
      if (!worksheetKey || !movingCustomEvent) return;
      const newWorksheetNumber = Number(worksheetKey);
      setCustomEvents((prev) =>
        prev.map((event) =>
          event.id === movingCustomEvent.id
            ? { ...event, worksheetNumber: newWorksheetNumber }
            : event,
        ),
      );
      setMovingCustomEventId(null);
      setEditingCustomEventId((prev) =>
        prev === movingCustomEvent.id ? null : prev,
      );
      if (newWorksheetNumber !== viewedWorksheetNumber)
        changeViewedWorksheetNumber(newWorksheetNumber);
    },
    [movingCustomEvent, viewedWorksheetNumber, changeViewedWorksheetNumber],
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
              description: customEventDescriptionDraft.trim(),
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
    customEventDescriptionDraft,
    customEventLocationDraft,
    closeCustomEventEditor,
  ]);
  const deleteCustomEventById = useCallback(
    (customEventId: string) => {
      setCustomEvents((prev) =>
        prev.filter((event) => event.id !== customEventId),
      );
      setEditingCustomEventId((prev) => (prev === customEventId ? null : prev));
      setColoringCustomEventId((prev) =>
        prev === customEventId ? null : prev,
      );
      setMovingCustomEventId((prev) => (prev === customEventId ? null : prev));
      setCustomEventFormError(null);
    },
    [
      setCustomEvents,
      setEditingCustomEventId,
      setColoringCustomEventId,
      setMovingCustomEventId,
      setCustomEventFormError,
    ],
  );
  const deleteCustomEvent = useCallback(() => {
    if (!editingCustomEvent) return;
    deleteCustomEventById(editingCustomEvent.id);
  }, [editingCustomEvent, deleteCustomEventById]);
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
  const visibleCustomEvents = useMemo(
    () =>
      customEvents.filter(
        (event) => event.worksheetNumber === viewedWorksheetNumber,
      ),
    [customEvents, viewedWorksheetNumber],
  );
  const calendarComponents = useMemo(
    () => ({
      event({ event }: { readonly event: WorksheetCalendarEvent }) {
        if (event.kind === 'custom') {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <CustomCalendarEventContent
                event={event}
                onDelete={deleteCustomEventById}
                onOpenColorPicker={setColoringCustomEventId}
                onOpenMoveModal={setMovingCustomEventId}
                onResizePointerDown={startCustomEventResize}
              />
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
    [
      suppressCalendarEventSelection,
      deleteCustomEventById,
      setColoringCustomEventId,
      setMovingCustomEventId,
      startCustomEventResize,
    ],
  );
  const livePreviewCustomEvent = useMemo(() => {
    if (!editingCustomEvent) return null;

    let nextStart = editingCustomEvent.start;
    let nextEnd = editingCustomEvent.end;
    if (customEventStartDraft && customEventEndDraft) {
      const draftedStart = applyTimeToDate(
        editingCustomEvent.start,
        customEventStartDraft,
      );
      const draftedEnd = applyTimeToDate(
        editingCustomEvent.start,
        customEventEndDraft,
      );
      if (draftedEnd > draftedStart) {
        const day = draftedStart.getDay();
        const draftedStartMinutes = getMinutesSinceMidnight(draftedStart);
        const draftedEndMinutes = getMinutesSinceMidnight(draftedEnd);
        if (
          !hasRangeConflict(
            day,
            draftedStartMinutes,
            draftedEndMinutes,
            editingCustomEvent.id,
          )
        ) {
          nextStart = draftedStart;
          nextEnd = draftedEnd;
        }
      }
    }

    return {
      ...editingCustomEvent,
      title: customEventNameDraft.trim() || CUSTOM_EVENT_LABEL,
      description: customEventDescriptionDraft.trim(),
      location: customEventLocationDraft.trim(),
      start: nextStart,
      end: nextEnd,
    };
  }, [
    editingCustomEvent,
    customEventNameDraft,
    customEventDescriptionDraft,
    customEventLocationDraft,
    customEventStartDraft,
    customEventEndDraft,
    hasRangeConflict,
  ]);
  const calendarEvents = useMemo<WorksheetCalendarEvent[]>(
    () => [
      ...displayEvents,
      ...visibleCustomEvents.map((event) =>
        livePreviewCustomEvent && event.id === livePreviewCustomEvent.id
          ? livePreviewCustomEvent
          : event,
      ),
    ],
    [displayEvents, visibleCustomEvents, livePreviewCustomEvent],
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
      if (dragHintTimeoutRef.current)
        window.clearTimeout(dragHintTimeoutRef.current);
      walkModalOpenRef.current = false;
      stopCustomEventResize();
    },
    [stopCustomEventResize],
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
      <div className="ct-calendar-shell">
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
        {showDragHint && (
          <small className="ct-custom-event-drag-hint">
            Drag for custom event
          </small>
        )}
      </div>
      <Modal
        show={editingCustomEvent !== null}
        onHide={closeCustomEventEditor}
        onEntered={handleCustomEventModalEntered}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-inline-flex align-items-center gap-2">
            Edit Custom Event
            <span className={customEventStyles.betaPill}>Beta</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="custom-event-name">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              ref={customEventTitleInputRef}
              type="text"
              value={customEventNameDraft}
              onChange={(e) => handleCustomEventNameDraftChange(e.target.value)}
              placeholder={CUSTOM_EVENT_LABEL}
              maxLength={120}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="custom-event-description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={customEventDescriptionDraft}
              onChange={(e) =>
                handleCustomEventDescriptionDraftChange(e.target.value)
              }
              placeholder="Optional"
              maxLength={160}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="custom-event-location">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={customEventLocationDraft}
              onChange={(e) =>
                handleCustomEventLocationDraftChange(e.target.value)
              }
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
                onChange={(e) =>
                  handleCustomEventStartDraftChange(e.target.value)
                }
              />
            </Form.Group>
            <Form.Group className="flex-fill" controlId="custom-event-end">
              <Form.Label>End</Form.Label>
              <Form.Control
                type="time"
                step={60}
                value={customEventEndDraft}
                onChange={(e) =>
                  handleCustomEventEndDraftChange(e.target.value)
                }
              />
            </Form.Group>
          </div>
          {customEventFormError && (
            <p className="text-danger mt-3 mb-0">{customEventFormError}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="sm"
            className="me-auto"
            onClick={deleteCustomEvent}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={closeCustomEventEditor}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveCustomEventChanges}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={coloringCustomEvent !== null}
        onHide={closeCustomEventColorModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Custom Event Color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="custom-event-color">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="color"
              value={customEventColorDraft}
              onChange={(e) => setCustomEventColorDraft(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCustomEventColorModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveCustomEventColor}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={movingCustomEvent !== null}
        onHide={closeCustomEventMoveModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Move Custom Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownButton
            title="Select Worksheet"
            onSelect={handleMoveCustomEventSelect}
            variant="secondary"
            size="sm"
          >
            {moveWorksheetOptions.map(({ value, label }) => (
              <Dropdown.Item key={value} eventKey={String(value)}>
                {label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCustomEventMoveModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ColorPickerModal onClose={() => setOpenColorPickerEvent(null)} />
      <WorksheetMoveModal onClose={() => setOpenWorksheetMoveEvent(null)} />
    </>
  );
}
export default WorksheetCalendar;
