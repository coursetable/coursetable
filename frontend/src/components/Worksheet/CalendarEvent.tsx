import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { InfoPopover } from '../Typography';
import type { Listing } from '../../utilities/common';
import { truncatedText } from '../../utilities/course';
import styles from './CalendarEvent.module.css';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

export interface CourseEvent {
  title: string;
  description: string;
  start: Date;
  end: Date;
  listing: Listing;
  id: number;
  location: string;
}

function CalendarEvent({ event }: { readonly event: CourseEvent }) {
  const course = event.listing;
  return (
    <OverlayTrigger
      // Course info that appears on hover
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
  );
}

export default CalendarEvent;
