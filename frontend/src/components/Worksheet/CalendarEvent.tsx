import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { InfoPopover } from '../Typography';
import { truncatedText } from '../../utilities/course';
import type { RBCEvent } from '../../utilities/calendar';
import styles from './CalendarEvent.module.css';
import WorksheetHideButton from './WorksheetHideButton';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

function CalendarEvent({ event }: { readonly event: RBCEvent }) {
  const course = event.listing;

  return (
    <>
      <OverlayTrigger
        placement="right"
        overlay={(props) => (
          <InfoPopover {...props} id="title-popover">
            <Popover.Title>
              <strong>{course.title}</strong>
              <span className="d-block">{course.times_summary}</span>
            </Popover.Title>
            <Popover.Content>
              {truncatedText(course.description, 300, 'no description')}
              <br />
              <div className="text-danger">
                {truncatedText(course.requirements, 250, '')}
              </div>
            </Popover.Content>
          </InfoPopover>
        )}
        delay={{ show: 300, hide: 0 }}
      >
        <div className={styles.event}>
          <strong>{event.title}</strong>
          <br />
          <span>
            <ResponsiveEllipsis
              className={styles.courseNameText}
              text={event.description}
              maxLine="2"
              basedOn="words"
            />
          </span>
          <small className={styles.locationText}>{event.location}</small>
        </div>
      </OverlayTrigger>
      <div className={styles.worksheetHideButton}>
        <WorksheetHideButton
          crn={course.crn}
          // Course in calendar is never hidden
          hidden={false}
        />
      </div>
    </>
  );
}

export default CalendarEvent;
