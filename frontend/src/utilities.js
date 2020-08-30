import { useState, useEffect, useRef } from 'react';
import moment from 'moment';

export const preprocess_courses = (listing) => {
  // trim decimal points in ratings floats
  const RATINGS_PRECISION = 1;

  if ('course.skills' in listing) {
    listing['skills'] = listing['course.skills'].join(' ');
  }

  if ('course.areas' in listing) {
    listing['areas'] = listing['course.areas'].join(' ');
  }

  if ('course.evaluation_statistics' in listing) {
    const ratings = listing['course.evaluation_statistics'];

    if (ratings.length === 1) {
      const rating = ratings[0];

      if ('avg_rating' in rating && rating['avg_rating'] !== null) {
        listing['avg_rating'] = rating['avg_rating'].toFixed(RATINGS_PRECISION);
      }

      if ('avg_workload' in rating && rating['avg_workload'] !== null) {
        listing['avg_workload'] = rating['avg_workload'].toFixed(
          RATINGS_PRECISION
        );
      }

      if ('enrollment' in rating) {
        if ('enrolled' in rating['enrollment']) {
          listing['enrolled'] = rating['enrollment']['enrolled'];
        }
      }
    }
  }

  if (
    'course.course_professors' in listing &&
    listing['course.course_professors'].length > 0
  ) {
    listing['professors'] = listing['course.course_professors']
      .map((x) => {
        return x['professor']['name'];
      })
      .join(', ');

    // for the average professor rating, take the first professor
    const professor = listing['course.course_professors'][0]['professor'];

    if ('average_rating' in professor && professor['average_rating'] !== null) {
      listing['professor_avg_rating'] = professor['average_rating'].toFixed(
        RATINGS_PRECISION
      );
    }
  }

  return listing;
};

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

export const isInWorksheet = (season_code, crn, worksheet) => {
  if (worksheet === null) return false;
  for (let i = 0; i < worksheet.length; i++) {
    if (worksheet[i][0] === season_code && worksheet[i][1] === crn) return true;
  }
  return false;
};

export const toSeasonString = (season_code) => {
  if (!season_code) return ['', '', ''];
  const seasons = ['', 'Spring', 'Summer', 'Fall'];
  return [
    season_code.substring(0, 4) + ' ' + seasons[parseInt(season_code[5])],
    season_code.substring(0, 4),
    seasons[parseInt(season_code[5])],
  ];
};

export const useComponentVisible = (initialIsVisible) => {
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref_visible = useRef(null);

  const handleClickOutside = (event) => {
    if (ref_visible.current && !ref_visible.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref_visible, isComponentVisible, setIsComponentVisible };
};

export const unflattenTimes = (course) => {
  if (!course) return undefined;
  if (course.times_summary === 'TBA') return 'TBA';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let times_by_day = [];
  days.forEach((day) => {
    if (!course[`times_by_day.${day}`]) times_by_day.push(['', '', '', '']);
    else times_by_day.push(course[`times_by_day.${day}`][0]);
  });
  return times_by_day;
};

export const unflattenTimesModal = (listing) => {
  if (!listing) return undefined;
  if (listing['course.times_summary'] === 'TBA') return 'TBA';
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let times_by_day = [];
  days.forEach((day) => {
    if (!listing[`course.times_by_day.${day}`])
      times_by_day.push(['', '', '', '']);
    else times_by_day.push(listing[`course.times_by_day.${day}`][0]);
  });
  return times_by_day;
};

export const checkConflict = (listings, course, times) => {
  for (let i = 0; i < listings.length; i++) {
    if (listings[i].season_code !== course.season_code) continue;
    const listing = listings[i];
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (let day = 0; day < 5; day++) {
      const info = listing['course.times_by_day.' + [weekdays[day]]];
      if (info === undefined) continue;
      let listing_start = moment(info[0][0], 'HH:mm');
      let listing_end = moment(info[0][1], 'HH:mm');
      if (listing_start.hour() < 8) listing_start.add(12, 'h');
      if (listing_end.hour() < 8) listing_end.add(12, 'h');
      if (times[day][0] === '') continue;
      let cur_start = moment(times[day][0], 'HH:mm');
      let cur_end = moment(times[day][1], 'HH:mm');
      if (!(listing_start > cur_end || cur_start > listing_end)) {
        return true;
      }
    }
  }
  return false;
};

export const scrollToTop = (event) => {
  const newPage =
    event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;

  if (!newPage) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
};

export const fbFriendsAlsoTaking = (season_code, crn, worksheets, names) => {
  let also_taking = [];
  console.log([season_code, crn]);
  for (let friend in worksheets) {
    if (
      worksheets[friend].find((value, index, array) => {
        console.log(value);
        return value[0] === season_code && parseInt(value[1]) === crn;
      })
    )
      also_taking.push(names[friend].name);
  }
  return also_taking;
};
