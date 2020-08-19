import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { flatten } from '../utilities';

const buildQuery = (worksheet) => {
  let listings = '';
  for (let i = 0; i < worksheet.length; i++) {
    const season_code = worksheet[i][0];
    const crn = worksheet[i][1];
    listings += `{ season_code: { _eq: "${season_code}" }, crn: { _eq: ${crn} }},`;
  }
  return `query fetch_course {
    listings(where: {_or: [${listings}]}) {
      course_code
      crn
      season_code
      section
      course {
        average_rating
        average_workload
        course_professors {
          professor {
            name
            average_rating
          }
        }
        computed_course_infos {
          course_codes
        }
        location_times
        locations_summary
        syllabus_url
        skills
        areas
        evaluation_statistics {
          avg_rating
          avg_workload
          enrollment
        }
        short_title
        title
        times_summary
        times_by_day
        description
      }
    }
  }`;
};

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

export const FetchWorksheet = (worksheet) => {
  const builtQuery = buildQuery(worksheet);
  var { loading, error, data } = useQuery(gql(builtQuery));

  if (!(loading || error)) {
    data = data.listings.map((x) => {
      return flatten(x);
    });

    data = data.map((x) => {
      return preprocess_courses(x);
    });
  }

  return { loading, error, data };
};

export const FetchWorksheetLazy = (worksheet, season_code) => {
  let filtered_worksheet = [];
  worksheet.forEach((course) => {
    if (course[0] === season_code) filtered_worksheet.push(course);
  });
  const builtQuery = buildQuery(filtered_worksheet);
  const [fetchWorksheetListings, { loading, data }] = useLazyQuery(
    gql(builtQuery)
  );
  return [fetchWorksheetListings, { loading, data }];
};
