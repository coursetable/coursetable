export const GRAPHQL_ENDPOINT = 'http://graphql-engine:8080/v1/graphql';
export const PORT = 4096;

export const CHALLENGE_ALGORITHM = 'aes-256-ctr';
export const CHALLENGE_PASSWORD =
	process.env.CHALLENGE_PASSWORD || 'thisisapassword';

export const NUM_CHALLENGE_COURSES = 3;
export const CHALLENGE_SEASON = '201903';

export const VALID_QUESTION_CODES = ['YC006', 'YC306', 'YC404'];
