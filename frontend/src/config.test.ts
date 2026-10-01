import { describe, expect, it } from 'vitest';

import {
  academicCalendars,
  CUR_SEASON,
  CUR_YEAR,
  type SimpleDate,
} from './config';
import type { Season } from './queries/graphql-types';

function toUTC([year, month, day]: SimpleDate): number {
  return Date.UTC(year, month - 1, day);
}

describe('academicCalendars', () => {
  const seasons = Object.entries(academicCalendars) as [
    Season,
    (typeof academicCalendars)[Season],
  ][];

  it('uses season keys of the form YYYYs where s is 1–3', () => {
    for (const [season] of seasons) expect(season).toMatch(/^\d{4}0[123]$/u);
  });

  it('keeps each semester start on or before its end', () => {
    for (const [, calendar] of seasons)
      expect(toUTC(calendar.start)).toBeLessThanOrEqual(toUTC(calendar.end));
  });

  it('keeps each break start on or before its end', () => {
    for (const [, calendar] of seasons) {
      for (const semesterBreak of calendar.breaks) {
        expect(toUTC(semesterBreak.start)).toBeLessThanOrEqual(
          toUTC(semesterBreak.end),
        );
      }
    }
  });

  it('keeps breaks inside or within a week before the semester window', () => {
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    for (const [, calendar] of seasons) {
      for (const semesterBreak of calendar.breaks) {
        expect(toUTC(semesterBreak.start)).toBeLessThanOrEqual(
          toUTC(calendar.end),
        );
        expect(toUTC(semesterBreak.end)).toBeGreaterThanOrEqual(
          toUTC(calendar.start) - oneWeekMs,
        );
      }
    }
  });

  it('keeps transfer days as weekdays 1–5 inside the semester', () => {
    for (const [, calendar] of seasons) {
      for (const transfer of calendar.transfers) {
        expect(transfer.day).toBeGreaterThanOrEqual(1);
        expect(transfer.day).toBeLessThanOrEqual(5);
        expect(toUTC(transfer.date)).toBeGreaterThanOrEqual(
          toUTC(calendar.start),
        );
        expect(toUTC(transfer.date)).toBeLessThanOrEqual(toUTC(calendar.end));
      }
    }
  });

  it('uses spring/fall start months that match the season code', () => {
    for (const [season, calendar] of seasons) {
      const seasonDigit = Number(season[5]);
      const [, startMonth] = calendar.start;
      if (seasonDigit === 1) expect(startMonth).toBe(1);
      if (seasonDigit === 3) expect([8, 9]).toContain(startMonth);
    }
  });

  it('includes the current season used by the catalog/worksheet defaults', () => {
    expect(academicCalendars).toHaveProperty(CUR_SEASON);
  });

  it('includes every season listed in CUR_YEAR that has a calendar', () => {
    // Summer terms may omit calendars; spring/fall defaults should exist.
    for (const season of CUR_YEAR) {
      const seasonDigit = Number(season[5]);
      if (seasonDigit === 1 || seasonDigit === 3)
        expect(academicCalendars).toHaveProperty(season);
    }
  });
});
