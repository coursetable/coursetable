import gql from 'graphql-tag';

export const GET_SEASON_CODES = gql`
  query GetSeasonCodes {
    # it's a lucky coincidence that
    # 'spring', 'summer', and 'fall' are
    # in alphabetical order
    seasons(order_by: { year: desc, season_code: desc }) {
      season_code
      term
      year
    }
  }
`;

export const SEARCH_COURSES = gql`
  query SearchCourses(
    $search_text: String
    $ordering: [computed_course_info_order_by!]
    $seasons: [String!]
    $schools: [String!]
    $areas: [String!]
    $credits: [float8!]
    $skills: [String!]
    $min_rating: float8
    $max_rating: float8
    $min_workload: float8
    $max_workload: float8
  ) {
    search_course_info(
      args: { query: $search_text }
      where: {
        season_code: { _in: $seasons }
        _or: {
          areas: { _has_keys_any: $areas }
          skills: { _has_keys_any: $skills }
        }
        average_rating: { _gte: $min_rating, _lte: $max_rating }
        average_workload: { _gte: $min_workload, _lte: $max_workload }
        credits: { _in: $credits }
        school: { _in: $schools }
      }
      order_by: $ordering
      limit: 100
    ) {
      course_id
      title
      description
      professor_names
      average_rating
      average_workload
      title
      times_summary
      locations_summary
      skills
      areas
      credits
      course_codes
      school
      requirements
      season_code
      course {
        listings {
          crn
        }
      }
    }
  }
`;

export const SEARCH_COURSES_TEXTLESS = gql`
  query SearchCoursesTextless(
    $ordering: [computed_course_info_order_by!]
    $seasons: [String!]
    $schools: [String!]
    $areas: [String!]
    $credits: [float8!]
    $skills: [String!]
    $min_rating: float8
    $max_rating: float8
    $min_workload: float8
    $max_workload: float8
  ) {
    computed_course_info(
      where: {
        season_code: { _in: $seasons }
        _or: {
          areas: { _has_keys_any: $areas }
          skills: { _has_keys_any: $skills }
        }
        average_rating: { _gte: $min_rating, _lte: $max_rating }
        average_workload: { _gte: $min_workload, _lte: $max_workload }
        credits: { _in: $credits }
        school: { _in: $schools }
      }
      order_by: $ordering
      limit: 100
    ) {
      course_id
      title
      description
      professor_names
      average_rating
      average_workload
      title
      times_summary
      locations_summary
      skills
      areas
      credits
      course_codes
      school
      requirements
      season_code
      course {
        listings {
          crn
        }
      }
    }
  }
`;

export const SEARCH_AVERAGE_ACROSS_SEASONS = gql`
  query SearchAverageAcrossSeasons($course_code: String) {
    computed_course_info(where: { course_codes: { _has_key: $course_code } }) {
      average_rating
      average_workload
      season_code
    }
  }
`;
