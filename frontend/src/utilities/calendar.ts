import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { weekdays, type Listing } from './common';
import { toSeasonString } from './courseUtilities';
import {
  academicCalendars,
  type SimpleDate,
  type SeasonCalendar,
} from '../config';

/**
 * The string never has the time zone offset, but it should always be Eastern
 * time.
 */
function isoString(date: Date | SimpleDate, time?: string) {
  const d = Array.isArray(date)
    ? new Date(Date.UTC(date[0], date[1] - 1, date[2]))
    : // Avoid mutations
      new Date(date);
  if (time) {
    const [hourString, minuteString] = time.split(':');
    const hour = parseInt(hourString);
    const minute = parseInt(minuteString);
    d.setUTCHours(hour);
    d.setUTCMinutes(minute);
  }
  return d.toISOString().substring(0, 'YYYY-MM-DDTHH:mm:ss'.length);
}

/**
 * For example, it finds the first Tuesday after the semester starts, for
 * example. If semester also starts on Tuesday, it returns the same Tuesday.
 *
 * @param reference A day that is less than a week ago away from the date in
 * question.
 * @param day Day of the week, 1–5.
 * @param time Time of the day, in the format HH:mm.
 * @returns The date in question, formatted with `isoString`.
 */
function firstDaySince(reference: SimpleDate, day: number, time: string) {
  const referenceDate = new Date(
    Date.UTC(reference[0], reference[1] - 1, reference[2]),
  );
  const offset = (((day - referenceDate.getUTCDay()) % 7) + 7) % 7; // positive remainder (0–6)
  referenceDate.setUTCDate(referenceDate.getUTCDate() + offset);
  return isoString(referenceDate, time);
}

function getTimes(times_by_day: Listing['times_by_day']) {
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
}

const dayToCode: Record<number, string> = {
  0: 'SU',
  1: 'MO',
  2: 'TU',
  3: 'WE',
  4: 'TH',
  5: 'FR',
  6: 'SA',
};

function datesInBreak(
  breaks: SeasonCalendar['breaks'],
  days: number[],
  time: string,
) {
  return breaks.flatMap((b) => {
    const start = new Date(Date.UTC(b.start[0], b.start[1] - 1, b.start[2]));
    const end = Date.UTC(b.end[0], b.end[1] - 1, b.end[2]);
    const dates: string[] = [];
    for (
      const date = start;
      date.getTime() < end;
      date.setUTCDate(date.getUTCDate() + 1)
    ) {
      if (days.includes(date.getUTCDay())) {
        dates.push(isoString(date, time));
      }
    }
    return dates;
  });
}

type CalendarEvent = {
  summary: string;
  start: string;
  end: string;
  recurrence: string[];
  description: string;
  location: string;
  colorIndex?: number;
};

function toGCalEvent({
  summary,
  start,
  end,
  recurrence,
  description,
  location,
  colorIndex,
}: CalendarEvent) {
  return {
    id: 'coursetable' + uuidv4().replace(/-/g, ''),
    summary,
    start: {
      dateTime: start,
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: end,
      timeZone: 'America/New_York',
    },
    recurrence,
    colorId: (colorIndex! + 1).toString(),
    description,
    location,
  };
}

function toICSEvent({
  summary,
  start,
  end,
  recurrence,
  description,
  location,
}: CalendarEvent) {
  return `BEGIN:VEVENT
DESCRIPTION:${description}
DTEND;TZID=America/New_York:${end.replace(/[:-]/g, '')}
DTSTART;TZID=America/New_York:${start.replace(/[:-]/g, '')}
LOCATION:${location}
${recurrence.join('\n')}
SUMMARY:${summary}
TRANSP:OPAQUE
END:VEVENT`;
}

export function constructCalendarEvents(
  course: Listing,
  type: 'gcal',
  colorIndex: number,
): ReturnType<typeof toGCalEvent>[];
export function constructCalendarEvents(course: Listing, type: 'ics'): string[];
export function constructCalendarEvents(
  course: Listing,
  type: 'gcal' | 'ics',
  colorIndex?: number,
) {
  const semester = academicCalendars[course.season_code];
  if (!semester) {
    // Unknown season code; can't construct any event
    const seasonString = toSeasonString(course.season_code);
    toast.error(
      `Can't construct calendar events for ${seasonString} because there is no academic calendar available.`,
    );
    return [];
  }
  const endRepeat = isoString(semester.end, '23:59').replace(/[:-]/g, '');
  const toEvent = type === 'gcal' ? toGCalEvent : toICSEvent;
  const times = getTimes(course.times_by_day);
  return times.map(({ days, startTime, endTime, location }) => {
    const firstMeetingStart = firstDaySince(semester.start, days[0], startTime);
    console.log(semester.start, days[0], firstMeetingStart);
    const firstMeetingEnd = firstDaySince(semester.start, days[0], endTime);
    const byDay = days.map((day) => dayToCode[day]).join(',');
    const exDate = datesInBreak(semester.breaks, days, startTime)
      .map((s) => s.replace(/[:-]/g, ''))
      .join(',');

    // TODO: take care of transfer schedules (see semester.transfer)
    return toEvent({
      summary: course.course_code,
      start: firstMeetingStart,
      end: firstMeetingEnd,
      recurrence: [
        `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${endRepeat}Z`,
        `EXDATE;TZID=America/New_York:${exDate}`,
      ],
      description: course.title,
      location,
      colorIndex,
    });
  });
}
