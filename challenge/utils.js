import crypto from 'crypto';

import { CHALLENGE_ALGORITHM, CHALLENGE_PASSWORD } from './constants.js';

// encrypt a string with a salt )used to fix the challenge fields)
export function encrypt(text, salt) {
	var cipher = crypto.createCipher(
		CHALLENGE_ALGORITHM,
		CHALLENGE_PASSWORD + salt
	);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

// decrypt a salted string
export function decrypt(text, salt) {
	var decipher = crypto.createDecipher(
		CHALLENGE_ALGORITHM,
		CHALLENGE_PASSWORD + salt
	);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

// get a random integer between 0 and max-1
export function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

export function constructChallenge(response) {
	// array of course enrollment counts
	let ratingIndices = new Array();

	for (const evaluation_rating of response['data']['evaluation_ratings']) {
		const ratingIndex = getRandomInt(5);

		if (!Number.isInteger(evaluation_rating['rating'][ratingIndex])) {
			return 'RATINGS_RETRIEVAL_ERROR';
		}
		ratingIndices.push(ratingIndex);
	}

	// array of CourseTable question IDs
	const ratingIds = response['data']['evaluation_ratings'].map(x => x['id']);

	// construct token object
	const secrets = ratingIds.map((x, index) => {
		return {
			courseRatingId: ratingIds[index],
			courseRatingIndex: ratingIndices[index],
		};
	});

	// encrypt token
	const salt = crypto.randomBytes(16).toString('hex');
	const token = encrypt(JSON.stringify(secrets), salt);

	// course titles and questions for user
	const courseTitles = response['data']['evaluation_ratings'].map(
		x => x['course']['title']
	);
	const courseQuestionTexts = response['data']['evaluation_ratings'].map(
		x => x['evaluation_question']['question_text']
	);

	// Yale OCE urls for user to retrieve answers
	const oceUrls = response['data']['evaluation_ratings'].map(x => {
		const crn = x['course']['listings'][0]['crn'];
		const season = x['course']['season_code'];

		const oceUrl = `https://oce.app.yale.edu/oce-viewer/studentSummary/index?crn=${crn}&term_code=${season}`;

		return oceUrl;
	});

	// merged course information object
	const course_info = courseTitles.map((x, index) => {
		return {
			courseTitle: courseTitles[index],
			courseRatingIndex: ratingIndices[index],
			courseQuestionTexts: courseQuestionTexts[index],
			courseOceUrl: oceUrls[index],
		};
	});

	return {
		token: token,
		salt: salt,
		course_info: course_info,
	};
}

export function verifyChallenge(response, answers) {
	// the true values in CourseTable to compare against
	const truth = response['data']['evaluation_ratings'];

	// mapping from question ID to ratings
	let truthById = {};

	truth.forEach(x => {
		truthById[x['id']] = x['rating'];
	});

	// for each answer, check that it matches our data
	for (const answer of answers) {
		if (
			truthById[answer['courseRatingId']][answer['courseRatingIndex']] !==
			answer['answer']
		) {
			return 'INCORRECT';
		}
	}

	return 'CORRECT';
}
