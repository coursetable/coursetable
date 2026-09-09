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

/**
 * Given a set of final exam dates, returns the Monday-to-Sunday week span
 * (inclusive, covering every full week that contains a date) that contains
 * all of them, or `null` if there are none.
 */
export function getFinalsWeekRange(
  dates: Date[],
): { start: Date; end: Date } | null {
  if (dates.length === 0) return null;
  const times = dates.map((d) => d.getTime());
  const start = startOfWeek(new Date(Math.min(...times)));
  const end = startOfWeek(new Date(Math.max(...times)));
  end.setDate(end.getDate() + 6);
  return { start, end };
}
