import { describe, expect, it } from 'vitest';

import { groupCoursesByBuilding } from './map';
import buildingCoordinates from '../data/buildingCoordinates';
import type { CatalogListing } from '../queries/api';
import type { Crn } from '../queries/graphql-types';
import type { WorksheetCourse } from '../types/worksheetCourse';

const [knownCode, otherCode] = Object.keys(buildingCoordinates) as [
  string,
  string,
];

function makeCourse(
  crn: number,
  meetings: { code: string; room?: string }[],
  hidden = false,
): WorksheetCourse {
  return {
    crn: crn as Crn,
    color: '#000000',
    hidden,
    listing: {
      course: {
        course_meetings: meetings.map(({ code, room }) => ({
          location: { room: room ?? null, building: { code } },
        })),
      },
    } as unknown as CatalogListing,
  };
}

describe('groupCoursesByBuilding', () => {
  it('groups courses in the same building and sorts busiest first', () => {
    const { markers } = groupCoursesByBuilding([
      makeCourse(1, [{ code: otherCode }]),
      makeCourse(2, [{ code: knownCode, room: '101' }]),
      makeCourse(3, [{ code: knownCode, room: '102' }]),
    ]);
    expect(markers.map((group) => group.code)).toEqual([knownCode, otherCode]);
    expect(markers[0]!.rooms).toEqual(['101', '102']);
    expect(markers[0]!.courses.map((course) => course.crn)).toEqual([2, 3]);
    expect(markers[0]!.lat).toBe(buildingCoordinates[knownCode]!.lat);
  });

  it('skips hidden courses', () => {
    const { markers } = groupCoursesByBuilding([
      makeCourse(1, [{ code: knownCode }], true),
    ]);
    expect(markers).toEqual([]);
  });

  it('reports buildings without coordinates as missing', () => {
    const { markers, missing } = groupCoursesByBuilding([
      makeCourse(1, [{ code: 'NOT-A-BUILDING' }, { code: 'NOT-A-BUILDING' }]),
    ]);
    expect(markers).toEqual([]);
    expect(missing).toEqual([
      { code: 'NOT-A-BUILDING', name: 'NOT-A-BUILDING', count: 2 },
    ]);
  });
});
