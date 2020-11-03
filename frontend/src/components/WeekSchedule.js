import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import './WeekSchedule.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
const localizer = momentLocalizer(moment);
// TODO: Allow users to change color of courses in calendar?

/**
 * Render Worksheet Calendar Componenet
 * @prop showModal - function to show modal for a particular listing
 * @prop courses - list of dictionaries of listing data
 * @prop hover_course - dictionary of listing that is being hovered over in list view
 * @prop setHoverCourse - function to set the hover course
 */

function WeekSchedule({ showModal, courses, hover_course, setHoverCourse }) {
  // Parse listings dictionaries to generate event dictionaries
  const parseListings = useCallback((listings) => {
    // Initialize earliest and latest class times
    let earliest = moment().hour(20);
    let latest = moment().hour(0);
    // List of event dictionaries
    let parsedCourses = [];
    // Variable used in list keys
    let id = 0;
    // Iterate over each listing dictionary
    listings.forEach((course) => {
      // Skip if this course is hidden
      if (course.hidden) return;
      const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      for (var indx = 0; indx < 5; indx++) {
        const info = course['times_by_day.' + weekDays[indx]];
        // If the listing takes place on this day
        if (info !== undefined) {
          // Get start and end times for the listing
          const start = moment(info[0][0], 'HH:mm').day(1 + indx);
          const end = moment(info[0][1], 'HH:mm').day(1 + indx);
          // Fix any incorrect values
          if (start.get('hour') < 8) start.add(12, 'h');
          if (end.get('hour') < 8) end.add(12, 'h');
          const value = course.course_code;
          // Add event dictionary to the list
          parsedCourses[parsedCourses.length] = {
            title: value,
            start: start.toDate(),
            end: end.toDate(),
            listing: course,
            id: id,
          };
          // Update earliest and latest courses
          if (start.get('hours') < earliest.get('hours')) earliest = start;
          if (end.get('hours') > latest.get('hours')) latest = end;
        }
      }
      id = id + 1;
    });
    // Set earliest minute to 0
    earliest.set({ minute: 0 });
    return [earliest, latest, parsedCourses];
  }, []);

  const event_style = {
    width: '100%',
    height: '100%',
  };
  // Render the custom data displayed on each calendar event
  const customEvent = useCallback(
    (event) => {
      return (
        <div
          style={event_style}
          // onMouseEnter={() => setHoverCourse(event.event.listing)}
          // onMouseLeave={() => setHoverCourse(null)}
        >
          <strong>{event.title}</strong>
          <br />
          <span style={{ fontSize: '12px' }}>
            <ResponsiveEllipsis
              style={{ whiteSpace: 'pre-wrap' }}
              text={event.event.listing.title}
              maxLine={'2'}
              basedOn="words"
            />
          </span>
          <small className="location_text">
            {event.event.listing.locations_summary}
          </small>
        </div>
      );
    },
    // [setHoverCourse]
    [event_style]
  );

  // Custom styling for the calendar events
  const eventStyleGetter = useCallback(
    (event) => {
      const border = '1)';
      let style;
      if (hover_course && hover_course.crn === event.listing.crn) {
        style = {
          backgroundColor: event.listing.color.concat('1)'),
          borderColor: event.listing.color.concat(border),
          borderWidth: '2px',
          filter: 'saturate(130%)',
          transform: 'scale(1.03)',
          zIndex: 69,
        };
      } else if (hover_course) {
        style = {
          backgroundColor: event.listing.color.concat('.85)'),
          borderColor: event.listing.color.concat(border),
          borderWidth: '2px',
          opacity: '40%',
        };
      } else {
        style = {
          backgroundColor: event.listing.color.concat('.85)'),
          borderColor: event.listing.color.concat(border),
          borderWidth: '2px',
        };
      }
      return {
        style: style,
      };
    },
    [hover_course]
  );

  const ret_values = useMemo(() => {
    return parseListings(courses);
  }, [courses, parseListings]);

  return (
    <Calendar
      // Show Mon-Fri
      defaultView={'work_week'}
      views={['work_week']}
      events={ret_values[2]}
      // Earliest course time or 8am if no courses
      min={
        ret_values[0].get('hours') !== 20
          ? ret_values[0].toDate()
          : moment().hour(8).minute(0).toDate()
      }
      // Latest course time or 6pm if no courses
      max={
        ret_values[1].get('hours') !== 0
          ? ret_values[1].toDate()
          : moment().hour(18).minute(0).toDate()
      }
      localizer={localizer}
      toolbar={false}
      onSelectEvent={(event) => showModal(event.listing)}
      components={{
        event: customEvent,
      }}
      eventPropGetter={(event) => eventStyleGetter(event)}
      // Display Mon, Tue, Wed, ... at the top
      formats={{
        dayFormat: 'ddd',
        timeGutterFormat: 'ha',
      }}
    />
  );
}

// WeekSchedule.whyDidYouRender = true;
export default React.memo(WeekSchedule);
