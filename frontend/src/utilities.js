import { useState, useEffect, useRef } from 'react';
import moment from 'moment';

// Performing various actions on the listing dictionary
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
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
      var flatObject = flatten(ob[i]);
      for (var x in flatObject) {
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

// Conver season code to legible string
export const toSeasonString = (season_code) => {
  if (!season_code) return ['', '', ''];
  const seasons = ['', 'Spring', 'Summer', 'Fall'];
  return [
    season_code.substring(0, 4) + ' ' + seasons[parseInt(season_code[5])],
    season_code.substring(0, 4),
    seasons[parseInt(season_code[5])],
  ];
};

// Detect clicks outside of a component
export const useComponentVisible = (initialIsVisible) => {
  // Is the component visible?
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref_visible = useRef(null);

  // Handle clicks outside of the component
  const handleClickOutside = (event) => {
    // Hide component if user clicked outside of it
    if (ref_visible.current && !ref_visible.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  // Add event listener on mount and remove it on dismount
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref_visible, isComponentVisible, setIsComponentVisible };
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
      // Continue if the new course dosn't meet on this day
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

export const scrollToTop = (event) => {
  const newPage =
    event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;

  if (!newPage) {
    window.scrollTo({ top: 0, left: 0 });
  }
};

// Fetch the FB friends that are also shopping a specific course
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

// Checks if object is in storage
const containsObject = (key, storage) => {
  return storage.getItem(key) ? true : false;
};
// Saves object to storage
const setObject = (key, obj, storage, if_empty = false) => {
  if (if_empty && containsObject(key, storage)) return;
  storage.setItem(key, JSON.stringify(obj));
};
// Retrieves object from storage
const getObject = (key, storage) => {
  let str_val = storage.getItem(key);
  return str_val === 'undefined' ? undefined : JSON.parse(str_val);
};

// session storage functions
export const setSSObject = (key, obj, if_empty = false) => {
  setObject(key, obj, window.sessionStorage, if_empty);
};
export const getSSObject = (key) => {
  return getObject(key, window.sessionStorage);
};

// local storage functions
export const setLSObject = (key, obj, if_empty = false) => {
  setObject(key, obj, window.localStorage, if_empty);
};
export const getLSObject = (key) => {
  return getObject(key, window.localStorage);
};

// Saves State in Session Storage
export function useSessionStorageState(key, default_value) {
  setSSObject(key, default_value, true);
  const [value, setValue] = useState(getSSObject(key));
  useEffect(() => {
    setSSObject(key, value);
  }, [key, value]);
  return [value, setValue];
}
