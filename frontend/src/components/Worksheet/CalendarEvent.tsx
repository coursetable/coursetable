import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import clsx from 'clsx';
import { InfoPopover } from '../Typography';
import { truncatedText } from '../../utilities/course';
import type { RBCEvent } from '../../utilities/calendar';
import styles from './CalendarEvent.module.css';
import WorksheetHideButton from './WorksheetHideButton';
import { useWorksheet } from '../../contexts/worksheetContext';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

function CalendarEvent({ event }: { readonly event: RBCEvent }) {
  const hidden = false; // Always shown if in cal
  const course = event.listing;
  const { toggleCourse } = useWorksheet();
  const [isHovering, setIsHovering] = useState(false);

  const handleEventHover = (hovering: boolean) => {
    setIsHovering(hovering);
  };

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
        onMouseEnter={() => handleEventHover(true)}
        onMouseLeave={() => handleEventHover(false)}
        onFocus={() => handleEventHover(true)} // Accessibility improvement
        onBlur={() => handleEventHover(false)} // Accessibility improvement
      >
        <div
          className={clsx(styles.worksheetHideButton, styles.hideButtonHidden)}
          onMouseEnter={(e) => {
            e.stopPropagation();
            handleEventHover(false);
          }}
          onMouseLeave={() => handleEventHover(true)}
          onFocus={() => handleEventHover(false)} // Accessibility improvement
          onBlur={() => handleEventHover(true)} // Accessibility improvement
        >
          <WorksheetHideButton
            toggleCourse={() => toggleCourse(course.crn)}
            hidden={hidden}
            inCal
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
