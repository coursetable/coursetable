import React from 'react';
import moment from 'moment';
import './WeekSchedule.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Allow users to change color of courses in calendar?

export default class WeekSchedule extends React.Component {
  constructor(props) {
    super(props);
  }

  showModal = (listing) => {
    this.props.showModal(listing);
  };

  parseListings = (listings) => {
    let earliest = moment().hour(20);
    let latest = moment().hour(0);
    let parsedCourses = [];
    let id = 0;
    listings.forEach((course) => {
      const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      for (var indx = 0; indx < 5; indx++) {
        const info = course['course.times_by_day.' + weekDays[indx]];
        if (info !== undefined) {
          const start = moment(info[0][0], 'HH:mm').day(1 + indx);
          const end = moment(info[0][1], 'HH:mm').day(1 + indx);
          if (start.get('hour') < 8) start.add(12, 'h');
          if (end.get('hour') < 8) end.add(12, 'h');
          const value = course.course_code;
          parsedCourses[parsedCourses.length] = {
            title: value,
            start: start.toDate(),
            end: end.toDate(),
            listing: course,
            id: id,
          };
          if (start.get('hours') < earliest.get('hours')) earliest = start;
          if (end.get('hours') > latest.get('hours')) latest = end;
        }
      }
      id = id + 1;
    });
    earliest.set({ minute: 0 });
    return [earliest, latest, parsedCourses];
  };

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

  eventStyleGetter = (event) => {
    const border = '1)';
    const background = '.9)';
    let style = {
      backgroundColor: event.listing.color.concat(background),
      borderColor: event.listing.color.concat(border),
      borderWidth: '2px',
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
        defaultView={'work_week'}
        views={['work_week']}
        events={ret_values[2]}
        min={
          ret_values[0].get('hours') !== 20
            ? ret_values[0].toDate()
            : moment().hour(8).minute(0).toDate()
        }
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
        formats={{
          dayFormat: 'ddd',
        }}
      />
    );
  }
}
