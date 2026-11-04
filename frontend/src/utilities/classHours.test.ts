import { describe, expect, it } from 'vitest';

import {
  findLatestPastOffering,
  getWeeklyMeetingHours,
  type PastOffering,
  summarizeClassHours,
} from './classHours';
import type { CatalogListing } from '../queries/api';
import type { Season } from '../queries/graphql-types';

/** Bitmasks matching `weekdays` in constants.ts (`1 << dayIndex`). */
const MON = 1 << 1;
const TUE = 1 << 2;
const WED = 1 << 3;
const THU = 1 << 4;
const FRI = 1 << 5;

function makeOffering(
  seasonCode: string,
  section: string,
  daysOfWeek = MON | WED,
  sameCourseId = 1,
): PastOffering {
  return {
    same_course_id: sameCourseId,
    season_code: seasonCode as Season,
    section,
    course_meetings: [
      { days_of_week: daysOfWeek, start_time: '13:00', end_time: '14:15' },
    ],
  };
}

const course = {
  same_course_id: 1,
  season_code: '202603' as Season,
  section: '1',
};

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

describe('findLatestPastOffering', () => {
  it('picks the most recent earlier season', () => {
    const result = findLatestPastOffering(
      [makeOffering('202401', '1'), makeOffering('202503', '1')],
      course,
    );
    expect(result?.season_code).toBe('202503');
  });

  it('ignores the current and later seasons', () => {
    const result = findLatestPastOffering(
      [makeOffering('202603', '1'), makeOffering('202701', '1')],
      course,
    );
    expect(result).toBeUndefined();
  });

  it('ignores other courses', () => {
    const result = findLatestPastOffering(
      [makeOffering('202503', '1', MON, 2)],
      course,
    );
    expect(result).toBeUndefined();
  });

  it('prefers the lowest section within a season', () => {
    const result = findLatestPastOffering(
      [makeOffering('202503', '10', MON), makeOffering('202503', '2', TUE)],
      course,
    );
    expect(result?.section).toBe('2');
  });

  it('prefers the same section number within a season', () => {
    const result = findLatestPastOffering(
      [makeOffering('202503', '1', MON), makeOffering('202503', '2', TUE)],
      { ...course, section: '2' },
    );
    expect(result?.section).toBe('2');
  });

  it('prefers a more recent season over a matching section', () => {
    const result = findLatestPastOffering(
      [makeOffering('202503', '1', MON), makeOffering('202501', '2', TUE)],
      { ...course, section: '2' },
    );
    expect(result?.season_code).toBe('202503');
  });

  it('does not fall back to older seasons when the latest had no times', () => {
    // Mirrors a lab's umbrella listing: TBA recently, but an old offering
    // listed every lab slot under it
    const result = findLatestPastOffering(
      [
        { ...makeOffering('202601', '1'), course_meetings: [] },
        makeOffering('201001', '1', MON | TUE | WED | THU | FRI),
      ],
      course,
    );
    expect(result).toBeUndefined();
  });

  it('uses another section in the latest season if the matching one is TBA', () => {
    const result = findLatestPastOffering(
      [
        { ...makeOffering('202503', '1'), course_meetings: [] },
        makeOffering('202503', '2', TUE),
      ],
      course,
    );
    expect(result?.section).toBe('2');
  });

  it('matches discussion sections only with discussion sections', () => {
    const offerings = [
      makeOffering('202503', '1', MON | WED),
      makeOffering('202501', 'A', FRI),
    ];
    expect(findLatestPastOffering(offerings, course)?.section).toBe('1');
    expect(
      findLatestPastOffering(offerings, { ...course, section: 'B' })?.section,
    ).toBe('A');
  });
});

function makeListing(
  courseCode: string,
  section: string,
  meetings: PastOffering['course_meetings'],
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
    const summary = summarizeClassHours(
      [
        makeListing('CPSC 201', '1', MW_75_MIN),
        makeListing('MATH 225', '1', MW_75_MIN, 2),
      ],
      [],
      false,
    );
    expect(summary.hours).toBeCloseTo(5);
    expect(summary.courseCount).toBe(2);
    expect(summary.estimates).toHaveLength(0);
    expect(summary.missing).toHaveLength(0);
  });

  it('estimates courses without times from last semester', () => {
    const summary = summarizeClassHours(
      [makeListing('CPSC 201', '1', [])],
      [makeOffering('202601', '1')],
      false,
    );
    expect(summary.hours).toBeCloseTo(2.5);
    expect(summary.estimates.map((e) => e.label)).toEqual(['CPSC 201']);
    expect(summary.missing).toHaveLength(0);
  });

  it('reports courses with no times anywhere as missing', () => {
    const summary = summarizeClassHours(
      [makeListing('CPSC 201', '1', [])],
      [],
      false,
    );
    expect(summary.hours).toBe(0);
    expect(summary.courseCount).toBe(0);
    expect(summary.missing).toEqual(['CPSC 201']);
  });

  it("doesn't report missing courses while past times are loading", () => {
    const summary = summarizeClassHours(
      [makeListing('CPSC 201', '1', [])],
      [],
      true,
    );
    expect(summary.missing).toHaveLength(0);
  });

  it("doesn't report an umbrella listing when its section has times", () => {
    const summary = summarizeClassHours(
      [
        makeListing('CHEM 2220L', '1', []),
        makeListing('CHEM 2220L', 'J', MW_75_MIN, 2),
      ],
      [],
      false,
    );
    expect(summary.hours).toBeCloseTo(2.5);
    expect(summary.courseCount).toBe(1);
    expect(summary.missing).toHaveLength(0);
  });

  it('labels discussion sections with their section', () => {
    const summary = summarizeClassHours(
      [makeListing('CPSC 201', 'A', [])],
      [],
      false,
    );
    expect(summary.missing).toEqual(['CPSC 201 section A']);
  });
});
