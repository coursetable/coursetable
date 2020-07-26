import moment from 'moment';
import { toast } from 'react-toastify';
import { toSeasonString } from '../utilities';
const FileSaver = require('file-saver');
const ics = require('ics');

const onBreak = (day) => {
  // Spring 2020 Breaks
  // const breaks = [
  //   [moment('2020-01-20T00:01'), moment('2020-01-20T23:59')],
  //   [moment('2020-03-06T17:30'), moment('2020-03-23T08:19')],
  // ];

  // Fall 2020 Breaks
  const breaks = [[moment('2020-11-21T00:01'), moment('2020-11-30T08:19')]];

  for (let i = 0; i < breaks.length; i++) {
    if (day >= breaks[i][0] && day <= breaks[i][1]) return true;
  }
  return false;
};

export const generateICS = (listings_all) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const cur_season = '202003';
  // Spring 2020 period
  // const period = [moment('2020-01-13T08:20'), moment('2020-04-24T17:30')];

  // Fall 2020 period
  const period = [moment('2020-08-31T08:20'), moment('2020-12-04T17:30')];

  let listings = [];
  listings_all.forEach((listing) => {
    if (listing.season_code === cur_season) listings.push(listing);
  });
  const season_string = toSeasonString(cur_season);
  if (!listings.length) {
    toast.error(
      `Worksheet for ${season_string[2]}, ${season_string[1]} is empty`
    );
    return;
  }

  let events = [];
  for (let day = period[0]; day <= period[1]; day.add(1, 'day')) {
    if (day.day() === 6 || day.day() === 0) continue;
    if (onBreak(day)) continue;
    // console.log(day.format('dddd, MMMM Do YYYY, h:mm:ss a'));
    const weekday = weekdays[day.day() - 1];
    for (const listing of listings) {
      const info = listing['course.times_by_day.' + weekday];
      if (info === undefined) continue;
      let start = moment(info[0][0], 'HH:mm')
        .dayOfYear(day.dayOfYear())
        .year(day.year());
      let end = moment(info[0][1], 'HH:mm')
        .dayOfYear(day.dayOfYear())
        .year(day.year());
      if (start.hour() < 8) start.add(12, 'h');
      if (end.hour() < 8) end.add(12, 'h');
      const duration = end.diff(start, 'minutes');
      events.push({
        title: listing['course_code'],
        description: listing['course.title'],
        location: listing['course.locations_summary'],
        start: [
          start.year(),
          start.month() + 1,
          start.date(),
          start.hour(),
          start.minute(),
        ],
        duration: { minutes: duration },
      });
    }
  }

  ics.createEvents(events, (error, value) => {
    if (error) {
      console.log(error);
      toast.error('Error Generating ICS File');
      return;
    }
    let blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    FileSaver.saveAs(blob, 'worksheet.ics');
  });
};
