import { describe, expect, it } from 'vitest';

import {
  getFinalsCalendarEvents,
  getFinalsWeekRange,
  parseFinalExamDate,
  readingPeriodStart,
} from './finalExam';
import type { CatalogListing } from '../queries/api';
import type { Crn } from '../queries/graphql-types';
import type { WorksheetCourse } from '../types/worksheetCourse';

function makeWorksheetCourse(overrides: {
  crn?: number;
  courseCode?: string;
  title?: string;
  finalExam?: string | null;
  hidden?: boolean | null;
}): WorksheetCourse {
  const listing = {
    crn: (overrides.crn ?? 10001) as Crn,
    course_code: overrides.courseCode ?? 'CPSC 3230',
    course: {
      title: overrides.title ?? 'Systems Programming',
      final_exam: overrides.finalExam ?? null,
    },
  } as CatalogListing;
  return {
    crn: listing.crn,
    color: '#3366ff',
    listing,
    hidden: overrides.hidden ?? false,
  };
}

describe('parseFinalExamDate', () => {
  it('parses a morning exam', () => {
    const date = parseFinalExamDate('Friday, December 13, 2024 at 9am');
    expect(date).toEqual(new Date(2024, 11, 13, 9, 0));
  });

  it('parses an afternoon exam', () => {
    const date = parseFinalExamDate('Monday, December 15, 2025 at 2pm');
    expect(date).toEqual(new Date(2025, 11, 15, 14, 0));
  });

  it('parses an evening exam with explicit minutes', () => {
    const date = parseFinalExamDate('Monday, December 15, 2025 at 7:30pm');
    expect(date).toEqual(new Date(2025, 11, 15, 19, 30));
  });

  it('parses 12am/12pm correctly', () => {
    expect(parseFinalExamDate('Friday, May 1, 2026 at 12am')).toEqual(
      new Date(2026, 4, 1, 0, 0),
    );
    expect(parseFinalExamDate('Friday, May 1, 2026 at 12pm')).toEqual(
      new Date(2026, 4, 1, 12, 0),
    );
  });

  it('returns null for unannounced exams', () => {
    expect(parseFinalExamDate('HTBA')).toBeNull();
  });

  it('returns null for courses with no final exam', () => {
    expect(parseFinalExamDate('No regular final examination')).toBeNull();
  });

  it('returns null for null/undefined/unparseable input', () => {
    expect(parseFinalExamDate(null)).toBeNull();
    expect(parseFinalExamDate(undefined)).toBeNull();
    expect(parseFinalExamDate('not a date')).toBeNull();
  });
});

describe('getFinalsWeekRange', () => {
  it('returns null for an empty list', () => {
    expect(getFinalsWeekRange([])).toBeNull();
  });

  it('spans a single week when all dates fall in it', () => {
    // Wednesday, December 10, 2025 and Friday, December 12, 2025
    const range = getFinalsWeekRange([
      new Date(2025, 11, 10, 9),
      new Date(2025, 11, 12, 14),
    ]);
    // Monday, December 8, 2025 through Sunday, December 14, 2025
    expect(range).toEqual({
      start: new Date(2025, 11, 8),
      end: new Date(2025, 11, 14),
    });
  });

  it('spans multiple weeks when dates cross a week boundary', () => {
    // Wednesday, December 10, 2025 and Tuesday, December 16, 2025
    const range = getFinalsWeekRange([
      new Date(2025, 11, 10, 9),
      new Date(2025, 11, 16, 14),
    ]);
    expect(range).toEqual({
      start: new Date(2025, 11, 8),
      end: new Date(2025, 11, 21),
    });
  });

  it('treats a Sunday exam as the last day of its week', () => {
    // Sunday, December 14, 2025
    const range = getFinalsWeekRange([new Date(2025, 11, 14, 9)]);
    expect(range).toEqual({
      start: new Date(2025, 11, 8),
      end: new Date(2025, 11, 14),
    });
  });

  it('anchors to the Monday on/after reading period start, padded to two weeks', () => {
    // Reading period starts Saturday, December 6, 2025 -> next Monday is Dec 8
    const range = getFinalsWeekRange([], new Date(2025, 11, 6));
    expect(range).toEqual({
      start: new Date(2025, 11, 8),
      end: new Date(2025, 11, 21),
    });
  });

  it('does not skip class days when reading period already starts on a Monday', () => {
    const range = getFinalsWeekRange([], new Date(2025, 11, 8));
    expect(range).toEqual({
      start: new Date(2025, 11, 8),
      end: new Date(2025, 11, 21),
    });
  });

  it('is unaffected by an exam that already falls within the two-week pad', () => {
    // Reading period starts Sat, Dec 6 (-> Mon Dec 8); exam on Dec 18 is
    // already within the padded Dec 8-21 window.
    const range = getFinalsWeekRange(
      [new Date(2025, 11, 18, 9)],
      new Date(2025, 11, 6),
    );
    expect(range).toEqual({
      start: new Date(2025, 11, 8),
      end: new Date(2025, 11, 21),
    });
  });

  it('extends past the two-week pad when a real exam falls later', () => {
    // Reading period starts Sat, Dec 6 (-> Mon Dec 8); exam on Dec 26 falls
    // outside the padded Dec 8-21 window.
    const range = getFinalsWeekRange(
      [new Date(2025, 11, 26, 9)],
      new Date(2025, 11, 6),
    );
    expect(range).toEqual({
      start: new Date(2025, 11, 8),
      end: new Date(2025, 11, 28),
    });
  });
});

describe('readingPeriodStart', () => {
  it('returns the day after the last day of class', () => {
    expect(readingPeriodStart([2025, 12, 5])).toEqual(new Date(2025, 11, 6));
  });

  it('rolls over to the next month', () => {
    expect(readingPeriodStart([2025, 11, 30])).toEqual(new Date(2025, 11, 1));
  });
});

describe('getFinalsCalendarEvents', () => {
  it('skips courses with no scheduled exam', () => {
    const htba = makeWorksheetCourse({ finalExam: 'HTBA' });
    const noExam = makeWorksheetCourse({
      crn: 2,
      finalExam: 'No regular final examination',
    });
    expect(getFinalsCalendarEvents('ics', [htba, noExam])).toEqual([]);
  });

  it('skips hidden courses', () => {
    const hidden = makeWorksheetCourse({
      finalExam: 'Friday, December 12, 2025 at 9am',
      hidden: true,
    });
    expect(getFinalsCalendarEvents('ics', [hidden])).toEqual([]);
  });

  it('builds a one-off ICS event 2 hours long, with no recurrence rule', () => {
    const course = makeWorksheetCourse({
      finalExam: 'Friday, December 12, 2025 at 9am',
    });
    const [event] = getFinalsCalendarEvents('ics', [course]);
    expect(event).toContain('SUMMARY:CPSC 3230 Final Exam');
    expect(event).toContain('DTSTART;TZID=America/New_York:20251212T090000');
    expect(event).toContain('DTEND;TZID=America/New_York:20251212T110000');
    expect(event).not.toContain('RRULE');
  });

  it('builds a one-off Google Calendar event 2 hours long', () => {
    const course = makeWorksheetCourse({
      finalExam: 'Friday, December 12, 2025 at 9am',
    });
    const [event] = getFinalsCalendarEvents('gcal', [course]);
    expect(event).toMatchObject({
      summary: 'CPSC 3230 Final Exam',
      start: { dateTime: '2025-12-12T09:00:00', timeZone: 'America/New_York' },
      end: { dateTime: '2025-12-12T11:00:00', timeZone: 'America/New_York' },
    });
    expect(event!.recurrence).toBeUndefined();
  });
});
