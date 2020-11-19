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

export const SEARCH_AVERAGE_ACROSS_SEASONS = gql`
  query SearchAverageAcrossSeasons(
    $course_code: String
    $professor_name: [String!]
  ) {
    computed_listing_info(
      where: {
        _or: [
          { course_code: { _eq: $course_code } }
          { professor_names: { _has_keys_any: $professor_name } }
        ]
      }
    ) {
      listing_id
      description
      average_professor
      average_gut_rating
      times_summary
      times_by_day
      locations_summary
      credits
      subject
      number
      school
      requirements
      extra_info
      syllabus_url
      flag_info
      regnotes
      rp_attr
      classnotes
      final_exam
      fysem
      professor_names
      professor_info
      season_code
      all_course_codes
      section
      crn
      enrolled
      last_enrollment
      last_enrollment_same_professors
      average_rating
      average_workload
      course_code
      title
      skills
      areas
      course {
        evaluation_statistics {
          avg_workload
          avg_rating
        }
      }
    }
  }
`;

export const SEARCH_EVALUATION_NARRATIVES = gql`
  query SearchEvaluationNarratives($season_code: String, $course_code: String) {
    computed_listing_info(
      where: {
        season_code: { _eq: $season_code }
        course_code: { _eq: $course_code }
      }
    ) {
      crn
      course {
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
