import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const LIST_COURSES = gql`
	query list_courses($season: String) {
		listings(where: { season_code: { _eq: $season } }) {
			course_code
			course_id
			crn
			listing_id
			number
			season_code
			section
			subject
			course {
				course_professors {
					professor {
						name
					}
				}
				short_title
				title
				times_summary
				location_times
				locations_summary
				skills
				areas
			}
		}
	}
`;

const FetchListings = (season) => {
	const { loading, error, data } = useQuery(
		LIST_COURSES,
		{variables: { season: season }}
	);

	return { loading, error, data };
};

export default FetchListings;
