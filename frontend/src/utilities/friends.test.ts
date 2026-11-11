import { describe, expect, it } from 'vitest';

import {
  collapseFriendCourses,
  getNumFriends,
  mergeFriendsByCourseCode,
} from './course';
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

  it('shows the cross-listing that survived filtering', () => {
    // Friend is in the ECON listing (crn 1); a CPSC search left only the CPSC
    // cross-listing (crn 2), so that one must be shown
    const friends = {
      a: makeFriend('Alice', { 0: [{ crn: 1, sameCourseId: 99 }] }),
    } as FriendRecord;
    const numFriends = getNumFriends(friends, sameCourse);
    const result = collapseFriendCourses([listing(2)], numFriends, friends);
    expect(result.map((l) => l.crn)).toEqual([2]);
  });
});

describe('mergeFriendsByCourseCode', () => {
  const listing = (crn: number, code: string) => ({
    crn: crn as Crn,
    course_code: code,
    course: { season_code: SEASON },
  });

  it('merges separate catalog courses that share a code', () => {
    // Two sections of BENG 3200 are different courses (sameCourseId 1 and 2)
    const friends = {
      a: makeFriend('Alice', { 0: [{ crn: 1, sameCourseId: 1 }] }),
      b: makeFriend('Bob', { 0: [{ crn: 2, sameCourseId: 2 }] }),
    } as FriendRecord;
    const base = getNumFriends(friends, {
      [`${SEASON}-1`]: [1],
      [`${SEASON}-2`]: [2],
    });
    const listings = [listing(1, 'BENG 3200'), listing(2, 'BENG 3200')];
    const merged = mergeFriendsByCourseCode(listings, base);
    expect(merged[key(1)]).toEqual(new Set(['Alice', 'Bob']));
    expect(merged[key(2)]).toBe(merged[key(1)]);
    const rows = collapseFriendCourses(listings, merged, friends);
    expect(rows).toHaveLength(1);
  });

  it('follows cross-listings into other codes', () => {
    // MCDB 3100 is cross-listed with BENG 3200 section (crn 1); crn 3 is a
    // separate MCDB 3100 course
    const friends = {
      a: makeFriend('Alice', { 0: [{ crn: 1, sameCourseId: 1 }] }),
      b: makeFriend('Bob', { 0: [{ crn: 3, sameCourseId: 3 }] }),
    } as FriendRecord;
    const base = getNumFriends(friends, {
      [`${SEASON}-1`]: [1, 4],
      [`${SEASON}-3`]: [3],
    });
    const listings = [
      listing(1, 'BENG 3200'),
      listing(4, 'MCDB 3100'),
      listing(3, 'MCDB 3100'),
    ];
    const merged = mergeFriendsByCourseCode(listings, base);
    expect(merged[key(1)]).toEqual(new Set(['Alice', 'Bob']));
    expect(merged[key(3)]).toBe(merged[key(1)]);
  });

  it('leaves unrelated courses alone', () => {
    const friends = {
      a: makeFriend('Alice', { 0: [{ crn: 1 }] }),
      b: makeFriend('Bob', { 0: [{ crn: 2 }] }),
    } as FriendRecord;
    const base = getNumFriends(friends);
    const merged = mergeFriendsByCourseCode(
      [listing(1, 'CPSC 2010'), listing(2, 'ECON 1101')],
      base,
    );
    expect(merged[key(1)]).toEqual(new Set(['Alice']));
    expect(merged[key(2)]).toEqual(new Set(['Bob']));
  });
});
