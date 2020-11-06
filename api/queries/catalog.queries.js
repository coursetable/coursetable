import gql from 'graphql-tag';

// query for getting catalog data by season
export const listSeasonsQuery = gql`
  query listSeasons($season: [String!]) {
    seasons {
      season_code
      term
      year
    }
  }
`;

// query for getting catalog data by season
export const catalogBySeasonQuery = gql`
  query catalogBySeason($season: String!) {
    computed_listing_info(where: { season_code: { _eq: $season } }) {
      listing_id
      title
      description
      all_course_codes
      professor_names
      average_rating
      average_workload
      average_professor
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
      extra_info
      syllabus_url
      section
      crn
      enrolled
      last_enrollment
      last_enrollment_same_professors
      flag_info
      regnotes
      rp_attr
      classnotes
      final_exam
    }
  }
`;
