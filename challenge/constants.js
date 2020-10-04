export const GRAPHQL_ENDPOINT = 'http://graphql-engine:8080/v1/graphql';
export const PORT = 4096;

export const CHALLENGE_ALGORITHM = 'aes-256-ctr';
export const CHALLENGE_PASSWORD =
	process.env.CHALLENGE_PASSWORD || 'thisisapassword';

export const NUM_CHALLENGE_COURSES = 3; // number of courses to select for the challenge
export const CHALLENGE_SEASON = '201903'; // season to select the challenge from

// question codes to be used
// currently question codes with a 'rating' tag
// https://github.com/coursetable/ferry/blob/master/resources/question_tags.csv
export const VALID_QUESTION_CODES = [
	'MG008',
	'YC006',
	'GS008',
	'YC404',
	'YC306',
	'GS404',
	'PH002',
	'FS1009',
	'SU104',
];
