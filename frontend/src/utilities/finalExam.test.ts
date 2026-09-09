import { describe, expect, it } from 'vitest';

import { parseFinalExamDate } from './finalExam';

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
