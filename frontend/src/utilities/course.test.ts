import { describe, expect, it } from 'vitest';

import {
  checkConflict,
  type ListingWithTimes,
  to12HourTime,
  toRangeTime,
  toRealTime,
  toSeasonString,
  toWeekdaysDisplayString,
  toWeekdayStrings,
} from './course';
import type { CatalogListing } from '../queries/api';
import type { Crn, Season } from '../queries/graphql-types';
import type { WorksheetCourse } from '../types/worksheetCourse';

/** Bitmasks matching `weekdays` in constants.ts (`1 << dayIndex`). */
const MON = 1 << 1;
const TUE = 1 << 2;
const WED = 1 << 3;
const THU = 1 << 4;
const FRI = 1 << 5;

function makeListing(overrides: {
  crn?: number;
  season?: Season;
  daysOfWeek?: number;
  startTime?: string;
  endTime?: string;
  meetings?: {
    days_of_week: number;
    start_time: string;
    end_time: string;
  }[];
}): CatalogListing {
  const meetings = overrides.meetings ?? [
    {
      days_of_week: overrides.daysOfWeek ?? MON | WED | FRI,
      start_time: overrides.startTime ?? '10:30',
      end_time: overrides.endTime ?? '11:20',
    },
  ];

  return {
    crn: (overrides.crn ?? 10001) as Crn,
    course: {
      season_code: overrides.season ?? ('202603' as Season),
      course_meetings: meetings,
    },
  } as CatalogListing;
}

function makeWorksheetCourse(
  listing: CatalogListing,
  hidden: boolean | null = false,
): WorksheetCourse {
  return {
    crn: listing.crn,
    color: '#ffffff',
    listing,
    hidden,
  };
}

function asCandidate(listing: CatalogListing): ListingWithTimes {
  return listing;
}

describe('checkConflict', () => {
  it('returns no conflicts when the candidate has no meetings', () => {
    const onWorksheet = makeWorksheetCourse(
      makeListing({ crn: 1, startTime: '10:30', endTime: '11:20' }),
    );
    const candidate = makeListing({
      crn: 2,
      meetings: [],
    });

    expect(checkConflict([onWorksheet], asCandidate(candidate))).toEqual([]);
  });

  it('returns no conflicts for different days', () => {
    const onWorksheet = makeWorksheetCourse(
      makeListing({ crn: 1, daysOfWeek: MON | WED | FRI }),
    );
    const candidate = makeListing({
      crn: 2,
      daysOfWeek: TUE | THU,
      startTime: '10:30',
      endTime: '11:20',
    });

    expect(checkConflict([onWorksheet], asCandidate(candidate))).toEqual([]);
  });

  it('returns no conflicts for same day with a time gap', () => {
    const onWorksheet = makeWorksheetCourse(
      makeListing({
        crn: 1,
        daysOfWeek: MON,
        startTime: '09:00',
        endTime: '10:00',
      }),
    );
    const candidate = makeListing({
      crn: 2,
      daysOfWeek: MON,
      startTime: '10:05',
      endTime: '11:00',
    });

    expect(checkConflict([onWorksheet], asCandidate(candidate))).toEqual([]);
  });

  it('detects overlapping meetings on a shared day', () => {
    const conflicting = makeListing({
      crn: 1,
      daysOfWeek: MON | WED,
      startTime: '10:30',
      endTime: '11:20',
    });
    const onWorksheet = makeWorksheetCourse(conflicting);
    const candidate = makeListing({
      crn: 2,
      daysOfWeek: WED | FRI,
      startTime: '11:00',
      endTime: '11:50',
    });

    expect(checkConflict([onWorksheet], asCandidate(candidate))).toEqual([
      conflicting,
    ]);
  });

  it('treats back-to-back classes that share an endpoint as a conflict', () => {
    // Current overlap check is inclusive at the boundary (start === end).
    const earlier = makeListing({
      crn: 1,
      daysOfWeek: MON,
      startTime: '10:00',
      endTime: '11:00',
    });
    const onWorksheet = makeWorksheetCourse(earlier);
    const candidate = makeListing({
      crn: 2,
      daysOfWeek: MON,
      startTime: '11:00',
      endTime: '12:00',
    });

    expect(checkConflict([onWorksheet], asCandidate(candidate))).toEqual([
      earlier,
    ]);
  });

  it('ignores hidden worksheet courses', () => {
    const hiddenConflict = makeListing({
      crn: 1,
      daysOfWeek: MON,
      startTime: '10:30',
      endTime: '11:20',
    });
    const visibleOk = makeListing({
      crn: 2,
      daysOfWeek: TUE,
      startTime: '10:30',
      endTime: '11:20',
    });
    const candidate = makeListing({
      crn: 3,
      daysOfWeek: MON,
      startTime: '10:30',
      endTime: '11:20',
    });

    expect(
      checkConflict(
        [
          makeWorksheetCourse(hiddenConflict, true),
          makeWorksheetCourse(visibleOk, false),
        ],
        asCandidate(candidate),
      ),
    ).toEqual([]);
  });

  it('still counts courses with hidden: null as visible', () => {
    const conflicting = makeListing({
      crn: 1,
      daysOfWeek: MON,
      startTime: '10:30',
      endTime: '11:20',
    });
    const candidate = makeListing({
      crn: 2,
      daysOfWeek: MON,
      startTime: '10:30',
      endTime: '11:20',
    });

    expect(
      checkConflict(
        [makeWorksheetCourse(conflicting, null)],
        asCandidate(candidate),
      ),
    ).toEqual([conflicting]);
  });

  it('ignores worksheet courses from a different season', () => {
    const otherSeason = makeListing({
      crn: 1,
      season: '202601' as Season,
      daysOfWeek: MON,
      startTime: '10:30',
      endTime: '11:20',
    });
    const candidate = makeListing({
      crn: 2,
      season: '202603' as Season,
      daysOfWeek: MON,
      startTime: '10:30',
      endTime: '11:20',
    });

    expect(
      checkConflict([makeWorksheetCourse(otherSeason)], asCandidate(candidate)),
    ).toEqual([]);
  });

  it('returns each conflicting worksheet listing at most once', () => {
    const conflicting = makeListing({
      crn: 1,
      meetings: [
        {
          days_of_week: MON,
          start_time: '09:00',
          end_time: '10:00',
        },
        {
          days_of_week: WED,
          start_time: '13:00',
          end_time: '14:00',
        },
      ],
    });
    const candidate = makeListing({
      crn: 2,
      meetings: [
        {
          days_of_week: MON,
          start_time: '09:30',
          end_time: '10:30',
        },
        {
          days_of_week: WED,
          start_time: '13:30',
          end_time: '14:30',
        },
      ],
    });

    expect(
      checkConflict([makeWorksheetCourse(conflicting)], asCandidate(candidate)),
    ).toEqual([conflicting]);
  });
});

describe('toRangeTime / toRealTime', () => {
  it('converts midnight and noon', () => {
    expect(toRangeTime('0:00')).toBe(0);
    expect(toRangeTime('12:00')).toBe(144);
    expect(toRealTime(0)).toBe('0:00');
    expect(toRealTime(144)).toBe('12:00');
  });

  it('converts times on 5-minute boundaries', () => {
    expect(toRangeTime('10:30')).toBe(126);
    expect(toRangeTime('11:20')).toBe(136);
    expect(toRealTime(126)).toBe('10:30');
    expect(toRealTime(136)).toBe('11:20');
  });

  it('round-trips common class times', () => {
    for (const time of ['9:00', '9:25', '13:30', '14:45', '23:55'])
      expect(toRealTime(toRangeTime(time))).toBe(time);
  });
});

describe('to12HourTime', () => {
  it('formats morning, noon, afternoon, and midnight-hour times', () => {
    expect(to12HourTime('0:05')).toBe('12:05am');
    expect(to12HourTime('9:25')).toBe('9:25am');
    expect(to12HourTime('12:00')).toBe('12:00pm');
    expect(to12HourTime('13:30')).toBe('1:30pm');
  });
});

describe('toSeasonString', () => {
  it('formats spring, summer, and fall seasons', () => {
    expect(toSeasonString('202601' as Season)).toBe('Spring 2026');
    expect(toSeasonString('202602' as Season)).toBe('Summer 2026');
    expect(toSeasonString('202603' as Season)).toBe('Fall 2026');
  });
});

describe('toWeekdayStrings / toWeekdaysDisplayString', () => {
  it('formats single days and common patterns', () => {
    expect(toWeekdayStrings(MON)).toEqual(['M']);
    expect(toWeekdayStrings(THU)).toEqual(['Th']);
    expect(toWeekdayStrings(MON | WED | FRI)).toEqual(['M', 'W', 'F']);
    expect(toWeekdayStrings(TUE | THU)).toEqual(['T', 'Th']);
  });

  it('collapses Monday–Friday to M–F', () => {
    expect(toWeekdaysDisplayString(MON | TUE | WED | THU | FRI)).toBe('M–F');
    expect(toWeekdaysDisplayString(MON | WED | FRI)).toBe('MWF');
  });
});
