// Performing various actions on the listing dictionary
import type { SortKeys } from '../contexts/searchContext';
import type { WorksheetCourse } from '../contexts/worksheetContext';
import type { Courses, Listings } from '../generated/graphql-types';
import type {
  FriendRecord,
  UserWorksheets,
  CatalogListing,
} from '../queries/api';
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

export type ListingWithTimes = {
  season_code: Season;
  crn: Crn;
  course: {
    times_by_day: TimesByDay;
  };
};

export function checkConflict(
  worksheetData: WorksheetCourse[],
  listing: ListingWithTimes,
): CatalogListing[] {
  const conflicts: CatalogListing[] = [];
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

export function getEnrolled(
  course: CourseWithEnrolled,
  usage: 'stat',
): number | null;
export function getEnrolled(
  course: CourseWithEnrolled,
  usage: 'display',
): string;
export function getEnrolled(
  course: CourseWithEnrolled,
  usage: 'modal',
): [string, boolean];
export function getEnrolled(
  course: CourseWithEnrolled,
  usage: 'stat' | 'display' | 'modal',
): string | number | null | [string, boolean] {
  switch (usage) {
    case 'stat':
      // Use enrollment for that season if course has happened
      if (course.evaluation_statistic?.enrolled)
        return course.evaluation_statistic.enrolled;
      if (course.last_enrollment) return course.last_enrollment;
      return null;
    case 'display':
      if (course.evaluation_statistic?.enrolled)
        return String(course.evaluation_statistic.enrolled);
      if (course.last_enrollment) {
        return course.last_enrollment_same_professors
          ? String(course.last_enrollment)
          : `~${course.last_enrollment}`;
      }
      return '';
    case 'modal':
      if (course.evaluation_statistic?.enrolled)
        return [String(course.evaluation_statistic.enrolled), true];
      if (course.last_enrollment) {
        return [
          course.last_enrollment_same_professors
            ? String(course.last_enrollment)
            : `${course.last_enrollment} (different professor was teaching)`,
          false,
        ];
      }
      return ['N/A', false];
    default:
      throw new Error('Invalid usage');
  }
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

type ComparableKey = SortKeys | 'season_code' | 'section';

function getAttributeValue(
  l: CatalogListing,
  key: ComparableKey,
  numFriends: NumFriendsReturn,
) {
  switch (key) {
    case 'friend':
      return numFriends[`${l.season_code}${l.crn}`]?.size ?? 0;
    case 'overall':
      return getOverallRatings(l.course, 'stat');
    case 'workload':
      return getWorkloadRatings(l.course, 'stat');
    case 'enrollment':
      return getEnrolled(l.course, 'stat');
    case 'time':
      return toDayTimeScore(l.course);
    case 'course_code':
    case 'season_code':
    case 'section':
      return l[key];
    default:
      // || is intentional: 0 also means nonexistence
      return l.course[key] || null;
  }
}

function compareByKey(
  a: CatalogListing,
  b: CatalogListing,
  key: ComparableKey,
  ordering: 'asc' | 'desc',
  numFriends: NumFriendsReturn,
) {
  const aVal = getAttributeValue(a, key, numFriends);
  const bVal = getAttributeValue(b, key, numFriends);
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

// Sort courses in catalog or expanded worksheet
export function sortCourses(
  courses: CatalogListing[],
  ordering: {
    key: SortKeys;
    type: 'desc' | 'asc';
  },
  numFriends: NumFriendsReturn,
): CatalogListing[] {
  return [...courses].sort(
    (a, b) =>
      compareByKey(a, b, ordering.key, ordering.type, numFriends) ||
      // Define a stable sort order for courses that compare equal
      compareByKey(a, b, 'season_code', 'desc', numFriends) ||
      compareByKey(a, b, 'course_code', 'asc', numFriends) ||
      compareByKey(a, b, 'section', 'asc', numFriends),
  );
}

type CourseWithEnrolled = {
  evaluation_statistic?: {
    enrolled: number | null;
  } | null;
  last_enrollment?: number | null;
  last_enrollment_same_professors?: boolean | null;
};

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
