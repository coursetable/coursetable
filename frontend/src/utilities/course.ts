// Performing various actions on the listing dictionary
import {
  type Crn,
  type Season,
  type Weekdays,
  weekdays,
  type Listing,
} from './common';
import type { FriendRecord, UserWorksheets } from '../contexts/userContext';
import type { SortKeys } from '../contexts/searchContext';
import type { WorksheetCourse } from '../contexts/worksheetContext';

export function truncatedText(
  text: string | null | undefined,
  max: number,
  defaultStr: string,
) {
  if (!text) return defaultStr;
  else if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

// Check if a listing is in the user's worksheet
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

// Convert season code to legible string
export function toSeasonString(seasonCode: Season): string {
  const year = seasonCode.substring(0, 4);
  const season = ['', 'Spring', 'Summer', 'Fall'][Number(seasonCode[5])];
  return `${season} ${year}`;
}

// Checks if the a new course conflicts with the user's worksheet
export function checkConflict(
  worksheetData: WorksheetCourse[],
  course: Listing,
): Listing[] {
  const conflicts: Listing[] = [];
  const daysToCheck = Object.keys(
    course.times_by_day,
  ) as (keyof Listing['times_by_day'])[];
  // Iterate over worksheet listings
  loopWorksheet: for (const { listing: worksheetCourse } of worksheetData) {
    // Continue if they aren't in the same season
    if (worksheetCourse.season_code !== course.season_code) continue;
    for (const day of daysToCheck) {
      const info = worksheetCourse.times_by_day[day];
      if (info === undefined) continue;
      const courseInfo = course.times_by_day[day]!;
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
// Checks if a course is cross-listed in the user's worksheet
export function checkCrossListed(
  worksheetData: WorksheetCourse[],
  course: Listing,
): false | string {
  const classes: string[] = [];
  // Iterate over worksheet listings
  for (const { listing: l } of worksheetData) {
    // Continue if they aren't in the same season
    if (l.season_code !== course.season_code) continue;
    // Keep track of encountered classes and their aliases in the classes array
    classes.push(...l.all_course_codes);
    // Return the course code of the cross-listed class currently in the
    // worksheet if one exists
    if (classes.includes(course.course_code)) return l.course_code;
  }
  return false;
}

// Fetch the friends that are also shopping a specific course. Used in course
// modal overview
export function friendsAlsoTaking(
  seasonCode: Season,
  crn: Crn,
  friends: FriendRecord | undefined,
): string[] {
  if (!friends) return [];
  return Object.values(friends)
    .filter(
      (friend) =>
        seasonCode in friend.worksheets &&
        Object.values(friend.worksheets[seasonCode]!).some((w) =>
          w.some((course) => course.crn === crn),
        ),
    )
    .map((friend) => friend.name);
}

/**
 * Key is season code + crn;
 * Value is the list of friends taking the class
 */
export type NumFriendsReturn = { [seasonCodeCrn: string]: Set<string> };
// Fetch the friends that are also shopping any course. Used in search and
// worksheet expanded list
export function getNumFriends(friends: FriendRecord): NumFriendsReturn {
  // Object to return
  const numFriends: NumFriendsReturn = {};
  // Iterate over each friend's worksheet
  for (const friend of Object.values(friends)) {
    // Iterate over each course in this friend's worksheet
    Object.entries(friend.worksheets).forEach(([seasonCode, worksheets]) => {
      Object.values(worksheets).forEach((w) =>
        w.forEach((course) => {
          const key = seasonCode + course.crn; // Key of object is season code + crn
          (numFriends[key] ??= new Set()).add(friend.name);
        }),
      );
    });
  }
  return numFriends;
}

// Get the overall rating for a course
export function getOverallRatings(
  course: Listing,
  usage: 'stat',
): number | null;
export function getOverallRatings(course: Listing, usage: 'display'): string;
export function getOverallRatings(
  course: Listing,
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

// Get the workload rating for a course
export function getWorkloadRatings(
  course: Listing,
  usage: 'stat',
): number | null;
export function getWorkloadRatings(course: Listing, usage: 'display'): string;
export function getWorkloadRatings(
  course: Listing,
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

// Get average professor rating for a course
export function getProfessorRatings(
  course: Listing,
  usage: 'stat',
): number | null;
export function getProfessorRatings(course: Listing, usage: 'display'): string;
export function getProfessorRatings(
  course: Listing,
  usage: 'stat' | 'display',
): string | number | null {
  if (course.average_professor) {
    return usage === 'stat'
      ? course.average_professor
      : course.average_professor.toFixed(1);
  }
  return usage === 'stat' ? null : 'N/A';
}

// Get start and end times
export function getDayTimes(
  course: Listing,
): { day: Weekdays; start: string; end: string }[] {
  return Object.entries(course.times_by_day).map(([day, dayTimes]) => ({
    day: day as Weekdays,
    start: dayTimes[0]![0],
    end: dayTimes[0]![1],
  }));
}

// Calculate day and time score
function calculateDayTime(course: Listing): number | null {
  // Get all days' times
  const times = getDayTimes(course);

  if (times.length) {
    // Calculate the time score
    const startTime = Number(
      times[0]!.start.split(':').reduce((final, num) => {
        final += num;
        return final;
      }, ''),
    );

    // Calculate the day score
    const firstDay = Object.keys(course.times_by_day)[0] as Weekdays;
    const dayScore = weekdays.indexOf(firstDay) * 10000;

    // Calculate the total score and return
    const score = dayScore + startTime;
    return score;
  }

  // If no times then return null
  return null;
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
  function comparatorReturn(
    aVal: number | string | null,
    bVal: number | string | null,
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
  // Sorting by friends
  if (key === 'friend') {
    // Concatenate season code and crn to form key
    const friendsTakingA = numFriends[a.season_code + a.crn]?.size ?? 0;
    const friendsTakingB = numFriends[b.season_code + b.crn]?.size ?? 0;
    return comparatorReturn(friendsTakingA, friendsTakingB);
  }
  // Sorting by course rating
  if (key === 'average_rating') {
    return comparatorReturn(
      getOverallRatings(a, 'stat'),
      getOverallRatings(b, 'stat'),
    );
  }
  if (key === 'average_workload') {
    return comparatorReturn(
      getWorkloadRatings(a, 'stat'),
      getWorkloadRatings(b, 'stat'),
    );
  }
  // Sorting by days & times
  if (key === 'times_by_day') {
    // Calculate day and time score for sorting
    return comparatorReturn(calculateDayTime(a), calculateDayTime(b));
  }
  // If value is 0, return null
  return comparatorReturn(
    // || is intentional: 0 also means nonexistence
    a[key] || null,
    b[key] || null,
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

// Get the enrollment for a course
export function getEnrolled(
  course: Pick<
    Listing,
    'enrolled' | 'last_enrollment' | 'last_enrollment_same_professors'
  >,
  usage: 'stat',
): number | null;
export function getEnrolled(
  course: Pick<
    Listing,
    'enrolled' | 'last_enrollment' | 'last_enrollment_same_professors'
  >,
  usage: 'display' | 'modal',
): string;
export function getEnrolled(
  course: Pick<
    Listing,
    'enrolled' | 'last_enrollment' | 'last_enrollment_same_professors'
  >,
  usage: 'stat' | 'display' | 'modal',
): string | number | null {
  if (course.enrolled) {
    // Use enrollment for that season if course has happened
    return usage === 'stat' ? course.enrolled : String(course.enrolled);
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

export function isGraduate(listing: Pick<Listing, 'number'>): boolean {
  return Number(listing.number.replace(/\D/gu, '')) >= 500;
}

export function isDiscussionSection(
  listing: Pick<Listing, 'section'>,
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
  // Get hour and minute
  const splitTime = time.split(':');
  const hour = Number(splitTime[0]);
  const minute = Number(splitTime[1]);

  // Calculate range time
  const rangeTime = hour * 12 + minute / 5;
  return rangeTime;
}

/**
 * @param time Number of 5 minutes past midnight
 * @returns A time in the format `hh:mm` (24 hour)
 */
export function toRealTime(time: number): string {
  // Get hour and minute
  const hour = Math.floor(time / 12);
  const minute = (time % 12) * 5;

  // Format real time
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

// Base log
const getBaseLog = (x: number, y: number) => Math.log(y) / Math.log(x);

// Convert linear to exponential
export const toExponential = (number: number): number => 1.01 ** number;

// Convert exponential to linear
export const toLinear = (number: number): number => getBaseLog(1.01, number);
