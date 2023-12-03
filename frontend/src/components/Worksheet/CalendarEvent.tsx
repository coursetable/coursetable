import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { StyledPopover } from '../StyledComponents';
import type { Listing } from '../../utilities/common';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

export interface CourseEvent {
  title: string;
  start: Date;
  end: Date;
  listing: Listing;
  id: number;
  location: string;
}

const event_style = {
  width: '100%',
  height: '100%',
};

function truncatedText(
  text: string | null | undefined,
  max: number,
  defaultStr: string,
) {
  if (!text) {
    return defaultStr;
  } else if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max)}...`;
}

function CalendarEvent({ event }: { event: CourseEvent }) {
  const course = event.listing;
  return (
    <OverlayTrigger
      // Course info that appears on hover
      placement="right"
      overlay={(props) => (
        <StyledPopover {...props} id="title_popover">
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
        </StyledPopover>
      )}
      // Have a 1000ms delay before showing popover so it only pops up when user wants it to
      delay={{ show: 1000, hide: 0 }}
    >
      <div
        style={event_style}
        // onMouseEnter={() => setHoverCourse(event.listing)}
        // onMouseLeave={() => setHoverCourse(null)}
      >
        <strong>{event.title}</strong>
        <br />
        <span style={{ fontSize: '12px' }}>
          <ResponsiveEllipsis
            style={{ whiteSpace: 'pre-wrap' }}
            text={event.listing.title}
            maxLine="2"
            basedOn="words"
          />
        </span>
        <small className="location_text">{event.location}</small>
      </div>
    </OverlayTrigger>
  );
}

// CalendarEvent.whyDidYouRender = true;
export default React.memo(CalendarEvent);
