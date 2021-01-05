// Performing various actions on the listing dictionary
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import { Crn, Season, weekdays } from './common';
import { FBFriendInfo, FBInfo, Worksheet } from './user';
import { Listing } from './components/FerryProvider';
import { SortKeys } from './queries/Constants';

// Check if a listing is in the user's worksheet
export const isInWorksheet = (
  season_code: Season,
  crn: Crn | string,
  worksheet?: Worksheet
) => {
  if (worksheet == null) return false;
  if (typeof crn !== 'string') {
    crn = crn.toString();
  }
  for (let i = 0; i < worksheet.length; i++) {
    if (worksheet[i][0] === season_code && worksheet[i][1] === crn) return true;
  }
  return false;
};
// Convert season code to legible string
export const toSeasonString = (season_code: Season) => {
  if (!season_code) return ['', '', ''];
  const seasons = ['', 'Spring', 'Summer', 'Fall'];
  return [
    `${season_code.substring(0, 4)} ${seasons[parseInt(season_code[5], 10)]}`,
    season_code.substring(0, 4),
    seasons[parseInt(season_code[5], 10)],
  ] as const;
};
// Unflatten course times for easy use in checkConflict
export const unflattenTimes = (course: Listing) => {
  if (!course) return undefined;
  if (course.times_summary === 'TBA') return 'TBA';
  // Holds the course times for each day of the week
  const times_by_day = weekdays.map((day): [string, string, string, string] => {
    const times_on_day = course.times_by_day[day];
    if (!times_on_day) return ['', '', '', ''];
    return times_on_day[0];
  });
  return times_by_day;
};
// Checks if the a new course conflicts with the user's worksheet
export const checkConflict = (
  listings: Listing[],
  course: Listing,
  times: [string, string, string, string][] // index is 0-4, corresponding to weekdays
) => {
  // Iterate over worksheet listings
  for (let i = 0; i < listings.length; i++) {
    // Continue if they aren't in the same season
    if (listings[i].season_code !== course.season_code) continue;
    const listing = listings[i];
    // Iterate over weekdays
    for (let day = 0; day < 5; day++) {
      const info = listing.times_by_day[weekdays[day]];
      // Continue if the new course doesn't meet on this day
      if (info === undefined) continue;
      // Get worksheet course's start and end times
      const listing_start = moment(info[0][0], 'HH:mm');
      const listing_end = moment(info[0][1], 'HH:mm');
      // Continue if new course has invalid time
      if (times[day][0] === '') continue;
      // Get new course' start and end times
      const cur_start = moment(times[day][0], 'HH:mm');
      const cur_end = moment(times[day][1], 'HH:mm');
      // Fix invalid times
      if (listing_start.hour() < 8) listing_start.add(12, 'h');
      if (listing_end.hour() < 8) listing_end.add(12, 'h');
      if (cur_start.hour() < 8) cur_start.add(12, 'h');
      if (cur_end.hour() < 8) cur_end.add(12, 'h');
      // Conflict exists
      if (!(listing_start > cur_end || cur_start > listing_end)) {
        return true;
      }
    }
  }
  // Conflict doesn't exist
  return false;
};
// Fetch the FB friends that are also shopping a specific course. Used in course modal overview
export const fbFriendsAlsoTaking = (
  season_code: Season,
  crn: Crn,
  worksheets: Worksheet,
  names: FBFriendInfo
) => {
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
type NumFBReturn =
  // Key is season code + crn
  // Value is the list of FB friends taking the class
  Record<string, string[]>;
// Fetch the FB friends that are also shopping any course. Used in search and worksheet expanded list
export const getNumFB = (fbWorksheets: FBInfo) => {
  // List of each friends' worksheets
  const { worksheets } = fbWorksheets;
  // List of each friends' names/facebook id
  const names = fbWorksheets.friendInfo;
  // Object to return
  const fb_dict: NumFBReturn = {};
  // Iterate over each fb friend's worksheet
  for (const friend in worksheets) {
    // Iterate over each course in this friend's worksheet
    worksheets[friend].forEach((course) => {
      const key = course[0] + course[1]; // Key of object is season code + crn
      if (!fb_dict[key]) fb_dict[key] = []; // List doesn't exist for this course so create one
      fb_dict[key].push(names[friend].name); // Add fb friend's name to this list
    });
  }
  return fb_dict;
};
// Helper function that returns the correct value to sort by
const helperSort = (listing: Listing, key: SortKeys, num_fb: NumFBReturn) => {
  // Sorting by fb friends
  if (key === 'fb') {
    // Concatenate season code and crn to form key
    const fb_key = listing.season_code + listing.crn;
    // No friends. return null
    if (!num_fb[fb_key]) return null;
    // Has friends. return number of friends
    return num_fb[fb_key].length;
  }
  // Sorting by course rating
  if (key === 'average_rating') {
    // Factor in same professors rating if it exists
    return getOverallRatings(listing);
  }
  return listing[key];
};
// Sort courses in catalog or expanded worksheet
export const sortCourses = (
  courses: Listing[],
  // TODO: we should be much more strict with this type. Specifically,
  // we should prevent there from being multiple keys.
  ordering: { [key in SortKeys]?: 'asc' | 'desc' },
  num_fb: NumFBReturn
) => {
  // Key to sort the courses by
  const key = Object.keys(ordering)[0] as SortKeys;
  // Boolean | in ascending order?
  const order_asc = ordering[key]!.startsWith('asc');
  // Sort classes
  const sorted = orderBy(
    courses,
    [
      (listing) => helperSort(listing, key, num_fb) == null,
      (listing) => helperSort(listing, key, num_fb),
      (listing) => listing.course_code,
    ],
    ['asc', order_asc ? 'asc' : 'desc', 'asc']
  );
  return sorted;
};
// Get the overall rating for a course
export const getOverallRatings = (course: Listing) => {
  // Determine which overall rating to use
  const course_rating = course.average_rating_same_professors
    ? course.average_rating_same_professors.toFixed(1) // Use same professor if possible
    : course.average_rating
    ? course.average_rating.toFixed(1) // Use all professors otherwise
    : null; // No ratings at all

  // Return rating
  return course_rating;
};
