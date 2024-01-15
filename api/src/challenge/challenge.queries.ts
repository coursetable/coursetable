import _gql from 'graphql-tag';

import { NUM_CHALLENGE_COURSES } from '../config.js';

// TODO: https://arethetypeswrong.github.io/?p=graphql-tag%402.12.6
const gql = _gql as unknown as typeof import('graphql-tag').default;

// Query for selecting courses to test
export const requestEvalsQuery = gql`
  query($season: String, $minRating: float8) {
    evaluation_ratings(
      limit: ${NUM_CHALLENGE_COURSES}
      where: {
        course: { season_code: { _eq: $season }, average_rating: {_gt: $minRating} }
        evaluation_question: {tag: {_eq: "rating"}}
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

export interface RequestEvalsQueryResponse {
  evaluation_ratings: {
    rating: number[];
    course: {
      season_code: number;
      title: string;
      listings: {
        crn: number;
        course_code: string;
      }[];
    };
    id: number;
    evaluation_question: {
      question_text: string;
    };
  }[];
}

// Query for retrieving course enrollment data again
export const verifyEvalsQuery = gql`
  query ($questionIds: [Int!]) {
    evaluation_ratings(where: { id: { _in: $questionIds } }) {
      id
      rating
    }
  }
`;

export interface VerifyEvalsQueryResponse {
  evaluation_ratings: {
    id: number;
    rating: number[];
  }[];
}
