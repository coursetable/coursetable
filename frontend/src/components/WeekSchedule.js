import React from 'react';
import moment from 'moment';
import './WeekSchedule.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// TODO: Allow users to change color of courses in calendar?

/**
 * Render Worksheet Calendar Componenet
 * @prop showModal - function to show modal for a particular listing
 * @prop courses - list of dictionaries of listing data
 * @prop hover_course - dictionary of listing that is being hovered over in list view
 */

export default class WeekSchedule extends React.Component {
  // Show modal for the listing that was clicked on
  showModal = (listing) => {
    this.props.showModal(listing);
  };

  // Parse listings dictionaries to generate event dictionaries
  parseListings = (listings) => {
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
        const info = course['course.times_by_day.' + weekDays[indx]];
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
  };

  // Render the custom data displayed on each calendar event
  customEvent = (event) => {
    return (
      <div>
        <strong>{event.title}</strong>
        <br />
        <small className="location_text">
          {event.event.listing['course.locations_summary']}
        </small>
      </div>
    );
  };

  // Custom styling for the calendar events
  eventStyleGetter = (event) => {
    const border = '1)';
    const background = '.85)';
    let style = {
      backgroundColor: event.listing.color.concat(background),
      borderColor: event.listing.color.concat(border),
      borderWidth: '2px',
      filter:
        this.props.hover_course &&
        this.props.hover_course.crn === event.listing.crn
          ? 'brightness(80%)'
          : 'brightness(100%)',
    };
    return {
      style: style,
    };
  };

  render() {
    var ret_values = this.parseListings(this.props.courses);
    const localizer = momentLocalizer(moment);
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
        onSelectEvent={(event) => this.showModal(event.listing)}
        components={{
          event: this.customEvent,
        }}
        eventPropGetter={(event) => this.eventStyleGetter(event)}
        // Display Mon, Tue, Wed, ... at the top
        formats={{
          dayFormat: 'ddd',
        }}
      />
    );
  }
}
