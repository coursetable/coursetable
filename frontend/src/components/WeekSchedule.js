import React from 'react';
import moment from 'moment';
import WeekCalendar from 'react-week-calendar';
import Event from './ScheduleEvent';
import 'react-week-calendar/dist/style.css';
import styles from './WeekSchedule.js';

export default class WeekSchedule extends React.Component {
  constructor(props) {
    super(props);
  }

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
            value: value,
            start: start,
            end: end,
          };
          if (start.get('hours') < earliest.get('hours')) earliest = start;
          if (end.get('hours') > latest.get('hours')) latest = end;
        }
      }
    });
    return [earliest, latest, parsedCourses];
  };

  handleEventRemove = event => {
    const { selectedIntervals } = this.state;
    const index = selectedIntervals.findIndex(
      interval => interval.uid === event.uid
    );
    if (index > -1) {
      selectedIntervals.splice(index, 1);
      this.setState({ selectedIntervals });
    }
  };

  handleEventUpdate = event => {
    const { selectedIntervals } = this.state;
    const index = selectedIntervals.findIndex(
      interval => interval.uid === event.uid
    );
    if (index > -1) {
      selectedIntervals[index] = event;
      this.setState({ selectedIntervals });
    }
  };

  handleSelect = newIntervals => {
    const { lastUid, selectedIntervals } = this.state;
    const intervals = newIntervals.map((interval, index) => {
      return {
        ...interval,
        uid: lastUid + index,
      };
    });

    this.setState({
      selectedIntervals: selectedIntervals.concat(intervals),
      lastUid: lastUid + newIntervals.length,
    });
  };

  render() {
    var ret_values = this.parseListings(this.props.courses);
    console.log(ret_values);
    return (
      <WeekCalendar
        firstDay={moment().day(1)}
        startTime={moment({
          h: ret_values[0].get('hours') - 1,
          m: ret_values[0].get('minutes'),
        })}
        endTime={moment({
          h: ret_values[1].get('hours') + 1,
          m: ret_values[1].get('minutes'),
        })}
        numberOfDays={5}
        selectedIntervals={ret_values[2]}
        onIntervalSelect={this.handleSelect}
        onIntervalUpdate={this.handleEventUpdate}
        onIntervalRemove={this.handleEventRemove}
        eventSpacing={15}
        scaleUnit={30}
        eventComponent={Event}
      />
    );
  }
}
