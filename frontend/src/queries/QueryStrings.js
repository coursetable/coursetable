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
    $ordering: [computed_listing_info_order_by!]
    $offset: Int
    $limit: Int
    $seasons: [String!]
    $schools: [String!]
    $areas: [String!]
    $credits: [float8!]
    $skills: [String!]
    $min_rating: float8
    $max_rating: float8
    $min_workload: float8
    $max_workload: float8
    $extra_info: String
  ) {
    search_listing_info(
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
        course: { extra_info: { _eq: $extra_info } }
      }
      order_by: $ordering
      limit: $limit
      offset: $offset
    ) {
      listing_id
      title
      description
      professor_names
      average_rating
      average_workload
      times_summary
      times_by_day
      locations_summary
      skills
      areas
      credits
      course_code
      school
      requirements
      season_code
      course {
        extra_info
        course_professors {
          professor {
            name
            average_rating
          }
        }
      }
      listing {
        crn
      }
    }
  }
`;

export const GET_COURSE_MODAL = gql`
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
        requirements
      }
    }
  }
`;

export const SEARCH_AVERAGE_ACROSS_SEASONS = gql`
  query SearchAverageAcrossSeasons(
    $course_code: String
    $professor_name: String
  ) {
    computed_course_info(
      where: {
        _or: [
          { course_codes: { _has_key: $course_code } }
          { professor_names: { _has_key: $professor_name } }
        ]
      }
    ) {
      professor_names
      season_code
      course_codes
      course {
        evaluation_statistics {
          avg_rating
          avg_workload
          enrollment
        }
        course_professors {
          professor {
            average_rating
          }
        }
        listings {
          section
          crn
          course_code
        }
      }
    }
  }
`;

export const SEARCH_EVALUATION_NARRATIVES = gql`
  query SearchEvaluationNarratives($season_code: String, $course_code: String) {
    computed_course_info(
      where: {
        season_code: { _eq: $season_code }
        course_codes: { _has_key: $course_code }
      }
    ) {
      course {
        listings {
          section
          crn
        }
        evaluation_narratives_aggregate {
          nodes {
            comment
            evaluation_question {
              question_text
            }
          }
        }
        evaluation_ratings {
          rating
          evaluation_question {
            question_text
          }
        }
      }
    }
  }
`;
