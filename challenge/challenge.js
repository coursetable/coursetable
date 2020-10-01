const express = require('express');
const bodyParser = require('body-parser');

const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');
const axios = require('axios').default;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 4096;

const gql = require('graphql-tag');
const { query } = require('graphqurl');
const GRAPHQL_ENDPOINT = 'http://graphql-engine:8080/v1/graphql';

const crypto = require('crypto');
const CHALLENGE_ALGORITHM = 'aes-256-ctr';
const CHALLENGE_PASSWORD = process.env.CHALLENGE_PASSWORD || 'thisisapassword';

const NUM_CHALLENGE_COURSES = 3;
const CHALLENGE_SEASON = '201903';

const VALID_QUESTION_CODES = ['YC006', 'YC306', 'YC404'];

// Enable request logging.
app.use(morgan('tiny'));

// query for selecting courses to test
const requestEvalsQuery = gql`
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
const verifyEvalsQuery = gql`
	query($questionIds: [Int!]) {
		evaluation_ratings(where: { id: { _in: $questionIds } }) {
			id
			rating
		}
	}
`;

// encrypt a string with a salt )used to fix the challenge fields)
function encrypt(text, salt) {
	var cipher = crypto.createCipher(
		CHALLENGE_ALGORITHM,
		CHALLENGE_PASSWORD + salt
	);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

// decrypt a salted string
function decrypt(text, salt) {
	var decipher = crypto.createDecipher(
		CHALLENGE_ALGORITHM,
		CHALLENGE_PASSWORD + salt
	);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function constructChallenge(response) {
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

app.get('/challenge/request', (req, res) => {
	// randomize the selected challenge courses by
	// randomly choosing a minimum rating
	const minRating = 1 + Math.random() * 4;

	query({
		query: requestEvalsQuery,
		endpoint: GRAPHQL_ENDPOINT,
		variables: {
			season: CHALLENGE_SEASON,
			minRating: minRating,
		},
	})
		.then(response => {
			res.json({ body: constructChallenge(response) });
		})
		.catch(error => {
			res.json({ body: error });
		});
});

function verifyChallenge(response, answers) {
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

app.post('/challenge/verify', (req, res) => {
	let { token, salt, answers } = req.body;

	let secrets; // the decrypted token

	let secretRatingIds;
	let secretRatings;

	let answerRatings;

	try {
		secrets = JSON.parse(decrypt(token, salt));
		secretRatingIds = secrets.map(x => x['courseRatingId']);
		secretRatings = secrets.map(
			x => `${x['courseRatingId']}_${x['courseRatingIndex']}`
		);
	} catch (e) {
		res.json({ body: 'INVALID_TOKEN' });
	}

	try {
		answers = JSON.parse(answers);
		answerRatings = answers.map(
			x => `${x['courseRatingId']}_${x['courseRatingIndex']}`
		);
	} catch (e) {
		res.json({ body: 'INVALID_ANSWERS' });
	}

	// make sure the provided ratings IDs and indices match those we have
	if (secretRatings.sort().join(',') !== answerRatings.sort().join(',')) {
		res.json({ body: 'INVALID_TOKEN' });
	}

	query({
		query: verifyEvalsQuery,
		endpoint: GRAPHQL_ENDPOINT,
		variables: {
			questionIds: secretRatingIds,
		},
	})
		.then(response => {
			res.json({ body: verifyChallenge(response, answers) });
		})
		.catch(error => {
			res.json({ body: error });
		});
});

app.listen(port, () => {
	console.log(`Challenge API listening at http://localhost:${port}`);
});
