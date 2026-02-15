import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { FaWalking } from 'react-icons/fa';
import chroma from 'chroma-js';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import WorksheetHideButton from './WorksheetHideButton';
import WorksheetItemActionsButton from './WorksheetItemActionsButton';
import { useStore } from '../../store';
import type { CourseRBCEvent, WalkBefore } from '../../utilities/calendar';
import styles from './CalendarEvent.module.css';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

export function CalendarEventBody({
  event,
}: {
  readonly event: CourseRBCEvent;
}) {
  const textColor =
    chroma.contrast(event.color, 'white') > 2 ? 'white' : 'black';
  const walkConnector = chroma(event.color).css();
  const walkAccent = chroma(event.color).css();
  const connectorOffset = 4;
  const eventRef = useRef<HTMLDivElement | null>(null);
  const walkBadgeRef = useRef<HTMLDivElement | null>(null);
  const [connectorHeight, setConnectorHeight] = useState<number | null>(null);
  const [walkBadgeTop, setWalkBadgeTop] = useState(0);

  const isMobile = useStore((state) => state.isMobile);
  const hoverCourse = useStore((state) => state.hoverCourse);
  const isCalendarViewLocked = useStore((state) => state.isCalendarViewLocked);
  const calendarLockStart = useStore((state) => state.calendarLockStart);
  const calendarLockEnd = useStore((state) => state.calendarLockEnd);

  // This splits the title into separate lines for mobile!
  const formattedTitle = isMobile
    ? event.title.split(' ').map((word, index) => (
        <React.Fragment key={index}>
          {word}
          {index < event.title.split(' ').length - 1 && <br />}
        </React.Fragment>
      ))
    : event.title;

  const lastMod = event.listing.course.last_updated as string | undefined;

  useLayoutEffect(() => {
    if (!event.walkBefore) {
      setConnectorHeight(null);
      setWalkBadgeTop(0);
      return undefined;
    }
    const node = eventRef.current;
    if (!node) return undefined;
    const durationMinutes = Math.max(
      1,
      (event.end.getTime() - event.start.getTime()) / 60000,
    );
    const updateConnector = () => {
      const { height } = node.getBoundingClientRect();
      if (!Number.isFinite(height) || height <= 0) return;
      const pxPerMinute = height / durationMinutes;
      const gapMinutes =
        event.walkBefore?.gapMinutes ?? event.walkBefore.minutes;
      let gapPx = Math.max(0, gapMinutes * pxPerMinute);
      const eventNode = node.closest('.rbc-event');
      const daySlotNode = node.closest('.rbc-day-slot');
      const eventHeightPercent =
        eventNode instanceof HTMLElement
          ? Number.parseFloat(eventNode.style.height)
          : Number.NaN;
      if (
        daySlotNode instanceof HTMLElement &&
        Number.isFinite(eventHeightPercent) &&
        eventHeightPercent > 0
      ) {
        const daySlotHeight = daySlotNode.getBoundingClientRect().height;
        const gapPercent = (gapMinutes / durationMinutes) * eventHeightPercent;
        if (Number.isFinite(daySlotHeight) && daySlotHeight > 0)
          gapPx = (daySlotHeight * gapPercent) / 100;
      }
      const badgeHeight =
        walkBadgeRef.current?.getBoundingClientRect().height ?? 0;
      const badgeTopNudge = 2;
      const nextWalkBadgeTop =
        badgeHeight > 0 && gapPx < badgeHeight ? (badgeHeight - gapPx) / 2 : 0;
      setWalkBadgeTop(nextWalkBadgeTop - badgeTopNudge);

      const endInset = 6;
      const heightScale = 1.4;
      const nextHeight = Math.max(0, gapPx * heightScale - endInset);
      setConnectorHeight(nextHeight);
    };
    updateConnector();
    // Recompute after layout settles; RBC adjusts inline styles during render.
    const frame = window.requestAnimationFrame(updateConnector);
    if (typeof ResizeObserver === 'undefined')
      return () => window.cancelAnimationFrame(frame);
    const observer = new ResizeObserver(() => updateConnector());
    observer.observe(node);
    if (walkBadgeRef.current) observer.observe(walkBadgeRef.current);
    const observedEventNode = node.closest('.rbc-event');
    const observedDaySlotNode = node.closest('.rbc-day-slot');
    if (observedEventNode instanceof HTMLElement)
      observer.observe(observedEventNode);
    if (observedDaySlotNode instanceof HTMLElement)
      observer.observe(observedDaySlotNode);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [
    event.end,
    event.start,
    event.walkBefore,
    isCalendarViewLocked,
    calendarLockStart,
    calendarLockEnd,
  ]);

  const walkChipOpacity =
    !isMobile && hoverCourse && hoverCourse !== event.listing.crn ? 0.3 : 1;

  return (
    <div
      ref={eventRef}
      className={styles.event}
      style={
        {
          color: textColor,
          '--walk-chip-opacity': walkChipOpacity,
        } as React.CSSProperties
      }
    >
      {event.walkBefore && (
        <>
          <span
            className={styles.walkBadgeDots}
            style={
              {
                '--walk-connector': walkConnector,
                '--walk-connector-height': connectorHeight
                  ? `${connectorHeight}px`
                  : undefined,
                '--walk-connector-offset': `${connectorOffset}px`,
              } as React.CSSProperties
            }
            aria-hidden
          />
          <WalkBadge
            walk={event.walkBefore}
            accentColor={walkAccent}
            badgeTop={walkBadgeTop}
            badgeRef={walkBadgeRef}
          />
        </>
      )}
      <strong className={styles.courseCodeText}>{formattedTitle}</strong>
      <br />
      <ResponsiveEllipsis
        className={styles.courseNameText}
        text={event.description}
        maxLine="1"
        basedOn="words"
      />
      <small className={styles.locationText}>{event.location}</small>
      <br />
      {lastMod && (
        <ResponsiveEllipsis
          className={styles.lastUpdatedText}
          text={`Last updated: ${new Date(lastMod).toLocaleDateString()}`}
        />
      )}
    </div>
  );
}

function WalkBadge({
  walk,
  accentColor,
  badgeTop,
  badgeRef,
}: {
  readonly walk: WalkBefore;
  readonly accentColor: string;
  readonly badgeTop: number;
  readonly badgeRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={badgeRef}
      className={styles.walkBadge}
      style={
        {
          '--walk-accent': accentColor,
          '--walk-badge-top': `${badgeTop}px`,
        } as React.CSSProperties
      }
    >
      <span className={styles.walkBadgeIconWrap} aria-hidden>
        <FaWalking className={styles.walkBadgeIcon} />
      </span>
      <span>{walk.minutes} min walk</span>
    </div>
  );
}

function CalendarEvent({ event }: { readonly event: CourseRBCEvent }) {
  const { listing } = event;
  const isReadonlyWorksheet = useStore((state) =>
    state.worksheetMemo.getIsReadonlyWorksheet(state),
  );

  return (
    <>
      <CalendarEventBody event={event} />
      {!isReadonlyWorksheet && (
        <div className={styles.eventButtons}>
          <WorksheetHideButton
            crn={listing.crn}
            // Course in calendar is never hidden
            hidden={false}
            className={styles.worksheetHideButton}
            color="var(--color-text-dark)"
          />
          <WorksheetItemActionsButton
            event={event}
            className={styles.worksheetHideButton}
          />
        </div>
      )}
    </>
  );
}

export function useEventStyle() {
  const hoverCourse = useStore((state) => state.hoverCourse);
  const isMobile = useStore((state) => state.isMobile);
  // Custom styling for the calendar events
  const eventStyleGetter = useCallback(
    (event: CourseRBCEvent) => {
      const color = chroma(event.color);
      let backgroundColor = color.alpha(0.85).css();
      let borderColor = color.css();

      if (!isMobile && hoverCourse) {
        if (hoverCourse === event.listing.crn) {
          const emphasized = color.saturate(1);
          backgroundColor = emphasized.alpha(0.9).css();
          borderColor = emphasized.css();
        } else {
          backgroundColor = color.alpha(0.3).css();
          borderColor = color.alpha(0.3).css();
        }
      }

      const style: React.CSSProperties = {
        backgroundColor,
        borderColor,
        borderWidth: '2px',
      };
      // Hover management is too hard on mobile and not very useful
      if (isMobile) return { style };
      if (hoverCourse && hoverCourse === event.listing.crn) style.zIndex = 2;
      return {
        style,
      };
    },
    [isMobile, hoverCourse],
  );
  return eventStyleGetter;
}

export default CalendarEvent;
