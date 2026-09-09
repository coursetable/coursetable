// Final exam info comes from the registrar as unstructured free text, e.g.
// "Friday, December 13, 2024 at 9am". These are the only two known sentinel
// values that mean "no scheduled exam" rather than an unparsed date.
const NO_EXAM_VALUES = new Set(['HTBA', 'No regular final examination']);

const FINAL_EXAM_PATTERN =
  /^\w+, (\w+) (\d{1,2}), (\d{4}) at (\d{1,2})(?::(\d{2}))?(am|pm)$/u;

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
  if (!match) return null;
  const [, monthName, day, year, hour, minute, meridiem] = match as [
    string,
    string,
    string,
    string,
    string,
    string | undefined,
    string,
  ];
  const month = MONTHS.indexOf(monthName);
  if (month === -1) return null;
  let hour24 = parseInt(hour, 10) % 12;
  if (meridiem === 'pm') hour24 += 12;
  return new Date(
    parseInt(year, 10),
    month,
    parseInt(day, 10),
    hour24,
    minute ? parseInt(minute, 10) : 0,
  );
}
