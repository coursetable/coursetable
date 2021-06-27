/* eslint @typescript-eslint/no-var-requires: "off" */

import moment from 'moment';
import { toast } from 'react-toastify';
import { weekdays } from '../utilities/common';
import { toSeasonString } from '../utilities/courseUtilities';
import * as Sentry from '@sentry/react';
import { Listing } from './Providers/FerryProvider';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ics = require('ics');
const FileSaver = require('file-saver');

// Is this day during a break?
const onBreak = (day: moment.Moment) => {
  // Spring 2021 Breaks
  const breaks = [
    [moment('2021-02-22T00:01'), moment('2021-02-22T23:59')],
    [moment('2021-03-09T00:01'), moment('2021-03-09T23:59')],
    [moment('2021-03-24T00:01'), moment('2021-03-24T23:59')],
    [moment('2021-04-08T00:01'), moment('2021-04-08T23:59')],
    [moment('2021-04-23T00:01'), moment('2021-04-23T23:59')],
  ];

  for (let i = 0; i < breaks.length; i++) {
    if (day >= breaks[i][0] && day <= breaks[i][1]) return true;
  }
  return false;
};

// generate ICS file and download it
export const generateICS = (listings_all: Listing[]) => {
  // Season to export
  const cur_season = '202101';

  // Spring 2021 period
  const period = [moment('2021-02-01T08:20'), moment('2021-05-07T17:30')];

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
      `Worksheet for ${season_string[2]}, ${season_string[1]} is empty`
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
      // Get start and end times of the listing
      const start = moment(info[0][0], 'HH:mm')
        .month(day.month())
        .date(day.date())
        .year(day.year());
      const end = moment(info[0][1], 'HH:mm')
        .month(day.month())
        .date(day.date())
        .year(day.year());
      // Correct hour
      if (start.hour() < 8) start.add(12, 'h');
      if (end.hour() < 8) end.add(12, 'h');
      // Calculate duration
      const duration = end.diff(start, 'minutes');
      // Add listing to evenets list
      events.push({
        title: listing.course_code,
        description: listing.title,
        location: listing.locations_summary,
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

  // Export to ICS
  ics.createEvents(events, (error: any, value: any) => {
    if (error) {
      Sentry.captureException(error);
      toast.error('Error Generating ICS File');
      return;
    }
    // Download to user's computer
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    FileSaver.saveAs(
      blob,
      `${moment().format('YYYY-MM-DD--hh-mma')}_worksheet.ics`
    );
  });
};
