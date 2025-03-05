import React, { useCallback } from 'react';
import chroma from 'chroma-js';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import WorksheetHideButton from './WorksheetHideButton';
import { useStore } from '../../store';
import type { RBCEvent } from '../../utilities/calendar';
import styles from './CalendarEvent.module.css';
import WorksheetItemActionsButton from './WorksheetItemActionsButton';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

export function CalendarEventBody({ event }: { readonly event: RBCEvent }) {
  const textColor =
    chroma.contrast(event.color, 'white') > 2 ? 'white' : 'black';

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

  return (
    <div className={styles.event} style={{ color: textColor }}>
      <strong className={styles.courseCodeText}>{formattedTitle}</strong>
      <br />
      <ResponsiveEllipsis
        className={styles.courseNameText}
        text={event.description}
        maxLine="2"
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

function CalendarEvent({ event }: { readonly event: RBCEvent }) {
  const { listing } = event;
  const isReadonlyWorksheet = useStore((state) => state.isReadonlyWorksheet);

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
    (event: RBCEvent) => {
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
        style.filter = 'saturate(130%)';
      } else if (hoverCourse) {
        style.opacity = '30%';
      }
      return {
        style,
      };
    },
    [isMobile, hoverCourse],
  );
  return eventStyleGetter;
}

export default CalendarEvent;
