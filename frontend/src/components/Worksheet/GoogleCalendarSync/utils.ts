import { v4 as uuidv4 } from 'uuid';
import { Listing } from '../../Providers/FerryProvider';

const TBA_STRING = 'TBA';

export const getISODateString = (day: number, time: string) => {
  const now = new Date();
  const ret = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + (day - now.getDay()),
  );

  let [hourString, minuteString] = time.split(':');
  let hour = parseInt(hourString);
  let minute = parseInt(minuteString);

  ret.setHours(hour);
  ret.setMinutes(minute);
  return ret.toISOString();
};

const getTimes = (times_by_day: any) => {
  const daysMapping: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  const days = [];

  let startTime, endTime;

  for (const day of Object.keys(times_by_day)) {
    days.push(daysMapping[day]);
    const times = times_by_day[day][0];
    // Assuming each day starts and ends at the same time for now
    startTime = times[0];
    endTime = times[1];
  }

  return {
    days,
    startTime,
    endTime,
  };
};

export const constructCalendarEvent = (course: Listing, colorIndex: number) => {
  if (course.times_summary === TBA_STRING) {
    console.warn('TBA course', course.title);
    return;
  }
  const { days, startTime, endTime } = getTimes(course.times_by_day);
  const calendarStartTime = getISODateString(days[0], startTime);
  const calendarEndTime = getISODateString(days[0], endTime);

  const byDayMapping: Record<number, string> = {
    0: 'SU',
    1: 'MO',
    2: 'TU',
    3: 'WE',
    4: 'TH',
    5: 'FR',
    6: 'SA',
  };

  const byDay = days.map((day) => byDayMapping[day]).join(',');

  const event = {
    id: 'coursetable' + uuidv4().replace(/-/g, ""),
    summary: course.title,
    start: {
      dateTime: calendarStartTime,
      timeZone: 'America/New_York', // Time zone
    },
    end: {
      dateTime: calendarEndTime,
      timeZone: 'America/New_York',
    },
    recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${byDay}`],
    colorId: (colorIndex + 1).toString(),
  };
  return event;
};