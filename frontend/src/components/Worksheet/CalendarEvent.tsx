import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { InfoPopover } from '../Typography';
import { truncatedText } from '../../utilities/course';
import type { RBCEvent } from '../../utilities/calendar';
import styles from './CalendarEvent.module.css';
import WorksheetHideButton from './WorksheetHideButton';
import { useWorksheet } from '../../contexts/worksheetContext';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

function CalendarEvent({ event }: { readonly event: RBCEvent }) {
  const course = event.listing;
  const { toggleCourse } = useWorksheet();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <OverlayTrigger
      placement="right"
      show={isHovering} // Show popover based on hovering state
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
      <div
        className={styles.event}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onFocus={() => setIsHovering(true)}
        onBlur={() => setIsHovering(false)}
      >
        <div
          className={styles.worksheetHideButton}
          // Prevent hovering over the hide button from showing the course info
          // popover
          onMouseEnter={(e) => {
            e.stopPropagation();
            setIsHovering(false);
          }}
          onMouseLeave={() => setIsHovering(true)}
          onFocus={() => setIsHovering(false)}
          onBlur={() => setIsHovering(true)}
        >
          <WorksheetHideButton
            toggleCourse={() => toggleCourse(course.crn)}
            // Course in calendar is never hidden
            hidden={false}
          />
        </div>
        <div>
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
      </div>
    </OverlayTrigger>
  );
}

export default CalendarEvent;
