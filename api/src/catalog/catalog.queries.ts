/**
 * @file Queries for updating static catalog files.
 */

import gql from 'graphql-tag';

// Query for getting catalog data by season
export const listSeasonsQuery = gql`
  query listSeasons($season: [String!]) {
    seasons {
      season_code
      term
      year
    }
  }
`;

// Query for data that needs eval access
export const evalsBySeasonQuery = gql`
  query evalsBySeason($season: String!) {
    computed_listing_info(where: { season_code: { _eq: $season } }) {
      average_gut_rating
      average_professor
      average_rating
      average_workload
      average_rating_same_professors
      average_workload_same_professors
      crn
      enrolled
      last_enrollment
      last_enrollment_same_professors
    }
  }
`;

// Query for publicly available catalog data
export const catalogBySeasonQuery = gql`
  query catalogBySeason($season: String!) {
    computed_listing_info(where: { season_code: { _eq: $season } }) {
      all_course_codes
      areas
      classnotes
      course_code
      credits
      crn
      description
      extra_info
      final_exam
      flag_info
      fysem
      listing_id
      locations_summary
      number
      professor_ids
      professor_names
      regnotes
      requirements
      rp_attr
      same_course_id
      same_course_and_profs_id
      last_offered_course_id
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
