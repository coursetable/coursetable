import { v4 as uuidv4 } from 'uuid';
import type { GCalEvent, ICSEvent } from './calendar';
import type { SimpleDate } from '../config';
import type { WorksheetCourse } from '../slices/WorksheetSlice';

// Final exam info comes from the registrar as unstructured free text, e.g.
// "Friday, December 13, 2024 at 9am". These are the only two known sentinel
// values that mean "no scheduled exam" rather than an unparsed date.
const NO_EXAM_VALUES = new Set(['HTBA', 'No regular final examination']);

const FINAL_EXAM_PATTERN =
  /^\w+, (?<month>\w+) (?<day>\d{1,2}), (?<year>\d{4}) at (?<hour>\d{1,2})(?::(?<minute>\d{2}))?(?<meridiem>am|pm)$/u;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Parses a `course.final_exam` string into a `Date`, or `null` if the course
 * has no scheduled final (not yet announced, or none required).
 */
export function parseFinalExamDate(
  finalExam: string | null | undefined,
): Date | null {
  if (!finalExam || NO_EXAM_VALUES.has(finalExam)) return null;
  const match = FINAL_EXAM_PATTERN.exec(finalExam);
  if (!match?.groups) return null;
  const { month: monthName, day, year, hour, minute, meridiem } = match.groups;
  const month = MONTHS.indexOf(monthName!);
  if (month === -1) return null;
  let hour24 = parseInt(hour!, 10) % 12;
  if (meridiem === 'pm') hour24 += 12;
  return new Date(
    parseInt(year!, 10),
    month,
    parseInt(day!, 10),
    hour24,
    minute ? parseInt(minute, 10) : 0,
  );
}

function startOfWeek(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  // Shift back to Monday (day 1); Sunday (day 0) is 6 days after Monday.
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d;
}

function nextMondayOnOrAfter(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  d.setDate(d.getDate() + ((8 - day) % 7));
  return d;
}

/**
 * The first day of reading period: the day after the last day of class, as
 * recorded in `academicCalendars` (see `config.ts`). Used to anchor the
 * finals view even before every course's exam has been announced.
 */
export function readingPeriodStart(lastDayOfClass: SimpleDate): Date {
  const [year, month, day] = lastDayOfClass;
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + 1);
  return d;
}

/**
 * Given a set of final exam dates, returns the Monday-to-Sunday week span
 * (inclusive, covering every full week that contains a date) that contains
 * all of them, or `null` if there are none.
 *
 * When `anchor` (typically `readingPeriodStart`) is given, the range starts
 * at the first Monday on or after it (skipping any remaining class days) and
 * always spans at least two weeks from there, so the reading period and exam
 * period are both visible even if few or no finals have been announced yet.
 */
export function getFinalsWeekRange(
  dates: Date[],
  anchor?: Date,
): { start: Date; end: Date } | null {
  const effectiveAnchor = anchor ? nextMondayOnOrAfter(anchor) : undefined;
  const allDates = effectiveAnchor ? [effectiveAnchor, ...dates] : dates;
  if (allDates.length === 0) return null;
  const times = allDates.map((d) => d.getTime());
  const start = startOfWeek(new Date(Math.min(...times)));
  let end = startOfWeek(new Date(Math.max(...times)));
  end.setDate(end.getDate() + 6);
  if (effectiveAnchor) {
    const minEnd = new Date(start);
    minEnd.setDate(minEnd.getDate() + 13);
    if (end.getTime() < minEnd.getTime()) end = minEnd;
  }
  return { start, end };
}

// The registrar doesn't publish exam end times (only the start, e.g. "9am"),
// so we assume Yale's standard final exam length.
const FINAL_EXAM_DURATION_HOURS = 2;

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

/**
 * Encodes a local wall-clock date/time as a naive ISO string (no real UTC
 * conversion), the same trick `isoString` in `utilities/calendar.ts` uses:
 * the timezone is communicated separately (as America/New_York) rather than
 * baked into this string.
 */
function naiveISOString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

export function getFinalsCalendarEvents(
  type: 'gcal',
  courses: WorksheetCourse[],
): GCalEvent[];
export function getFinalsCalendarEvents(
  type: 'ics',
  courses: WorksheetCourse[],
): ICSEvent[];
export function getFinalsCalendarEvents(
  type: 'gcal' | 'ics',
  courses: WorksheetCourse[],
) {
  const events: (GCalEvent | ICSEvent)[] = [];
  for (const course of courses) {
    if (course.hidden) continue;
    const start = parseFinalExamDate(course.listing.course.final_exam);
    if (!start) continue;
    const end = new Date(start);
    end.setHours(end.getHours() + FINAL_EXAM_DURATION_HOURS);
    const summary = `${course.listing.course_code} Final Exam`;
    const description = `${course.listing.course.title}\nFinal exam`;
    const startStr = naiveISOString(start);
    const endStr = naiveISOString(end);
    if (type === 'gcal') {
      events.push({
        id: `coursetablefinals${uuidv4().replace(/-/gu, '')}`,
        summary,
        start: { dateTime: startStr, timeZone: 'America/New_York' },
        end: { dateTime: endStr, timeZone: 'America/New_York' },
        description,
      });
    } else {
      events.push(`BEGIN:VEVENT
DESCRIPTION:${description.replaceAll('\n', '\\r\\n')}
DTEND;TZID=America/New_York:${endStr.replace(/[:-]/gu, '')}
DTSTART;TZID=America/New_York:${startStr.replace(/[:-]/gu, '')}
SUMMARY:${summary}
TRANSP:OPAQUE
END:VEVENT`);
    }
  }
  return events;
}
