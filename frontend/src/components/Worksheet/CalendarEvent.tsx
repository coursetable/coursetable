import React from 'react';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { CourseInfoPopover } from '../Search/ResultsItemCommon';
import type { RBCEvent } from '../../utilities/calendar';
import styles from './CalendarEvent.module.css';
import WorksheetHideButton from './WorksheetHideButton';
import { useWorksheet } from '../../contexts/worksheetContext';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

function CalendarEvent({ event }: { readonly event: RBCEvent }) {
  const course = event.listing;
  const { person } = useWorksheet();

  return (
    <>
      <CourseInfoPopover course={course}>
        <div className={styles.event}>
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
      </CourseInfoPopover>
      {person === 'me' && (
        <div className={styles.worksheetHideButton}>
          <WorksheetHideButton
            crn={course.crn}
            // Course in calendar is never hidden
            hidden={false}
          />
        </div>
      )}
    </>
  );
}

export default CalendarEvent;
