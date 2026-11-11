import { describe, expect, it } from 'vitest';

import { collapseFriendCourses, getNumFriends } from './course';
import type { FriendRecord } from '../queries/api';
import type { Crn, NetId, Season } from '../queries/graphql-types';

const SEASON = '202601' as Season;

type TestCourse = { crn: number; hidden?: boolean; sameCourseId?: number };

function makeFriend(
  name: string,
  worksheets: { [worksheetNumber: number]: TestCourse[] },
): FriendRecord[NetId] {
  const seasonMap = new Map(
    Object.entries(worksheets).map(([num, courses]) => [
      Number(num),
      {
        name: `Worksheet ${num}`,
        courses: courses.map((c) => ({
          crn: c.crn as Crn,
          color: '#000',
          hidden: c.hidden ?? false,
          sameCourseId: c.sameCourseId,
        })),
      },
    ]),
  );
  return { name, worksheets: new Map([[SEASON, seasonMap]]) };
}

const key = (crn: number) => `${SEASON}${crn}` as `${Season}${Crn}`;

describe('getNumFriends', () => {
  it('counts only main worksheets', () => {
    const friends = {
      a: makeFriend('Alice', { 0: [{ crn: 1 }], 1: [{ crn: 2 }] }),
    } as FriendRecord;
    const result = getNumFriends(friends);
    expect(result[key(1)]).toEqual(new Set(['Alice']));
    expect(result[key(2)]).toBeUndefined();
  });

  it('counts hidden courses by default', () => {
    const friends = {
      a: makeFriend('Alice', { 0: [{ crn: 1, hidden: true }] }),
    } as FriendRecord;
    expect(getNumFriends(friends)[key(1)]?.size).toBe(1);
  });

  it('skips hidden courses when excludeHidden is set', () => {
    const friends = {
      a: makeFriend('Alice', { 0: [{ crn: 1, hidden: true }] }),
      b: makeFriend('Bob', { 0: [{ crn: 1 }] }),
    } as FriendRecord;
    const result = getNumFriends(friends, undefined, { excludeHidden: true });
    expect(result[key(1)]).toEqual(new Set(['Bob']));
  });

  it('groups cross-listings by sameCourseId so a friend counts once', () => {
    const friends = {
      a: makeFriend('Alice', {
        0: [
          { crn: 1, sameCourseId: 99 },
          { crn: 2, sameCourseId: 99 },
        ],
      }),
      b: makeFriend('Bob', { 0: [{ crn: 2, sameCourseId: 99 }] }),
    } as FriendRecord;
    const result = getNumFriends(friends, { [`${SEASON}-99`]: [1, 2] });
    expect(result[key(1)]).toEqual(new Set(['Alice', 'Bob']));
    expect(result[key(2)]).toBe(result[key(1)]);
  });
});

describe('collapseFriendCourses', () => {
  const listing = (crn: number) => ({
    crn: crn as Crn,
    course: { season_code: SEASON },
  });
  const sameCourse = { [`${SEASON}-99`]: [1, 2, 3] };

  it('shows each course once, keeping the section friends are in', () => {
    const friends = {
      a: makeFriend('Alice', { 0: [{ crn: 2, sameCourseId: 99 }] }),
    } as FriendRecord;
    const numFriends = getNumFriends(friends, sameCourse);
    const result = collapseFriendCourses(
      [listing(1), listing(2), listing(3), listing(4)],
      numFriends,
      friends,
    );
    expect(result.map((l) => l.crn)).toEqual([2, 4]);
  });

  it('picks the section most friends are in and keeps group position', () => {
    const friends = {
      a: makeFriend('Alice', { 0: [{ crn: 1, sameCourseId: 99 }] }),
      b: makeFriend('Bob', { 0: [{ crn: 3, sameCourseId: 99 }] }),
      c: makeFriend('Cara', { 0: [{ crn: 3, sameCourseId: 99 }] }),
      d: makeFriend('Dan', { 0: [{ crn: 5 }] }),
    } as FriendRecord;
    const numFriends = getNumFriends(friends, sameCourse);
    const result = collapseFriendCourses(
      [listing(1), listing(2), listing(3), listing(5)],
      numFriends,
      friends,
    );
    expect(result.map((l) => l.crn)).toEqual([3, 5]);
  });
});
