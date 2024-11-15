// Performing various actions on the listing dictionary
import { weekdays } from './constants';
import type { SortKeys } from '../contexts/searchContext';
import type { WorksheetCourse } from '../contexts/worksheetContext';
import type { Courses, Listings } from '../generated/graphql-types';
import type {
  FriendRecord,
  UserWorksheets,
  CatalogListing,
} from '../queries/api';
import type { Crn, Season } from '../queries/graphql-types';

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
  listing: { crn: Crn; course: { season_code: Season } },
  worksheetNumber: number,
  worksheets: UserWorksheets | undefined,
): boolean {
  if (!worksheets) return false;
  return (
    listing.course.season_code in worksheets &&
    worksheetNumber in worksheets[listing.course.season_code]! &&
    worksheets[listing.course.season_code]![worksheetNumber]!.some(
      (course) => course.crn === listing.crn,
    )
  );
}

export function toSeasonString(seasonCode: Season): string {
  const year = seasonCode.substring(0, 4);
  const season = ['Spring', 'Summer', 'Fall'][Number(seasonCode[5]) - 1]!;
  return `${season} ${year}`;
}

// A "best guess" for when the season's courses are first published.
// TODO this should be pulled from Ferry once Ferry records this info
export function toSeasonDate(seasonCode: Season): string {
  const season = Number(seasonCode[5]);
  const date = ['11-01', '01-02', '04-01'][season - 1]!;
  let year = Number(seasonCode.substring(0, 4));
  if (season === 1) year--;
  return `${year}-${date}`;
}

// Turns a bitmask of days of the week into an array of strings.
// For example, 42 = 0b101010 = Monday, Wednesday, Friday
// See constants.ts for the mapping of days of the week to numbers
export function toWeekdayStrings(daysOfWeek: number): string[] {
  return Object.entries(weekdays)
    .filter(([, day]) => daysOfWeek & (1 << day))
    .map(([d]) =>
      ['Thursday', 'Saturday', 'Sunday'].includes(d) ? d.slice(0, 2) : d[0]!,
    );
}
// The only difference with toWeekdayStrings is that it returns 'M–F' for
// Monday through Friday
export function toWeekdaysDisplayString(daysOfWeek: number): string {
  const base = toWeekdayStrings(daysOfWeek).join('');
  if (base === 'MTWThF') return 'M–F';
  return base;
}

export function toTimesSummary(
  course: Pick<CatalogListing['course'], 'course_meetings'>,
): string {
  if (!course.course_meetings.length) return 'TBA';
  const meeting = course.course_meetings[0]!;
  const days = toWeekdaysDisplayString(meeting.days_of_week);
  const summary = `${days} ${to12HourTime(meeting.start_time)}–${to12HourTime(
    meeting.end_time,
  )}`;
  return `${summary}${course.course_meetings.length > 1 ? ` + ${course.course_meetings.length - 1}` : ''}`;
}

export function toLocationsSummary(
  course: Pick<CatalogListing['course'], 'course_meetings'>,
): string {
  if (course.course_meetings.every((m) => !m.location)) return 'TBA';
  const meeting = course.course_meetings[0]!;
  const summary = meeting.location
    ? `${meeting.location.building.code}${meeting.location.room ? ` ${meeting.location.room}` : ''}`
    : 'TBA';
  return `${summary}${course.course_meetings.length > 1 ? ` + ${course.course_meetings.length - 1}` : ''}`;
}

export type ListingWithTimes = {
  crn: Crn;
  course: {
    season_code: Season;
    course_meetings: {
      days_of_week: number;
      start_time: string;
      end_time: string;
    }[];
  };
};

export function checkConflict(
  worksheetData: WorksheetCourse[],
  listing: ListingWithTimes,
): CatalogListing[] {
  const conflicts: CatalogListing[] = [];
  if (!listing.course.course_meetings.length) return conflicts;
  loopWorksheet: for (const { listing: worksheetCourse } of worksheetData) {
    if (worksheetCourse.course.season_code !== listing.course.season_code)
      continue;
    for (const meeting1 of worksheetCourse.course.course_meetings) {
      for (const meeting2 of listing.course.course_meetings) {
        // Two meetings have no days in common
        if (!(meeting1.days_of_week & meeting2.days_of_week)) continue;
        const start1 = toRangeTime(meeting1.start_time);
        const start2 = toRangeTime(meeting2.start_time);
        const end1 = toRangeTime(meeting1.end_time);
        const end2 = toRangeTime(meeting2.end_time);
        // Conflict exists
        if (
          !(start1 > end2 || start2 > end1) &&
          !conflicts.includes(worksheetCourse)
        ) {
          conflicts.push(worksheetCourse);
          continue loopWorksheet;
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

export type CourseWithOverall = Partial<
  Pick<Courses, 'average_rating' | 'average_rating_same_professors'>
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

export type CourseWithWorkload = Partial<
  Pick<Courses, 'average_workload' | 'average_workload_same_professors'>
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

export type CourseWithProfRatings = Partial<
  Pick<Courses, 'average_professor_rating'>
>;

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

function toDayTimeScore(
  course: Pick<CatalogListing['course'], 'course_meetings'>,
): number | null {
  if (!course.course_meetings.length) return null;
  const startTime = Number(
    course.course_meetings[0]!.start_time.split(':').join(''),
  );
  const allDays = course.course_meetings.reduce(
    (acc, m) => acc | m.days_of_week,
    0,
  );
  const firstDay = Object.values(weekdays).find((day) => allDays & (1 << day))!;
  const dayScore = firstDay * 10000;
  return dayScore + startTime;
}

type ComparableKey = SortKeys | 'season_code' | 'section';

function getAttributeValue(
  l: CatalogListing,
  key: ComparableKey,
  numFriends: NumFriendsReturn,
) {
  switch (key) {
    case 'friend':
      return numFriends[`${l.course.season_code}${l.crn}`]?.size ?? 0;
    case 'overall':
      return getOverallRatings(l.course, 'stat');
    case 'workload':
      return getWorkloadRatings(l.course, 'stat');
    case 'enrollment':
      return getEnrolled(l.course, 'stat');
    case 'time':
      return toDayTimeScore(l.course);
    case 'location':
      return toLocationsSummary(l.course);
    case 'course_code':
      return l[key];
    case 'title':
    case 'average_professor_rating':
    case 'average_gut_rating':
    case 'season_code':
    case 'section':
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

export function isGraduate(listing: Pick<Listings, 'school'>): boolean {
  return listing.school !== 'YC';
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
