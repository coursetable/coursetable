// Performing various actions on the listing dictionary
import moment from 'moment';
import { isEmpty, orderBy } from 'lodash';
import { DateTime } from 'luxon';

import {
  type Crn,
  type Season,
  type Weekdays,
  weekdays,
  type Listing,
} from './common';
import type {
  FriendRecord,
  FriendInfo,
  Worksheet,
} from '../contexts/userContext';
import type { OrderingType } from '../contexts/searchContext';
import type { SortKeys } from '../queries/Constants';

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
  crn: Crn | string,
  worksheetNumber: string,
  worksheet?: Worksheet,
): boolean {
  if (!worksheet) return false;
  return worksheet.some(
    (course) =>
      course[0] === seasonCode &&
      course[1] === String(crn) &&
      course[2] === String(worksheetNumber),
  );
}

// Convert season code to legible string
export function toSeasonString(seasonCode: Season): string {
  const year = seasonCode.substring(0, 4);
  const season = ['', 'Spring', 'Summer', 'Fall'][parseInt(seasonCode[5], 10)];
  return `${season} ${year}`;
}

// Checks if the a new course conflicts with the user's worksheet
export function checkConflict(listings: Listing[], course: Listing): Listing[] {
  const conflicts: Listing[] = [];
  const daysToCheck = Object.keys(
    course.times_by_day,
  ) as (keyof Listing['times_by_day'])[];
  // Iterate over worksheet listings
  loopWorksheet: for (const worksheetCourse of listings) {
    // Continue if they aren't in the same season
    if (worksheetCourse.season_code !== course.season_code) continue;
    for (const day of daysToCheck) {
      const info = worksheetCourse.times_by_day[day];
      if (info === undefined) continue;
      const courseInfo = course.times_by_day[day]!;
      for (const [startTime, endTime] of info) {
        const listingStart = moment(startTime, 'HH:mm');
        const listingEnd = moment(endTime, 'HH:mm');
        for (const [courseStartTime, courseEndTime] of courseInfo) {
          const curStart = moment(courseStartTime, 'HH:mm');
          const curEnd = moment(courseEndTime, 'HH:mm');
          // Fix invalid times
          if (listingStart.hour() < 7) listingStart.add(12, 'h');
          if (listingEnd.hour() < 7) listingEnd.add(12, 'h');
          if (curStart.hour() < 7) curStart.add(12, 'h');
          if (curEnd.hour() < 7) curEnd.add(12, 'h');
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
  listings: Listing[],
  course: Listing,
): false | string {
  const classes: string[] = [];
  // Iterate over worksheet listings
  for (const l of listings) {
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
  worksheets: { [key: string]: Worksheet } | undefined,
  names: FriendRecord,
): string[] {
  if (!worksheets) return [];
  return Object.keys(worksheets)
    .filter((friend) =>
      worksheets[friend].some(
        (value) => value[0] === seasonCode && parseInt(value[1], 10) === crn,
      ),
    )
    .map((friend) => names[friend].name);
}

/**
 * Key is season code + crn;
 * Value is the list of friends taking the class
 */
type NumFriendsReturn = { [key: string]: string[] };
// Fetch the friends that are also shopping any course. Used in search and
// worksheet expanded list
export function getNumFriends(friendWorksheets: FriendInfo): NumFriendsReturn {
  // List of each friends' worksheets
  const { worksheets } = friendWorksheets;
  // List of each friends' names/net id
  const names = friendWorksheets.friendInfo;
  // Object to return
  const friends: NumFriendsReturn = {};
  // Iterate over each friend's worksheet
  for (const friend of Object.keys(worksheets)) {
    // Iterate over each course in this friend's worksheet
    worksheets[friend].forEach((course) => {
      const key = course[0] + course[1]; // Key of object is season code + crn
      friends[key] ||= []; // List doesn't exist for this course so create one
      friends[key].push(names[friend].name); // Add friend's name to this list
    });
  }
  return friends;
}

// Get the overall rating for a course
export function getOverallRatings(
  course: Listing,
  display?: false,
): number | null;
export function getOverallRatings(course: Listing, display: true): string;
export function getOverallRatings(
  course: Listing,
  display = false,
): string | number | null {
  // Determine which overall rating to use
  if (display) {
    return course.average_rating_same_professors
      ? course.average_rating_same_professors.toFixed(1) // Use same professor if possible
      : course.average_rating
      ? `~${course.average_rating.toFixed(1)}` // Use all professors otherwise and add tilde ~
      : 'N/A'; // No ratings at all
  }
  return course.average_rating_same_professors
    ? course.average_rating_same_professors // Use same professor if possible
    : course.average_rating
    ? course.average_rating // Use all professors otherwise
    : null; // No ratings at all
}

// Get the workload rating for a course
export function getWorkloadRatings(
  course: Listing,
  display?: false,
): number | null;
export function getWorkloadRatings(course: Listing, display: true): string;
export function getWorkloadRatings(
  course: Listing,
  display = false,
): string | number | null {
  // Determine which workload rating to use
  if (display) {
    return course.average_workload_same_professors
      ? course.average_workload_same_professors.toFixed(1) // Use same professor if possible
      : course.average_workload
      ? `~${course.average_workload.toFixed(1)}` // Use all professors otherwise and add tilde ~
      : 'N/A'; // No ratings at all
  }
  return course.average_workload_same_professors
    ? course.average_workload_same_professors // Use same professor if possible
    : course.average_workload
    ? course.average_workload // Use all professors otherwise
    : null; // No ratings at all
}

// Get start and end times
export function getDayTimes(
  course: Listing,
): { [key: string]: string }[] | null {
  // If no times then return null
  if (isEmpty(course.times_by_day)) return null;
  return Object.entries(course.times_by_day).map(([day, dayTimes]) => ({
    day,
    start: dayTimes[0][0],
    end: dayTimes[0][1],
  }));
}

// Calculate day and time score
function calculateDayTime(course: Listing): number | null {
  // Get all days' times
  const times = getDayTimes(course);

  if (times) {
    // Calculate the time score
    const startTime = Number(
      times[0].start.split(':').reduce((final, num) => {
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

// Helper function that returns the correct value to sort by
function helperSort(
  listing: Listing,
  key: SortKeys,
  numFriends: NumFriendsReturn,
): number | string | boolean | null {
  // Sorting by friends
  if (key === 'friend') {
    // Concatenate season code and crn to form key
    const friendKey = listing.season_code + listing.crn;
    // No friends. return zero
    if (!numFriends[friendKey]) return 0;
    // Has friends. return number of friends
    return numFriends[friendKey].length;
  }
  // Sorting by course rating
  if (key === 'average_rating') {
    // Factor in same professors rating if it exists
    return getOverallRatings(listing);
  }
  // Sorting by days & times
  if (key === 'times_by_day') {
    // Calculate day and time score for sorting
    return calculateDayTime(listing);
  }
  // If value is 0, return null
  if (listing[key] === 0) return null;
  return listing[key] ?? null;
}

// Sort courses in catalog or expanded worksheet
export function sortCourses(
  courses: Listing[],
  ordering: OrderingType,
  numFriends: NumFriendsReturn,
): Listing[] {
  // Sort classes
  const sorted = orderBy(
    courses,
    [
      (listing) => helperSort(listing, ordering.key, numFriends) === null,
      (listing) => helperSort(listing, ordering.key, numFriends),
      (listing) => listing.course_code,
    ],
    ['asc', ordering.type, 'asc'],
  );
  return sorted;
}

// Get the enrollment for a course
export function getEnrolled(
  course: Listing,
  display = false,
  onModal = false,
): string | number | null {
  let courseEnrolled: string | number | null = null;
  // Determine which enrolled to use
  if (display) {
    courseEnrolled = course.enrolled
      ? course.enrolled // Use enrollment for that season if course has happened
      : course.last_enrollment && course.last_enrollment_same_professors
      ? course.last_enrollment // Use last enrollment if course hasn't happened
      : course.last_enrollment
      ? `~${course.last_enrollment}${
          onModal ? ' (different professor was teaching)' : ''
        }` // Indicate diff prof
      : onModal
      ? 'N/A'
      : ''; // No enrollment data
  } else {
    courseEnrolled = course.enrolled
      ? course.enrolled // Use enrollment for that season if course has happened
      : course.last_enrollment
      ? course.last_enrollment // Use last enrollment if course hasn't happened
      : null; // No enrollment data
  }

  // Return enrolled
  return courseEnrolled;
}

// Convert real time (24 hour) to range time
export function toRangeTime(time: string): number {
  // Get hour and minute
  const splitTime = time.split(':');
  const hour = Number(splitTime[0]);
  const minute = Number(splitTime[1]);

  // Calculate range time
  const rangeTime = hour * 12 + minute / 5;
  return rangeTime;
}

// Convert range time to real time (24 hour)
export function toRealTime(time: number): string {
  // Get hour and minute
  const hour = Math.floor(time / 12);
  const minute = (time % 12) * 5;

  // Format real time
  const realTime = `${hour}:${minute < 10 ? `0${minute}` : minute}`;
  return realTime;
}

// Convert 24 hour time to 12 hour time
export const to12HourTime = (time: string): string =>
  DateTime.fromFormat(time, 'H:mm').toFormat('h:mma');

// Convert 12 hour time to 24 hour time
export const to24HourTime = (time: string): string =>
  DateTime.fromFormat(time, 'h:mm').toFormat('H:mm');

// Base log
const getBaseLog = (x: number, y: number) => Math.log(y) / Math.log(x);

// Convert linear to exponential
export const toExponential = (number: number): number => 1.01 ** number;

// Convert exponential to linear
export const toLinear = (number: number): number => getBaseLog(1.01, number);
