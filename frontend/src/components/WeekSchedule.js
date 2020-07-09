import React from 'react';
import moment from 'moment';
import styles from './WeekSchedule.module.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Allow users to change color of courses in calendar?

export default class WeekSchedule extends React.Component {
  constructor(props) {
    super(props);
  }

  showModal = listing => {
    this.props.showModal(listing);
  };

  parseListings = listings => {
    let earliest = moment().hour(20);
    let latest = moment().hour(0);
    let parsedCourses = [];
    listings.forEach(course => {
      const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      for (var indx = 0; indx < 5; indx++) {
        const info = course['course.times_by_day.' + weekDays[indx]];
        if (info !== undefined) {
          const start = moment(info[0][0], 'HH:mm').day(1 + indx);
          const end = moment(info[0][1], 'HH:mm').day(1 + indx);
          if (start.get('hour') < 8) start.add('h', 12);
          if (end.get('hour') < 8) end.add('h', 12);
          const value = course.course_code;
          parsedCourses[parsedCourses.length] = {
            title: value,
            start: start.toDate(),
            end: end.toDate(),
            listing: course,
          };
          if (start.get('hours') < earliest.get('hours')) earliest = start;
          if (end.get('hours') > latest.get('hours')) latest = end;
        }
      }
    });
    earliest.set({ minute: 0 });
    latest.set({ minute: 0 });
    return [earliest, latest, parsedCourses];
  };

  render() {
    var ret_values = this.parseListings(this.props.courses);
    const localizer = momentLocalizer(moment);
    return (
      <Calendar
        defaultView={'work_week'}
        views={['work_week']}
        events={ret_values[2]}
        min={ret_values[0].subtract(0, 'hours').toDate()}
        max={ret_values[1].add(1, 'hours').toDate()}
        localizer={localizer}
        toolbar={false}
        onSelectEvent={(event, e) => this.showModal(event.listing)}
      />
    );
  }
}
