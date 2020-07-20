import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { flatten } from '../utilities';

const GET_COURSE_MODAL = gql`
  query fetch_course($crn: Int, $season_code: String) {
    listings(
      where: { crn: { _eq: $crn }, season_code: { _eq: $season_code } }
    ) {
      course_code
      crn
      season_code
      section
      course {
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
  }
`;

function preprocess_courses(listing) {
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
      .map(x => {
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
}

const GetCourseModal = () => {
  var [executeGetCourseModal, { called, loading, data }] = useLazyQuery(
    GET_COURSE_MODAL
  );

  if (called && !loading) {
    data = data.listings.map(x => {
      return flatten(x);
    });

    data = data.map(x => {
      return preprocess_courses(x);
    });
  }

  return { executeGetCourseModal, called, loading, data };
};

export default GetCourseModal;
