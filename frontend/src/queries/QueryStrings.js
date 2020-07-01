import gql from 'graphql-tag';

export const SEARCH_COURSES = gql`
	query SearchCourses($search_text: String, $seasons: [String!]) {
		search_courses(
			args: { query: $search_text }
			where: { season_code: { _in: $seasons } }
			order_by: {}
			limit: 5
		) {
			title
			description
			course_professors {
				professor {
					name
					average_rating
				}
			}
			short_title
			title
			times_summary
			location_times
			locations_summary
			skills
			areas
			listings {
				course_code
			}
			season_code
			historical_ratings {
				course_rating_all_profs
				course_rating_this_prof
				course_workload
			}
		}
	}
`;