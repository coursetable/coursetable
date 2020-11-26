// Performing various actions on the listing dictionary
import moment from 'moment';
import orderBy from 'lodash/orderBy';

export const preprocess_courses = (listing) => {
  // trim decimal points in ratings floats
  const RATINGS_PRECISION = 1;

  // Combine the list of skills into one string
  if ('course.skills' in listing) {
    listing['skills'] = listing['course.skills'].join(' ');
  }

  // Combine the list of areas into one string
  if ('course.areas' in listing) {
    listing['areas'] = listing['course.areas'].join(' ');
  }

  if ('course.evaluation_statistics' in listing) {
    const ratings = listing['course.evaluation_statistics'];

    if (ratings.length === 1) {
      const rating = ratings[0];
      // Trim ratings to one decimal point
      if ('avg_rating' in rating && rating['avg_rating'] !== null) {
        listing['avg_rating'] = rating['avg_rating'].toFixed(RATINGS_PRECISION);
      }
      if ('avg_workload' in rating && rating['avg_workload'] !== null) {
        listing['avg_workload'] = rating['avg_workload'].toFixed(
          RATINGS_PRECISION
        );
      }

      // Make enrollment data more accessible
      if ('enrollment' in rating) {
        if ('enrolled' in rating['enrollment']) {
          listing['enrolled'] = rating['enrollment']['enrolled'];
        }
      }
    }
  }

  // Combine array of professors into one string
  if ('professor_names' in listing && listing['professor_names'].length > 0) {
    listing['professors'] = listing['professor_names'].join(', ');
    // for the average professor rating, take the first professor
    if ('average_professor' in listing && listing['average_professor'] !== null)
      // Trim professor ratings to one decimal point
      listing['professor_avg_rating'] = listing['average_professor'].toFixed(
        RATINGS_PRECISION
      );
  }
  return listing;
};
// Flatten dictionaries to make data more accessible
export const flatten = (ob) => {
  const toReturn = {};

  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
      const flatObject = flatten(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};
// Check if a listing is in the user's worksheet
export const isInWorksheet = (season_code, crn, worksheet) => {
  if (worksheet === null) return false;
  for (let i = 0; i < worksheet.length; i++) {
    if (worksheet[i][0] === season_code && worksheet[i][1] === crn) return true;
  }
  return false;
};
// Convert season code to legible string
export const toSeasonString = (season_code) => {
  if (!season_code) return ['', '', ''];
  const seasons = ['', 'Spring', 'Summer', 'Fall'];
  return [
    season_code.substring(0, 4) + ' ' + seasons[parseInt(season_code[5])],
    season_code.substring(0, 4),
    seasons[parseInt(season_code[5])],
  ];
};
// Unflatten course times for easy use in checkConflict
export const unflattenTimes = (course) => {
  if (!course) return undefined;
  if (course.times_summary === 'TBA') return 'TBA';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  // Holds the course times for each day of the week
  let times_by_day = [];
  days.forEach((day) => {
    if (!course[`times_by_day.${day}`]) times_by_day.push(['', '', '', '']);
    else times_by_day.push(course[`times_by_day.${day}`][0]);
  });
  return times_by_day;
};
// Checks if the a new course conflicts with the user's worksheet
export const checkConflict = (listings, course, times) => {
  // Iterate over worksheet listings
  for (let i = 0; i < listings.length; i++) {
    // Continue if they aren't in the same season
    if (listings[i].season_code !== course.season_code) continue;
    const listing = listings[i];
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    // Iterate over weekdays
    for (let day = 0; day < 5; day++) {
      const info = listing['times_by_day.' + [weekdays[day]]];
      // Continue if the new course doesn't meet on this day
      if (info === undefined) continue;
      // Get worksheet course's start and end times
      let listing_start = moment(info[0][0], 'HH:mm');
      let listing_end = moment(info[0][1], 'HH:mm');
      // Continue if new course has invalid time
      if (times[day][0] === '') continue;
      // Get new course' start and end times
      let cur_start = moment(times[day][0], 'HH:mm');
      let cur_end = moment(times[day][1], 'HH:mm');
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
export const fbFriendsAlsoTaking = (season_code, crn, worksheets, names) => {
  // Return if worksheets are null
  if (!worksheets) return [];
  // List of FB friends also shopping
  let also_taking = [];
  for (let friend in worksheets) {
    if (
      worksheets[friend].find((value) => {
        return value[0] === season_code && parseInt(value[1]) === crn;
      })
    )
      // Found one
      also_taking.push(names[friend].name);
  }
  return also_taking;
};
// Fetch the FB friends that are also shopping any course. Used in search and worksheet expanded list
export const getNumFB = (fbWorksheets) => {
  // List of each friends' worksheets
  const worksheets = fbWorksheets.worksheets;
  // List of each friends' names/facebook id
  const names = fbWorksheets.friendInfo;
  // Object to return
  let fb_dict = {};
  // Iterate over each fb friend's worksheet
  for (let friend in worksheets) {
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
const helperSort = (listing, key, num_fb) => {
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
  else if (key === 'average_rating') {
    // Factor in same professors rating if it exists
    return getOverallRatings(listing);
  } else {
    return listing[key];
  }
};
// Sort courses in catalog or expanded worksheet
export const sortCourses = (courses, ordering, num_fb) => {
  // Key to sort the courses by
  const key = Object.keys(ordering)[0];
  // Boolean | in ascending order?
  const order_asc = ordering[key].startsWith('asc');
  // Sort classes
  const sorted = orderBy(
    courses,
    [
      (listing) => !!helperSort(listing, key, num_fb) || listing[key] === 0,
      (listing) => helperSort(listing, key, num_fb),
      (listing) => listing.course_code,
    ],
    ['desc', order_asc ? 'asc' : 'desc', 'asc']
  );
  return sorted;
};
// Get the overall rating for a course
export const getOverallRatings = (course) => {
  // Determine which overall rating to use
  const course_rating = course['course.average_rating_same_professors']
    ? course['course.average_rating_same_professors'].toFixed(1) // Use same professor if possible
    : course.average_rating
    ? course.average_rating.toFixed(1) // Use all professors otherwise
    : null; // No ratings at all

  // Return rating
  return course_rating;
};
