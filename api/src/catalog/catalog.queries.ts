import _gql from 'graphql-tag';

// TODO: https://arethetypeswrong.github.io/?p=graphql-tag%402.12.6
const gql = _gql as unknown as typeof import('graphql-tag').default;

export const listSeasonsQuery = gql`
  query listSeasons {
    seasons {
      season_code
    }
  }
`;

// Query for data that needs eval access
export const evalsBySeasonQuery = gql`
  query evalsBySeason($season: String!) {
    listings(where: { season_code: { _eq: $season } }) {
      course {
        average_gut_rating
        average_rating
        average_rating_same_professors
        # TODO
        average_professor_rating
        average_workload
        average_workload_same_professors
        evaluation_statistic {
          enrolled
        }
        last_enrollment
        last_enrollment_same_professors
      }
      crn
    }
  }
`;

// Query for publicly available catalog data
export const catalogBySeasonQuery = gql`
  query catalogBySeason($season: String!) {
    listings(where: { season_code: { _eq: $season } }) {
      course {
        areas
        classnotes
        colsem
        course_flags {
          flag {
            flag_text
          }
        }
        course_professors {
          professor {
            professor_id
            name
          }
        }
        credits
        description
        extra_info
        final_exam
        fysem
        last_offered_course_id
        listings {
          crn
          course_code
        }
        locations_summary
        regnotes
        requirements
        rp_attr
        same_course_and_profs_id
        same_course_id
        skills
        syllabus_url
        sysem
        times_by_day
        times_summary
        title
      }
      course_code
      crn
      listing_id
      number
      school
      season_code
      section
      subject
    }
  }
`;

export const courseAttributesQuery = gql`
  query courseAttributes {
    flags {
      flag_text
    }
  }
`;
