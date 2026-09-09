import { describe, expect, it } from 'vitest';

import { getFinalsWeekRange, parseFinalExamDate } from './finalExam';

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
});
