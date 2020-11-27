import gql from 'graphql-tag';

// TODO: move these to a .graphql file and use this
// https://github.com/apollographql/graphql-tag#importing-graphql-files
// export const GET_SEASON_CODES = gql`
//   query GetSeasonCodes {
//     # it's a lucky coincidence that
//     # 'spring', 'summer', and 'fall' are
//     # in alphabetical order
//     seasons(order_by: { year: desc, season_code: desc }) {
//       season_code
//       term
//       year
//     }
//   }
// `;

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
      course {
        evaluation_statistics {
          avg_workload
          avg_rating
        }
      }
      all_course_codes
      areas
      average_gut_rating
      average_professor
      average_rating
      average_workload
      classnotes
      course_code
      credits
      crn
      description
      enrolled
      extra_info
      final_exam
      flag_info
      fysem
      last_enrollment
      last_enrollment_same_professors
      listing_id
      locations_summary
      number
      professor_info
      professor_names
      regnotes
      requirements
      rp_attr
      school
      season_code
      section
      skills
      subject
      syllabus_url
      times_by_day
      times_summary
      title
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
