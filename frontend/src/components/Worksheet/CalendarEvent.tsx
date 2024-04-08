import React from 'react';
import clsx from 'clsx';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import ColorPickerButton from './ColorPickerButton';
import WorksheetHideButton from './WorksheetHideButton';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { RBCEvent } from '../../utilities/calendar';
import { CourseInfoPopover } from '../Search/ResultsItemCommon';
import styles from './CalendarEvent.module.css';

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
        <div className="d-flex gap-1 flex-direction-column">
          <WorksheetHideButton
            crn={course.crn}
            // Course in calendar is never hidden
            hidden={false}
            className={styles.worksheetHideButton}
          />
          <ColorPickerButton
            crn={course.crn}
            color={event.color}
            className={styles.worksheetHideButton}
          />
        </div>
      )}
    </>
  );
}

export default CalendarEvent;
