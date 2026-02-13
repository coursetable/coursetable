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
  const walkAccent = chroma(event.color).darken(0.8).css();
  const connectorOffset = 1;
  const eventRef = useRef<HTMLDivElement | null>(null);
  const [connectorHeight, setConnectorHeight] = useState<number | null>(null);

  const isMobile = useStore((state) => state.isMobile);

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
      const endInset = 6;
      const heightScale = 1.4;
      const nextHeight = Math.max(
        0,
        gapMinutes * pxPerMinute * heightScale - endInset,
      );
      setConnectorHeight(nextHeight);
    };
    updateConnector();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => updateConnector());
    observer.observe(node);
    return () => observer.disconnect();
  }, [event.end, event.start, event.walkBefore]);

  return (
    <div ref={eventRef} className={styles.event} style={{ color: textColor }}>
      {event.walkBefore && (
        <>
          <span
            className={styles.walkBadgeDots}
            style={
              {
                '--walk-connector': walkAccent,
                '--walk-connector-height': connectorHeight
                  ? `${connectorHeight}px`
                  : undefined,
                '--walk-connector-offset': `${connectorOffset}px`,
              } as React.CSSProperties
            }
            aria-hidden
          />
          <WalkBadge walk={event.walkBefore} accentColor={walkAccent} />
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
}: {
  readonly walk: WalkBefore;
  readonly accentColor: string;
}) {
  return (
    <div
      className={styles.walkBadge}
      style={
        {
          '--walk-accent': accentColor,
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
      const hasWalkBefore = Boolean(event.walkBefore);
      const color = chroma(event.color);
      const style: React.CSSProperties = {
        backgroundColor: color.alpha(0.85).css(),
        borderColor: color.css(),
        borderWidth: '2px',
      };
      // Hover management is too hard on mobile and not very useful
      if (isMobile) return { style };
      if (hoverCourse && hoverCourse === event.listing.crn) {
        style.zIndex = 2;
        if (!hasWalkBefore) style.filter = 'saturate(130%)';
      } else if (hoverCourse && !hasWalkBefore) {
        style.opacity = '30%';
      }
      return {
        style,
        className: hasWalkBefore ? 'rbc-event-with-walk-badge' : undefined,
      };
    },
    [isMobile, hoverCourse],
  );
  return eventStyleGetter;
}

export default CalendarEvent;
