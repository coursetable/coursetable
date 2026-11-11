import { describe, expect, it } from 'vitest';

import { getWeeklyMeetingHours, summarizeClassHours } from './classHours';
import type { CatalogListing } from '../queries/api';
import type { Season } from '../queries/graphql-types';

/** Bitmasks matching `weekdays` in constants.ts (`1 << dayIndex`). */
const MON = 1 << 1;
const TUE = 1 << 2;
const WED = 1 << 3;
const THU = 1 << 4;
const FRI = 1 << 5;

type Meeting = { days_of_week: number; start_time: string; end_time: string };

describe('getWeeklyMeetingHours', () => {
  it('multiplies meeting length by number of days', () => {
    expect(
      getWeeklyMeetingHours([
        {
          days_of_week: MON | WED | FRI,
          start_time: '10:30',
          end_time: '11:20',
        },
      ]),
    ).toBeCloseTo(2.5);
  });

  it('sums across meetings', () => {
    expect(
      getWeeklyMeetingHours([
        { days_of_week: TUE | THU, start_time: '9:00', end_time: '10:15' },
        { days_of_week: FRI, start_time: '14:00', end_time: '15:00' },
      ]),
    ).toBeCloseTo(3.5);
  });

  it('returns 0 for no meetings', () => {
    expect(getWeeklyMeetingHours([])).toBe(0);
  });
});

function makeListing(
  courseCode: string,
  section: string,
  meetings: Meeting[],
  sameCourseId = 1,
): CatalogListing {
  return {
    course_code: courseCode,
    course: {
      same_course_id: sameCourseId,
      season_code: '202603' as Season,
      section,
      course_meetings: meetings,
      listings: [{ course_code: courseCode }],
    },
  } as unknown as CatalogListing;
}

const MW_75_MIN = [
  { days_of_week: MON | WED, start_time: '13:00', end_time: '14:15' },
];

describe('summarizeClassHours', () => {
  it('sums scheduled hours', () => {
    const summary = summarizeClassHours([
      makeListing('CPSC 201', '1', MW_75_MIN),
      makeListing('MATH 225', '1', MW_75_MIN, 2),
    ]);
    expect(summary.hours).toBeCloseTo(5);
    expect(summary.courseCount).toBe(2);
    expect(summary.missing).toHaveLength(0);
  });

  it('reports courses with no times anywhere as missing', () => {
    const summary = summarizeClassHours([makeListing('CPSC 201', '1', [])]);
    expect(summary.hours).toBe(0);
    expect(summary.courseCount).toBe(0);
    expect(summary.missing).toEqual(['CPSC 201']);
  });

  it("doesn't report an umbrella listing when its section has times", () => {
    const summary = summarizeClassHours([
      makeListing('CHEM 2220L', '1', []),
      makeListing('CHEM 2220L', 'J', MW_75_MIN, 2),
    ]);
    expect(summary.hours).toBeCloseTo(2.5);
    expect(summary.courseCount).toBe(1);
    expect(summary.missing).toHaveLength(0);
  });

  it('labels discussion sections with their section', () => {
    const summary = summarizeClassHours([makeListing('CPSC 201', 'A', [])]);
    expect(summary.missing).toEqual(['CPSC 201 section A']);
  });
});
