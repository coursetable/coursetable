import React, { useCallback } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { StyledPopover } from './StyledComponents';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

const event_style = {
  width: '100%',
  height: '100%',
};

function CalendarEvent({ event }) {
  // Render popover that contains title, description, and requirements when hovering over course
  const renderTitlePopover = useCallback((props, course) => {
    return (
      <StyledPopover {...props} id="title_popover">
        <Popover.Title>
          <strong>{course.title}</strong>
        </Popover.Title>
        <Popover.Content>
          {course.description
            ? course.description.length <= 300
              ? course.description
              : `${course.description.slice(0, 300)}...`
            : 'no description'}
          <br />
          <div className="text-danger">
            {course.requirements &&
              (course.requirements.length <= 250
                ? course.requirements
                : `${course.requirements.slice(0, 250)}...`)}
          </div>
        </Popover.Content>
      </StyledPopover>
    );
  }, []);

  return (
    <OverlayTrigger
      // Course info that appears on hover
      placement="right"
      overlay={(props) => renderTitlePopover(props, event.listing)}
      // Have a 500ms delay before showing popover so it only pops up when user wants it to
      delay={{ show: 300, hide: 100 }}
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
        <small className="location_text">
          {event.listing.locations_summary}
        </small>
      </div>
    </OverlayTrigger>
  );
}

// CalendarEvent.whyDidYouRender = true;
export default React.memo(CalendarEvent);
