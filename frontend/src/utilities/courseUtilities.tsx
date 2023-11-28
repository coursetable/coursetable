/* eslint-disable guard-for-in */
// Performing various actions on the listing dictionary
import moment from 'moment';
import { Crn, Season, Weekdays, weekdays } from './common';
import { FriendRecord, FriendInfo, Worksheet } from '../contexts/userContext';
import { Listing } from '../components/Providers/FerryProvider';
import { SortKeys } from '../queries/Constants';
import { isEmpty, orderBy } from 'lodash';
import { DateTime } from 'luxon';

// Check if a listing is in the user's worksheet
export const isInWorksheet = (
  season_code: Season,
  crn: Crn | string,
  worksheet_number: string,
  worksheet?: Worksheet,
): boolean => {
  if (worksheet == null) return false;
  if (typeof crn !== 'string') {
    crn = crn.toString();
  }
  for (let i = 0; i < worksheet.length; i++) {
    if (
      worksheet[i][0] === season_code &&
      worksheet[i][1] === crn &&
      worksheet[i][2] === worksheet_number.toString()
    )
      return true;
  }
  return false;
};

// Convert season code to legible string
export const toSeasonString = (
  season_code: Season,
): readonly [string, string, string] => {
  if (!season_code) return ['', '', ''];
  const seasons = ['', 'Spring', 'Summer', 'Fall'];
  return [
    `${seasons[parseInt(season_code[5], 10)]} ${season_code.substring(0, 4)}`,
    season_code.substring(0, 4),
    seasons[parseInt(season_code[5], 10)],
  ] as const;
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
        const listing_start = moment(startTime, 'HH:mm');
        const listing_end = moment(endTime, 'HH:mm');
        for (const [courseStartTime, courseEndTime] of courseInfo) {
          const cur_start = moment(courseStartTime, 'HH:mm');
          const cur_end = moment(courseEndTime, 'HH:mm');
          // Fix invalid times
          if (listing_start.hour() < 8) listing_start.add(12, 'h');
          if (listing_end.hour() < 8) listing_end.add(12, 'h');
          if (cur_start.hour() < 8) cur_start.add(12, 'h');
          if (cur_end.hour() < 8) cur_end.add(12, 'h');
          // Conflict exists
          if (
            !(listing_start > cur_end || cur_start > listing_end) &&
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
    // Return the course code of the cross-listed class currently in the worksheet if one exists
    if (classes.includes(course.course_code)) return listings[i].course_code;
  }
  return false;
};

// Fetch the FB friends that are also shopping a specific course. Used in course modal overview
export const FriendsAlsoTaking = (
  season_code: Season,
  crn: Crn,
  worksheets: Worksheet,
  names: FriendRecord,
): string[] => {
  // Return if worksheets are null
  if (!worksheets) return [];
  // List of FB friends also shopping
  const also_taking = [];
  for (const friend in worksheets) {
    if (
      worksheets[friend].find((value) => {
        return value[0] === season_code && parseInt(value[1], 10) === crn;
      })
    )
      // Found one
      also_taking.push(names[friend].name);
  }
  return also_taking;
};
type NumFriendsReturn =
  // Key is season code + crn
  // Value is the list of FB friends taking the class
  Record<string, string[]>;
// Fetch the FB friends that are also shopping any course. Used in search and worksheet expanded list
export const getNumFriends = (
  friendWorksheets: FriendInfo,
): NumFriendsReturn => {
  // List of each friends' worksheets
  const { worksheets } = friendWorksheets;
  // List of each friends' names/facebook id
  const names = friendWorksheets.friendInfo;
  // Object to return
  const friend_dict: NumFriendsReturn = {};
  // Iterate over each friend's worksheet
  for (const friend in worksheets) {
    // Iterate over each course in this friend's worksheet
    worksheets[friend].forEach((course) => {
      const key = course[0] + course[1]; // Key of object is season code + crn
      if (!friend_dict[key]) friend_dict[key] = []; // List doesn't exist for this course so create one
      friend_dict[key].push(names[friend].name); // Add friend's name to this list
    });
  }
  return friend_dict;
};

// Get the overall rating for a course
export const getOverallRatings = (
  course: Listing,
  display = false,
): string | number | null => {
  let course_rating;
  // Determine which overall rating to use
  if (display) {
    course_rating = course.average_rating_same_professors
      ? course.average_rating_same_professors.toFixed(1) // Use same professor if possible
      : course.average_rating
      ? `~${course.average_rating.toFixed(1)}` // Use all professors otherwise and add tilde ~
      : 'N/A'; // No ratings at all
  } else {
    course_rating = course.average_rating_same_professors
      ? course.average_rating_same_professors // Use same professor if possible
      : course.average_rating
      ? course.average_rating // Use all professors otherwise
      : null; // No ratings at all
  }

  // Return overall rating
  return course_rating;
};

// Get the workload rating for a course
export const getWorkloadRatings = (
  course: Listing,
  display = false,
): string | number | null => {
  let course_workload;
  // Determine which workload rating to use
  if (display) {
    course_workload = course.average_workload_same_professors
      ? course.average_workload_same_professors.toFixed(1) // Use same professor if possible
      : course.average_workload
      ? `~${course.average_workload.toFixed(1)}` // Use all professors otherwise and add tilde ~
      : 'N/A'; // No ratings at all
  } else {
    course_workload = course.average_workload_same_professors
      ? course.average_workload_same_professors // Use same professor if possible
      : course.average_workload
      ? course.average_workload // Use all professors otherwise
      : null; // No ratings at all
  }

  // Return workload rating
  return course_workload;
};

// Calculate day and time score
const calculateDayTime = (course: Listing): number | null => {
  // Get all days' times
  const times = getDayTimes(course);

  if (times) {
    // Get earliest start time
    // const earliestTime = times.reduce((early, time) => {
    //   if (toRangeTime(time.start) < toRangeTime(early)) {
    //     early = time.start;
    //   }
    //   return early;
    // }, '0:00');

    // Calculate the time score
    const start_time = Number(
      times[0].start.split(':').reduce((final, num) => {
        final += num;
        return final;
      }, ''),
    );

    // Calculate the day score
    const first_day = Object.keys(course.times_by_day)[0] as Weekdays;
    const day_score = weekdays.indexOf(first_day) * 10000;

    // Calculate the total score and return
    const score = day_score + start_time;
    return score;
  }

  // If no times then return null
  return null;
};

// Helper function that returns the correct value to sort by
const helperSort = (
  listing: Listing,
  key: SortKeys,
  num_friends: NumFriendsReturn,
) => {
  // Sorting by friends
  if (key === 'friend') {
    // Concatenate season code and crn to form key
    const friend_key = listing.season_code + listing.crn;
    // No friends. return zero
    if (!num_friends[friend_key]) return 0;
    // Has friends. return number of friends
    return num_friends[friend_key].length;
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
  if (listing[key] === 0) {
    return null;
  }
  return listing[key];
};

// Sort courses in catalog or expanded worksheet
export const sortCourses = (
  courses: Listing[],
  // TODO: we should be much more strict with this type. Specifically,
  // we should prevent there from being multiple keys.
  ordering: { [key in SortKeys]?: 'asc' | 'desc' },
  num_friends: NumFriendsReturn,
): Listing[] => {
  // Key to sort the courses by
  const key = Object.keys(ordering)[0] as SortKeys;
  // Boolean | in ascending order?
  const order_asc = ordering[key]!.startsWith('asc');
  // Sort classes
  const sorted = orderBy(
    courses,
    [
      (listing) => helperSort(listing, key, num_friends) == null,
      (listing) => helperSort(listing, key, num_friends),
      (listing) => listing.course_code,
    ],
    ['asc', order_asc ? 'asc' : 'desc', 'asc'],
  );
  return sorted;
};

// Get the enrollment for a course
export const getEnrolled = (
  course: Listing,
  display = false,
  onModal = false,
): string | number | null => {
  let course_enrolled;
  // Determine which enrolled to use
  if (display) {
    course_enrolled = course.enrolled
      ? course.enrolled // Use enrollment for that season if course has happened
      : course.last_enrollment && course.last_enrollment_same_professors
      ? course.last_enrollment // Use last enrollment if course hasn't happened
      : course.last_enrollment
      ? `~${course.last_enrollment}${
          onModal ? ' (different professor was teaching)' : ''
        }` // Indicate diff prof
      : `${onModal ? 'N/A' : ''}`; // No enrollment data
  } else {
    course_enrolled = course.enrolled
      ? course.enrolled // Use enrollment for that season if course has happened
      : course.last_enrollment
      ? course.last_enrollment // Use last enrollment if course hasn't happened
      : null; // No enrollment data
  }

  // Return enrolled
  return course_enrolled;
};

// Get start and end times
export const getDayTimes = (
  course: Listing,
): Record<string, string>[] | null => {
  // If no times then return null
  if (isEmpty(course.times_by_day)) {
    return null;
  }

  // Get the first day's times
  const { times_by_day } = course;

  const initialFiltered: Record<string, string>[] = [];

  const times = Object.keys(times_by_day).reduce((filtered, day) => {
    const day_times = times_by_day[day as Weekdays];
    if (day_times) {
      filtered.push({ day, start: day_times[0][0], end: day_times[0][1] });
    }
    return filtered;
  }, initialFiltered);

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
export const to12HourTime = (time: string): string => {
  return DateTime.fromFormat(time, 'H:mm').toFormat('h:mma');
};

// Convert 12 hour time to 24 hour time
export const to24HourTime = (time: string): string => {
  return DateTime.fromFormat(time, 'h:mm').toFormat('H:mm');
};

// Base log
const getBaseLog = (x: number, y: number) => {
  return Math.log(y) / Math.log(x);
};

// Convert linear to exponential
export const toExponential = (number: number): number => {
  return 1.01 ** number;
};

// Convert exponential to linear
export const toLinear = (number: number): number => {
  return getBaseLog(1.01, number);
};
