import { v4 as uuidv4 } from 'uuid';
import { Listing } from '../../Providers/FerryProvider';
import moment from 'moment';

const TBA_STRING = 'TBA';

const getISODateString = (day: number, time: string, reference: Date) => {
  const ret = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate() + (day - reference.getDay())
  );

  let [hourString, minuteString] = time.split(':');
  let hour = parseInt(hourString);
  let minute = parseInt(minuteString);

  ret.setHours(hour);
  ret.setMinutes(minute);

  return moment(ret).format();
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

const ISOtoICalFormat = (iso: string) => {
  return iso
    .replace(/[-:]/g, '') // Remove the hyphens and colons
    .substring(0, 15); // Remove timezone
}

export const constructCalendarEvent = (course: Listing, colorIndex: number) => {
  if (course.times_summary === TBA_STRING) {
    console.warn('TBA course', course.title);
    return;
  }

  const first_of_semester = course.season_code === "202303" ? new Date("2023-08-30") : new Date("2024-01-16");
  const end_of_semester = course.season_code === "202303" ? "20231208T115959Z" : "20240426T115959Z";

  const { days, startTime, endTime } = getTimes(course.times_by_day);
  const calendarStartTime = getISODateString(days[0], startTime, first_of_semester);
  const calendarEndTime = getISODateString(days[0], endTime, first_of_semester);

  let breaks = "";
  if (course.season_code === "202303") {
    const fall_break = new Date("2023-10-18")
    for (const day of days) {
      if (day > fall_break.getDay()) {
        breaks += ISOtoICalFormat(getISODateString(day, startTime, fall_break)) + ",";
      }
    }

    const thanksgiving_break = new Date("2023-11-20");
    for (const day of days) {
      breaks += ISOtoICalFormat(getISODateString(day, startTime, thanksgiving_break)) + ",";
    }
  } else if (course.season_code === "202401") {
    const spring_break_w1 = new Date("2024-03-11");
    for (const day of days) {
      breaks += ISOtoICalFormat(getISODateString(day, startTime, spring_break_w1)) + ",";
    }
    
    const spring_break_w2 = new Date("2024-03-18");
    for (const day of days) {
      breaks += ISOtoICalFormat(getISODateString(day, startTime, spring_break_w2)) + ",";
    }
  }

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
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: calendarEndTime,
      timeZone: 'America/New_York',
    },
    recurrence: [
      `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${end_of_semester}`,
      `EXDATE;TZID=America/New_York:${breaks}`,
    ],
    colorId: (colorIndex + 1).toString(),
  };

  return event;
};