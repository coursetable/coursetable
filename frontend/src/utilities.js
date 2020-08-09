import { useState, useEffect, useRef } from 'react';

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
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
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
