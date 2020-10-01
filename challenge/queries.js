import gql from 'graphql-tag';

import { NUM_CHALLENGE_COURSES, VALID_QUESTION_CODES } from './constants.js';

// query for selecting courses to test
export const requestEvalsQuery = gql`
	query($season: String, $minRating: float8) {
		evaluation_ratings(
			limit: ${NUM_CHALLENGE_COURSES}
			where: {
				course: { season_code: { _eq: $season }, average_rating: {_gt: $minRating} }
				question_code: { _in: ${JSON.stringify(VALID_QUESTION_CODES)} }
				rating: { _is_null: false }
			}
			order_by: {course: {average_rating: asc}}
		) {
			rating
			course {
				season_code
				title
				listings {
					crn
					course_code
				}
			}
			id
			evaluation_question {
		    	question_text
		    }
		}
	}
`;

// query for retrieving course enrollment data again
export const verifyEvalsQuery = gql`
	query($questionIds: [Int!]) {
		evaluation_ratings(where: { id: { _in: $questionIds } }) {
			id
			rating
		}
	}
`;
