import React, { useCallback } from 'react';
import chroma from 'chroma-js';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import ColorPickerButton from './ColorPickerButton';
import WorksheetHideButton from './WorksheetHideButton';
import { useWorksheet } from '../../contexts/worksheetContext';
import { useStore } from '../../store';
import type { RBCEvent } from '../../utilities/calendar';
import styles from './CalendarEvent.module.css';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

export function CalendarEventBody({ event }: { readonly event: RBCEvent }) {
  const textColor =
    chroma.contrast(event.color, 'white') > 2 ? 'white' : 'black';
  return (
    <div className={styles.event} style={{ color: textColor }}>
      <strong>{event.title}</strong>
      <br />
      <ResponsiveEllipsis
        className={styles.courseNameText}
        text={event.description}
        maxLine="2"
        basedOn="words"
      />
      <small className={styles.locationText}>{event.location}</small>
    </div>
  );
}

function CalendarEvent({ event }: { readonly event: RBCEvent }) {
  const { listing } = event;
  const { viewedPerson } = useWorksheet();

  return (
    <>
      <CalendarEventBody event={event} />
      {viewedPerson === 'me' && (
        <div className={styles.eventButtons}>
          <WorksheetHideButton
            crn={listing.crn}
            // Course in calendar is never hidden
            hidden={false}
            className={styles.worksheetHideButton}
            color="var(--color-text-dark)"
          />
          <ColorPickerButton
            event={event}
            className={styles.worksheetHideButton}
          />
        </div>
      )}
    </>
  );
}

export function useEventStyle() {
  const { hoverCourse } = useWorksheet();
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
