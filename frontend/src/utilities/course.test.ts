import { describe, expect, it } from 'vitest';

import { checkConflict, type ListingWithTimes } from './course';
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
