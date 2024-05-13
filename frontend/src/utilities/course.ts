// Performing various actions on the listing dictionary
import type { SortKeys } from '../contexts/searchContext';
import type { WorksheetCourse } from '../contexts/worksheetContext';
import type { Courses, Listings } from '../generated/graphql-types';
import type { FriendRecord, UserWorksheets, Listing } from '../queries/api';
import {
  type Crn,
  type Season,
  type Weekdays,
  type TimesByDay,
  weekdays,
} from '../queries/graphql-types';

export function truncatedText(
  text: string | null | undefined,
  max: number,
  defaultStr: string,
) {
  if (!text) return defaultStr;
  else if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

export function isInWorksheet(
  seasonCode: Season,
  crn: Crn,
  worksheetNumber: number,
  worksheet: UserWorksheets | undefined,
): boolean {
  if (!worksheet) return false;
  return (
    seasonCode in worksheet &&
    worksheetNumber in worksheet[seasonCode]! &&
    worksheet[seasonCode]![worksheetNumber]!.some(
      (course) => course.crn === crn,
    )
  );
}

export function toSeasonString(seasonCode: Season): string {
  const year = seasonCode.substring(0, 4);
  const season = ['Spring', 'Summer', 'Fall'][Number(seasonCode[5]) - 1]!;
  return `${season} ${year}`;
}

export function checkConflict(
  worksheetData: WorksheetCourse[],
  listing: {
    season_code: Season;
    course: {
      times_by_day: TimesByDay;
    };
  },
): Listing[] {
  const conflicts: Listing[] = [];
  const daysToCheck = Object.keys(listing.course.times_by_day) as Weekdays[];
  if (!daysToCheck.length) return conflicts;
  loopWorksheet: for (const { listing: worksheetCourse } of worksheetData) {
    if (worksheetCourse.season_code !== listing.season_code) continue;
    for (const day of daysToCheck) {
      const info = worksheetCourse.course.times_by_day[day];
      if (info === undefined) continue;
      const courseInfo = listing.course.times_by_day[day]!;
      for (const [startTime, endTime] of info) {
        const listingStart = toRangeTime(startTime);
        const listingEnd = toRangeTime(endTime);
        for (const [courseStartTime, courseEndTime] of courseInfo) {
          const curStart = toRangeTime(courseStartTime);
          const curEnd = toRangeTime(courseEndTime);
          // Conflict exists
          if (
            !(listingStart > curEnd || curStart > listingEnd) &&
            !conflicts.includes(worksheetCourse)
          ) {
            conflicts.push(worksheetCourse);
            continue loopWorksheet;
          }
        }
      }
    }
  }
  return conflicts;
}

/**
 * Key is season code + crn;
 * Value is the list of friends taking the class
 */
export type NumFriendsReturn = {
  [seasonCodeCrn: `${Season}${Crn}`]: Set<string>;
};
// Fetch the friends that are also shopping any course. Used in search and
// worksheet expanded list
export function getNumFriends(friends: FriendRecord): NumFriendsReturn {
  const numFriends: NumFriendsReturn = {};
  for (const [netId, friend] of Object.entries(friends)) {
    Object.entries(friend.worksheets).forEach(([seasonCode, worksheets]) => {
      Object.values(worksheets).forEach((w) =>
        w.forEach((course) => {
          (numFriends[`${seasonCode as Season}${course.crn}`] ??=
            new Set()).add(friend.name ?? netId);
        }),
      );
    });
  }
  return numFriends;
}

export type CourseWithOverall = Pick<
  Courses,
  'average_rating' | 'average_rating_same_professors'
>;

export function getOverallRatings(
  course: CourseWithOverall,
  usage: 'stat',
): number | null;
export function getOverallRatings(
  course: CourseWithOverall,
  usage: 'display',
): string;
export function getOverallRatings(
  course: CourseWithOverall,
  usage: 'stat' | 'display',
): string | number | null {
  if (course.average_rating_same_professors) {
    // Use same professor if possible
    return usage === 'stat'
      ? course.average_rating_same_professors
      : course.average_rating_same_professors.toFixed(1);
  } else if (course.average_rating) {
    // Use all professors otherwise and add tilde ~
    return usage === 'stat'
      ? course.average_rating
      : `~${course.average_rating.toFixed(1)}`;
  }
  return usage === 'stat' ? null : 'N/A';
}

export type CourseWithWorkload = Pick<
  Courses,
  'average_workload' | 'average_workload_same_professors'
>;

export function getWorkloadRatings(
  course: CourseWithWorkload,
  usage: 'stat',
): number | null;
export function getWorkloadRatings(
  course: CourseWithWorkload,
  usage: 'display',
): string;
export function getWorkloadRatings(
  course: CourseWithWorkload,
  usage: 'stat' | 'display',
): string | number | null {
  if (course.average_workload_same_professors) {
    // Use same professor if possible
    return usage === 'stat'
      ? course.average_workload_same_professors
      : course.average_workload_same_professors.toFixed(1);
  } else if (course.average_workload) {
    // Use all professors otherwise and add tilde ~
    return usage === 'stat'
      ? course.average_workload
      : `~${course.average_workload.toFixed(1)}`;
  }
  // No ratings at all
  return usage === 'stat' ? null : 'N/A';
}

export type CourseWithProfRatings = Pick<Courses, 'average_professor_rating'>;

export function getProfessorRatings(
  course: CourseWithProfRatings,
  usage: 'stat',
): number | null;
export function getProfessorRatings(
  course: CourseWithProfRatings,
  usage: 'display',
): string;
export function getProfessorRatings(
  course: CourseWithProfRatings,
  usage: 'stat' | 'display',
): string | number | null {
  if (course.average_professor_rating) {
    return usage === 'stat'
      ? course.average_professor_rating
      : course.average_professor_rating.toFixed(1);
  }
  return usage === 'stat' ? null : 'N/A';
}

export function getDayTimes(
  course: Pick<Courses, 'times_by_day'>,
): { day: Weekdays; start: string; end: string }[] {
  return Object.entries(course.times_by_day).map(([day, dayTimes]) => ({
    day: day as Weekdays,
    start: dayTimes[0]![0],
    end: dayTimes[0]![1],
  }));
}

function toDayTimeScore(course: Pick<Courses, 'times_by_day'>): number | null {
  const times = getDayTimes(course);

  if (times.length) {
    const startTime = Number(times[0]!.start.split(':').join(''));
    const firstDay = Object.keys(course.times_by_day)[0] as Weekdays;
    const dayScore = weekdays.indexOf(firstDay) * 10000;
    return dayScore + startTime;
  }

  // If no times then return null
  return null;
}

function comparatorReturn(
  aVal: number | string | null,
  bVal: number | string | null,
  ordering: 'asc' | 'desc',
) {
  if (aVal === null && bVal === null) return 0;
  if (aVal === null) return 1;
  if (bVal === null) return -1;
  if (typeof aVal === 'number' && typeof bVal === 'number')
    return ordering === 'asc' ? aVal - bVal : bVal - aVal;
  // Shouldn't happen
  if (typeof aVal === 'number' || typeof bVal === 'number') return 0;
  const strCmp = aVal.localeCompare(bVal, 'en-US', {
    // Use numeric sorting, so that course codes like ARCH 1002 appear after
    // ARCH 200
    numeric: true,
  });
  return ordering === 'asc' ? strCmp : -strCmp;
}

// We can only sort by primitive keys by default, unless we have special support
type ComparableKey =
  | SortKeys
  | 'season_code'
  | 'section'
  | keyof {
      [K in keyof Listing['course'] as Listing['course'][K] extends
        | string
        | number
        ? K
        : never]: K;
    };

function compareByKey(
  a: Listing,
  b: Listing,
  key: Exclude<ComparableKey, 'friend'>,
  ordering: 'asc' | 'desc',
): number;
function compareByKey(
  a: Listing,
  b: Listing,
  key: ComparableKey,
  ordering: 'asc' | 'desc',
  numFriends: NumFriendsReturn,
): number;
function compareByKey(
  a: Listing,
  b: Listing,
  key: ComparableKey,
  ordering: 'asc' | 'desc',
  numFriends?: NumFriendsReturn,
) {
  if (key === 'friend') {
    // Concatenate season code and crn to form key
    const friendsTakingA = numFriends![`${a.season_code}${a.crn}`]?.size ?? 0;
    const friendsTakingB = numFriends![`${b.season_code}${b.crn}`]?.size ?? 0;
    return comparatorReturn(friendsTakingA, friendsTakingB, ordering);
  }
  if (key === 'average_rating') {
    return comparatorReturn(
      getOverallRatings(a.course, 'stat'),
      getOverallRatings(b.course, 'stat'),
      ordering,
    );
  }
  if (key === 'average_workload') {
    return comparatorReturn(
      getWorkloadRatings(a.course, 'stat'),
      getWorkloadRatings(b.course, 'stat'),
      ordering,
    );
  }
  if (key === 'times_by_day') {
    return comparatorReturn(
      toDayTimeScore(a.course),
      toDayTimeScore(b.course),
      ordering,
    );
  }
  if (key === 'course_code' || key === 'season_code' || key === 'section')
    return comparatorReturn(a.course_code, b.course_code, ordering);
  // If value is 0, return null
  return comparatorReturn(
    // || is intentional: 0 also means nonexistence
    a.course[key] || null,
    b.course[key] || null,
    ordering,
  );
}

/**
 * Compares two listings by the specified key.
 */
function compare(
  a: Listing,
  b: Listing,
  key: SortKeys,
  ordering: 'asc' | 'desc',
  numFriends: NumFriendsReturn,
): number {
  return (
    compareByKey(a, b, key, ordering, numFriends) ||
    // Define a stable sort order for courses that compare equal
    compareByKey(a, b, 'season_code', 'desc') ||
    compareByKey(a, b, 'course_code', 'asc') ||
    compareByKey(a, b, 'section', 'asc')
  );
}

// Sort courses in catalog or expanded worksheet
export function sortCourses(
  courses: Listing[],
  ordering: {
    key: SortKeys;
    type: 'desc' | 'asc';
  },
  numFriends: NumFriendsReturn,
): Listing[] {
  return [...courses].sort((a, b) =>
    compare(a, b, ordering.key, ordering.type, numFriends),
  );
}

type CourseWithEnrolled = {
  evaulation_statistic?: {
    enrolled: number | null;
  } | null;
  last_enrollment?: number | null;
  last_enrollment_same_professors?: boolean | null;
};

export function getEnrolled(
  course: CourseWithEnrolled,
  usage: 'stat',
): number | null;
export function getEnrolled(
  course: CourseWithEnrolled,
  usage: 'display' | 'modal',
): string;
export function getEnrolled(
  course: CourseWithEnrolled,
  usage: 'stat' | 'display' | 'modal',
): string | number | null {
  if (course.evaulation_statistic?.enrolled) {
    // Use enrollment for that season if course has happened
    return usage === 'stat'
      ? course.evaulation_statistic.enrolled
      : String(course.evaulation_statistic.enrolled);
  } else if (course.last_enrollment) {
    // Use last enrollment if course hasn't happened
    if (usage === 'stat') return course.last_enrollment;
    return course.last_enrollment_same_professors
      ? String(course.last_enrollment)
      : `~${course.last_enrollment}${
          usage === 'modal' ? ' (different professor was teaching)' : ''
        }`;
  }
  // No enrollment data
  if (usage === 'stat') return null;
  return usage === 'modal' ? 'N/A' : '';
}

export function isGraduate(listing: Pick<Listings, 'number'>): boolean {
  return Number(listing.number.replace(/\D/gu, '')) >= 500;
}

export function isDiscussionSection(
  listing: Pick<Courses, 'section'>,
): boolean {
  // Checks whether the section field consists only of letters -- if so, the
  // class is a discussion section.
  return /^[A-Z]*$/u.test(listing.section);
}

/**
 * @param time A time in the format `hh:mm` (24 hour)
 * @returns Number of 5 minutes past midnight
 */
export function toRangeTime(time: string): number {
  const splitTime = time.split(':');
  const hour = Number(splitTime[0]);
  const minute = Number(splitTime[1]);

  const rangeTime = hour * 12 + minute / 5;
  return rangeTime;
}

/**
 * @param time Number of 5 minutes past midnight
 * @returns A time in the format `hh:mm` (24 hour)
 */
export function toRealTime(time: number): string {
  const hour = Math.floor(time / 12);
  const minute = (time % 12) * 5;

  const realTime = `${hour}:${minute.toString().padStart(2, '0')}`;
  return realTime;
}

/**
 * @param time A time in the format `hh:mm` (24 hour)
 * @returns The same time in 12 hour, with `pm`/`am` suffix
 */
export function to12HourTime(time: string) {
  const [hour, minute] = time.split(':') as [string, string];
  let hourInt = parseInt(hour, 10);
  const ampm = hourInt >= 12 ? 'pm' : 'am';
  hourInt %= 12;
  if (hourInt === 0) hourInt = 12;
  const minuteInt = parseInt(minute, 10);
  return `${hourInt}:${minuteInt.toString().padStart(2, '0')}${ampm}`;
}

/**
 * Convert linear scale to exponential scale by taking $1.01^x$
 */
export const toExponential = (number: number): number => 1.01 ** number;

/**
 * Convert exponential scale to linear scale by taking $\log_{1.01}$
 */
export const toLinear = (number: number): number =>
  Math.log(number) / Math.log(1.01);
