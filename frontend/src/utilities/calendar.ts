import { DateLocalizer, type DateLocalizerSpec } from 'react-big-calendar';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { weekdays } from './constants';
import { toSeasonString } from './course';
import {
  academicCalendars,
  type SimpleDate,
  type SeasonCalendar,
} from '../config';
import type { CatalogListing } from '../queries/api';
import type { Season } from '../queries/graphql-types';
import type { WorksheetCourse } from '../slices/WorksheetSlice';

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
    const [hourString, minuteString] = time.split(':') as [string, string];
    const hour = parseInt(hourString, 10);
    const minute = parseInt(minuteString, 10);
    d.setUTCHours(hour);
    d.setUTCMinutes(minute);
  }
  return d.toISOString().substring(0, 'YYYY-MM-DDTHH:mm:ss'.length);
}

/**
 * For example, it finds the first Tuesday/Thursday after the semester starts,
 * whichever is earlier. If semester also starts on Tuesday, it returns the
 * same Tuesday.
 *
 * @param reference A day that is less than a week ago away from the date in
 * question.
 * @param days Day of the week, 1–5. Will return the day in the list that leads
 * to the earliest date.
 * @returns The date in question.
 */
function firstDaySince(reference: Date | SimpleDate, days: number[]) {
  const referenceDate = new Date(
    Array.isArray(reference)
      ? Date.UTC(reference[0], reference[1] - 1, reference[2])
      : reference,
  );
  const offsets = days.map(
    (day) => (((day - referenceDate.getUTCDay()) % 7) + 7) % 7, // Positive offset (0–6)
  );
  const offset = Math.min(...offsets);
  referenceDate.setUTCDate(referenceDate.getUTCDate() + offset);
  return referenceDate;
}

const dayToCode: { [key: number]: string } = {
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
      date.getTime() <= end;
      date.setUTCDate(date.getUTCDate() + 1)
    )
      if (days.includes(date.getUTCDay())) dates.push(isoString(date, time));
    return dates;
  });
}

function transferDays(
  transfers: SeasonCalendar['transfers'],
  days: number[],
  time: string,
) {
  return transfers.map((t) => {
    const day = new Date(Date.UTC(t.date[0], t.date[1] - 1, t.date[2]));
    if (days.includes(t.day)) return isoString(day, time);
    return '';
  });
}

/**
 * A usage-agnostic representation of a calendar event. It will be converted to
 * a usable format by one of the `to*Event` functions.
 */
type CalendarEvent = {
  summary: string;
  start: string;
  end: string;
  recurrence: string[];
  description: string;
  location: string;
  color: string;
  listing: CatalogListing;
  days: number[];
};

function toGCalEvent({
  summary,
  start,
  end,
  recurrence,
  description,
  location,
}: CalendarEvent): GCalEvent {
  return {
    id: `coursetable${uuidv4().replace(/-/gu, '')}`,
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
}: CalendarEvent): ICSEvent {
  return `BEGIN:VEVENT
DESCRIPTION:${
    // ICS uses **CRLF**
    description.replaceAll('\n', '\\r\\n')
  }
DTEND;TZID=America/New_York:${end.replace(/[:-]/gu, '')}
DTSTART;TZID=America/New_York:${start.replace(/[:-]/gu, '')}
LOCATION:${location}
${recurrence.join('\n')}
SUMMARY:${summary}
TRANSP:OPAQUE
END:VEVENT`;
}

function toRBCEvent({
  summary,
  start,
  end,
  location,
  color,
  listing,
  days,
}: CalendarEvent): RBCEvent[] {
  // These are already LOCAL times because the time strings have no timezone!
  const firstStart = new Date(start);
  const firstEnd = new Date(end);
  // RBC requires all events to be within *the current* week
  const startTime = new Date();
  startTime.setHours(firstStart.getHours(), firstStart.getMinutes(), 0, 0);
  const endTime = new Date();
  endTime.setHours(firstEnd.getHours(), firstEnd.getMinutes(), 0, 0);
  return days.map((day) => {
    const startTimeCpy = new Date(startTime);
    startTimeCpy.setDate(startTimeCpy.getDate() - startTimeCpy.getDay() + day);
    const endTimeCpy = new Date(endTime);
    endTimeCpy.setDate(endTimeCpy.getDate() - endTimeCpy.getDay() + day);
    return {
      title: summary,
      // No instructors for RBC
      description: listing.course.title,
      start: startTimeCpy,
      end: endTimeCpy,
      listing,
      color,
      location,
    };
  });
}

type GCalEvent = gapi.client.calendar.EventInput;
type ICSEvent = string;
export type RBCEvent = {
  title: string;
  description: string;
  start: Date;
  end: Date;
  listing: CatalogListing;
  color: string;
  location: string;
};

export function getCalendarEvents(
  type: 'gcal',
  courses: WorksheetCourse[],
  viewedSeason: Season,
): GCalEvent[];
export function getCalendarEvents(
  type: 'ics',
  courses: WorksheetCourse[],
  viewedSeason: Season,
): ICSEvent[];
export function getCalendarEvents(
  type: 'rbc',
  courses: WorksheetCourse[],
  viewedSeason: Season,
): RBCEvent[];
export function getCalendarEvents(
  type: 'gcal' | 'ics' | 'rbc',
  courses: WorksheetCourse[],
  viewedSeason: Season,
) {
  const seasonString = toSeasonString(viewedSeason);
  const semester = academicCalendars[viewedSeason] as
    | SeasonCalendar
    | undefined;
  if (!semester && type !== 'rbc') {
    toast.error(
      `Can't construct calendar events for ${seasonString} because there is no academic calendar available.`,
    );
    return [];
  }
  const visibleCourses = courses.filter((course) => !course.hidden);
  if (visibleCourses.length === 0) {
    if (type !== 'rbc') toast.error(`No courses in ${seasonString} to export!`);
    return [];
  }
  const toEvent =
    type === 'gcal' ? toGCalEvent : type === 'ics' ? toICSEvent : toRBCEvent;
  const events = visibleCourses.flatMap(({ listing: l, color }) => {
    const endRepeat = semester
      ? isoString(semester.end, '23:59').replace(/[:-]/gu, '')
      : // Irrelevant for rbc
        '';
    return l.course.course_meetings.flatMap<GCalEvent | ICSEvent | RBCEvent>(
      ({
        days_of_week: daysOfWeek,
        start_time: startTime,
        end_time: endTime,
        location,
      }) => {
        const days = Object.values(weekdays).filter(
          (day) => daysOfWeek & (1 << day),
        );
        const firstMeetingDay = semester
          ? firstDaySince(semester.start, days)
          : // Irrelevant for rbc, because it always uses the current date
            new Date();
        const byDay = days.map((day) => dayToCode[day]).join(',');
        const exDate = semester
          ? datesInBreak(semester.breaks, days, startTime)
              .map((s) => s.replace(/[:-]/gu, ''))
              .join(',')
          : // Irrelevant for rbc
            '';
        const rDate = semester
          ? transferDays(semester.transfers, days, startTime)
              .map((s) => s.replace(/[:-]/gu, ''))
              .join(',')
          : // Irrelevant for rbc
            '';

        return toEvent({
          summary: l.course_code,
          start: isoString(firstMeetingDay, startTime),
          end: isoString(firstMeetingDay, endTime),
          recurrence: [
            `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${endRepeat}Z`,
            `EXDATE;TZID=America/New_York:${exDate}`,
            ...(rDate ? [`RDATE;TZID=America/New_York:${rDate}`] : []),
          ],
          description: `${l.course.title}\nInstructor: ${l.course.course_professors.map((p) => p.professor.name).join(', ')}`,
          location: location
            ? `${location.building.code}${location.room ? ` ${location.room}` : ''}`
            : '',
          color,
          listing: l,
          days,
        });
      },
    );
  });
  return events;
}

function formatTime(a: Date) {
  const hours = a.getHours();
  const minutes = a.getMinutes();
  return `${((hours - 1) % 12) + 1}${
    minutes ? `:${minutes.toString().padStart(2, '0')}` : ''
  }${hours < 12 ? 'a' : 'p'}m`;
}

export const localizer = new DateLocalizer({
  firstOfWeek() {
    return 0;
  },
  format() {
    // Everything is already in formats
    return '';
  },
  formats: {
    dayFormat: (a) =>
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][a.getDay()]!,
    timeGutterFormat: (a) => formatTime(a),
    selectRangeFormat: ({ start, end }) =>
      `${formatTime(start)} – ${formatTime(end)}`,
    eventTimeRangeFormat: ({ start, end }) =>
      `${formatTime(start)} – ${formatTime(end)}`,
    eventTimeRangeStartFormat: ({ start }) => `${formatTime(start)} – `,
    eventTimeRangeEndFormat: ({ end }) => ` – ${formatTime(end)}`,
  },
} satisfies Pick<
  DateLocalizerSpec,
  'firstOfWeek' | 'format' | 'formats'
> as unknown as DateLocalizerSpec);
