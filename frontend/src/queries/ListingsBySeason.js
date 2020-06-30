import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import flatten from '../utilities';

const QUERY_LISTINGS = gql`
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

const QUERY_LISTINGS_WITH_EVALS = gql`
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
				evaluation_statistics {
					avg_rating
					avg_workload
					enrollment
				}
			}
		}
	}
`;

function preprocess_courses(listing) {
	const RATINGS_PRECISION = 1;

	if ('course.skills' in listing) {
		listing['skills'] = listing['course.skills'].join(' ');
	}

	if ('course.areas' in listing) {
		listing['areas'] = listing['course.areas'].join(' ');
	}

	if ('course.evaluation_statistics' in listing) {
		const ratings = listing['course.evaluation_statistics'];

		if (ratings.length === 1) {
			const rating = ratings[0];

			if ('avg_rating' in rating && rating['avg_rating'] !== null) {
				listing['avg_rating'] = rating['avg_rating'].toFixed(RATINGS_PRECISION);
			}

			if ('avg_workload' in rating && rating['avg_workload'] !== null) {
				listing['avg_workload'] = rating['avg_workload'].toFixed(
					RATINGS_PRECISION
				);
			}

			if ('enrollment' in rating) {
				if ('enrolled' in rating['enrollment']) {
					listing['enrolled'] = rating['enrollment']['enrolled'];
				}
			}
		}
	}

	if (
		'course.course_professors' in listing &&
		listing['course.course_professors'].length > 0
	) {
		
		listing['professors'] = listing['course.course_professors']
			.map(x => {
				return x['professor']['name'];
			})
			.join(', ');

		const professor = listing['course.course_professors'][0]['professor'];

		if ('average_rating' in professor && professor['average_rating'] !== null) {
			listing['professor_avg_rating'] = professor['average_rating'].toFixed(
				RATINGS_PRECISION
			);
		}
	}

	return listing;
}

const FetchListings = season => {
	var { loading, error, data } = useQuery(QUERY_LISTINGS_WITH_EVALS, {
		variables: { season: season },
	});

	if (!(loading || error)) {
		data = data.listings.map(x => {
			return flatten(x);
		});

		data = data.map(x => {
			return preprocess_courses(x);
		});
	}

	return { loading, error, data };
};

export default FetchListings;
