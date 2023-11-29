import { v4 as uuidv4 } from 'uuid';
import { weekdays, type Listing } from '../../../utilities/common';
import moment from 'moment';

const getISODateString = (day: number, time: string, reference: Date) => {
  const ret = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate() + ((((day - reference.getDay() - 1) % 7) + 7) % 7) + 1, // positive remainder (1-7)
  );

  const [hourString, minuteString] = time.split(':');
  const hour = parseInt(hourString);
  const minute = parseInt(minuteString);

  ret.setHours(hour);
  ret.setMinutes(minute);

  return moment(ret).format();
};

const getTimes = (times_by_day: Listing['times_by_day']) => {
  const times: {
    days: number[];
    startTime: string;
    endTime: string;
    location: string;
  }[] = [];

  for (let idx = 1; idx <= 5; idx++) {
    const info = times_by_day[weekdays[idx - 1]];
    if (!info) continue;
    for (const [startTime, endTime, location] of info) {
      const time = times.find(
        (t) => t.startTime === startTime && t.endTime === endTime,
      );
      if (time) {
        time.days.push(idx);
      } else {
        times.push({ days: [idx], startTime, endTime, location });
      }
    }
  }
  return times;
};

const ISOtoICalFormat = (iso: string) =>
  iso
    .replace(/[-:]/g, '') // Remove the hyphens and colons
    .substring(0, 15); // Remove timezone

export const constructCalendarEvents = (
  course: Listing,
  colorIndex: number,
) => {
  const first_of_semester =
    course.season_code === '202303'
      ? new Date('2023-08-30')
      : new Date('2024-01-16');
  const end_of_semester =
    course.season_code === '202303' ? '20231208T115959Z' : '20240426T115959Z';
  return getTimes(course.times_by_day).map(
    ({ days, startTime, endTime, location }) => {
      let calendarStartTime,
        calendarEndTime = '';
      for (const day of days) {
        if (day > first_of_semester.getDay()) {
          calendarStartTime = getISODateString(
            day,
            startTime,
            first_of_semester,
          );
          calendarEndTime = getISODateString(day, endTime, first_of_semester);
          break;
        }
      }
      if (!calendarStartTime) {
        calendarStartTime = getISODateString(
          days[0],
          startTime,
          first_of_semester,
        );
        calendarEndTime = getISODateString(days[0], endTime, first_of_semester);
      }

      let breaks = '';
      if (course.season_code === '202303') {
        const fall_break = new Date('2023-10-18');
        for (const day of days) {
          if (day > fall_break.getDay()) {
            breaks +=
              ISOtoICalFormat(getISODateString(day, startTime, fall_break)) +
              ',';
          }
        }

        const thanksgiving_break = new Date('2023-11-20');
        for (const day of days) {
          breaks +=
            ISOtoICalFormat(
              getISODateString(day, startTime, thanksgiving_break),
            ) + ',';
        }
      } else if (course.season_code === '202401') {
        const spring_break_w1 = new Date('2024-03-11');
        for (const day of days) {
          breaks +=
            ISOtoICalFormat(getISODateString(day, startTime, spring_break_w1)) +
            ',';
        }

        const spring_break_w2 = new Date('2024-03-18');
        for (const day of days) {
          breaks +=
            ISOtoICalFormat(getISODateString(day, startTime, spring_break_w2)) +
            ',';
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

      return {
        id: 'coursetable' + uuidv4().replace(/-/g, ''),
        summary: course.course_code,
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
        description: course.title,
        location,
      };
    },
  );
};
