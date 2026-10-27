import { describe, expect, it } from 'vitest';

import {
  findLatestPastOffering,
  getWeeklyMeetingHours,
  type PastOffering,
} from './classHours';
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
