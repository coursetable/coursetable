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
import type { SortKeys } from '../queries/Constants';

// Check if a listing is in the user's worksheet
export const isInWorksheet = (
  seasonCode: Season,
  crn: Crn | string,
  worksheetNumber: string,
  worksheet?: Worksheet,
): boolean => {
  if (worksheet == null) return false;
  if (typeof crn !== 'string') crn = crn.toString();

  for (let i = 0; i < worksheet.length; i++) {
    if (
      worksheet[i][0] === seasonCode &&
      worksheet[i][1] === crn &&
      worksheet[i][2] === worksheetNumber.toString()
    )
      return true;
  }
  return false;
};

// Convert season code to legible string
export const toSeasonString = (seasonCode: Season): string => {
  const year = seasonCode.substring(0, 4);
  const season = ['', 'Spring', 'Summer', 'Fall'][parseInt(seasonCode[5], 10)];
  return `${season} ${year}`;
};

// Checks if the a new course conflicts with the user's worksheet
export const checkConflict = (
  listings: Listing[],
  course: Listing,
): Listing[] => {
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
};
// Checks if a course is cross-listed in the user's worksheet
export const checkCrossListed = (
  listings: Listing[],
  course: Listing,
): boolean | string => {
  const classes: string[] = [];
  // Iterate over worksheet listings
  for (let i = 0; i < listings.length; i++) {
    // Continue if they aren't in the same season
    if (listings[i].season_code !== course.season_code) continue;
    // Keep track of encountered classes and their aliases in the classes array
    classes.push(...listings[i].all_course_codes);
    // Return the course code of the cross-listed class currently in the
    // worksheet if one exists
    if (classes.includes(course.course_code)) return listings[i].course_code;
  }
  return false;
};

// Fetch the friends that are also shopping a specific course. Used in course
// modal overview
export function friendsAlsoTaking(
  seasonCode: Season,
  crn: Crn,
  worksheets: { [key: string]: Worksheet } | undefined,
  names: FriendRecord,
): string[] {
  // Return if worksheets are null
  if (!worksheets) return [];
  // List of friends also shopping
  const alsoTaking: string[] = [];
  for (const friend of Object.keys(worksheets)) {
    if (
      worksheets[friend].some(
        (value) => value[0] === seasonCode && parseInt(value[1], 10) === crn,
      )
    )
      // Found one
      alsoTaking.push(names[friend].name);
  }
  return alsoTaking;
}

/**
 * Key is season code + crn;
 * Value is the list of friends taking the class
 */
type NumFriendsReturn = { [key: string]: string[] };
// Fetch the friends that are also shopping any course. Used in search and
// worksheet expanded list
export const getNumFriends = (
  friendWorksheets: FriendInfo,
): NumFriendsReturn => {
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
};

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

// Calculate day and time score
const calculateDayTime = (course: Listing): number | null => {
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
};

// Helper function that returns the correct value to sort by
const helperSort = (
  listing: Listing,
  key: SortKeys,
  numFriends: NumFriendsReturn,
) => {
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

  return listing[key];
};

// Sort courses in catalog or expanded worksheet
export const sortCourses = (
  courses: Listing[],
  // TODO: we should be much more strict with this type. Specifically,
  // we should prevent there from being multiple keys.
  ordering: { [key in SortKeys]?: 'asc' | 'desc' },
  numFriends: NumFriendsReturn,
): Listing[] => {
  // Key to sort the courses by
  const key = Object.keys(ordering)[0] as SortKeys;
  // Boolean | in ascending order?
  const orderAsc = ordering[key]!.startsWith('asc');
  // Sort classes
  const sorted = orderBy(
    courses,
    [
      (listing) => helperSort(listing, key, numFriends) == null,
      (listing) => helperSort(listing, key, numFriends),
      (listing) => listing.course_code,
    ],
    ['asc', orderAsc ? 'asc' : 'desc', 'asc'],
  );
  return sorted;
};

// Get the enrollment for a course
export const getEnrolled = (
  course: Listing,
  display = false,
  onModal = false,
): string | number | null => {
  let courseEnrolled: string | number | null;
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
      : String(onModal ? 'N/A' : ''); // No enrollment data
  } else {
    courseEnrolled = course.enrolled
      ? course.enrolled // Use enrollment for that season if course has happened
      : course.last_enrollment
      ? course.last_enrollment // Use last enrollment if course hasn't happened
      : null; // No enrollment data
  }

  // Return enrolled
  return courseEnrolled;
};

// Get start and end times
export const getDayTimes = (
  course: Listing,
): { [key: string]: string }[] | null => {
  // If no times then return null
  if (isEmpty(course.times_by_day)) return null;

  const initialFiltered: { [key: string]: string }[] = [];

  const times = Object.entries(course.times_by_day).reduce(
    (filtered, [day, dayTimes]) => {
      if (dayTimes)
        filtered.push({ day, start: dayTimes[0][0], end: dayTimes[0][1] });

      return filtered;
    },
    initialFiltered,
  );

  return times;
};
// Convert real time (24 hour) to range time
export const toRangeTime = (time: string): number => {
  // Get hour and minute
  const splitTime = time.split(':');
  const hour = Number(splitTime[0]);
  const minute = Number(splitTime[1]);

  // Calculate range time
  const rangeTime = hour * 12 + minute / 5;
  return rangeTime;
};

// Convert range time to real time (24 hour)
export const toRealTime = (time: number): string => {
  // Get hour and minute
  const hour = Math.floor(time / 12);
  const minute = (time % 12) * 5;

  // Format real time
  const realTime = `${hour}:${minute < 10 ? `0${minute}` : minute}`;
  return realTime;
};

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
