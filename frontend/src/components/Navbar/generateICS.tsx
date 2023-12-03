import moment from 'moment';
import { toast } from 'react-toastify';
import { weekdays, type Listing } from '../../utilities/common';
import { toSeasonString } from '../../utilities/courseUtilities';
import * as Sentry from '@sentry/react';
import ics from 'ics';
import FileSaver from 'file-saver';

// Is this day during a break?
const onBreak = (day: moment.Moment) => {
  // Spring 2023 Breaks
  const breaks = [[moment('2023-03-11T00:01'), moment('2023-03-26T23:59')]];

  for (let i = 0; i < breaks.length; i++) {
    if (day >= breaks[i][0] && day <= breaks[i][1]) return true;
  }
  return false;
};

// generate ICS file and download it
export const generateICS = (listings_all: Listing[]) => {
  // Season to export
  const cur_season = '202303';

  // Fall 2023 period
  const period = [moment('2023-08-30T08:20'), moment('2023-12-08T17:30')];

  // Only get courses for the current season that have valid times
  const listings: Listing[] = [];
  listings_all.forEach((listing) => {
    if (!listing.times_summary || listing.times_summary === 'TBA') return;
    if (listing.season_code === cur_season) listings.push(listing);
  });

  // Convert season code to season string
  const season_string = toSeasonString(cur_season);
  if (!listings.length) {
    toast.error(
      `Worksheet for ${season_string[2]}, ${season_string[1]} is empty`,
    );
    return;
  }

  // List of events to export to ICS
  const events = [];
  // Iterate through each day in the current day
  for (let day = period[0]; day <= period[1]; day.add(1, 'day')) {
    // Skip weekends and breaks
    if (day.day() === 6 || day.day() === 0) continue;
    if (onBreak(day)) continue;
    // Get current day of the week in string form
    const weekday = weekdays[day.day() - 1];
    // Iterate through listings in the worksheet
    for (const listing of listings) {
      const info = listing.times_by_day[weekday];
      // Continue if the course doesn't take place on this day of the week
      if (info === undefined) continue;
      for (const [startTime, endTime, location] of info) {
        // Get start and end times of the listing
        const start = moment(startTime, 'HH:mm')
          .month(day.month())
          .date(day.date())
          .year(day.year());
        const end = moment(endTime, 'HH:mm')
          .month(day.month())
          .date(day.date())
          .year(day.year());
        // Correct hour
        if (start.hour() < 7) start.add(12, 'h');
        if (end.hour() < 7) end.add(12, 'h');
        // Calculate duration
        const duration = end.diff(start, 'minutes');
        // Add listing to events list
        events.push({
          title: listing.course_code,
          description: listing.title,
          location,
          start: [
            start.year(),
            start.month() + 1,
            start.date(),
            start.hour(),
            start.minute(),
          ] as [number, number, number, number, number],
          duration: { minutes: duration },
        });
      }
    }
  }

  // Export to ICS
  ics.createEvents(events, (error, value) => {
    if (error) {
      Sentry.captureException(error);
      toast.error('Error Generating ICS File');
      return;
    }
    // Download to user's computer
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    FileSaver.saveAs(
      blob,
      `${moment().format('YYYY-MM-DD--hh-mma')}_worksheet.ics`,
    );
  });
};
