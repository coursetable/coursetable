import gql from 'graphql-tag';

export const SEARCH_COURSES = gql`
	query SearchCourses(
		$search_text: String
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
					areas: {_has_keys_any: $areas}
					skills: {_has_keys_any: $skills}
				}
				average_rating: { _gte: $min_rating, _lte: $max_rating }
				average_workload: { _gte: $min_workload, _lte: $max_workload }
				credits: { _in: $credits }
				school: { _in: $schools }
			}
			order_by: {}
			limit: 100
		) {
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
		}
	}
`;

export const SEARCH_COURSES_TEXTLESS = gql`
	query SearchCoursesNoText($seasons: [String!], $skills_areas: [json!]) {
		courses(
			where: {
				season_code: { _in: $seasons }
				areas: { _in: $skills_areas }
				skills: { _in: $skills_areas }
			}
			order_by: {}
			limit: 100
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
		}
	}
`;
