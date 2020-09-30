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

// Enable request logging.
app.use(morgan('tiny'));

// query for selecting courses to test
const requestEvalsQuery = gql`
	query($season: String, $minRating: float8) {
		evaluation_statistics(
			limit: ${NUM_CHALLENGE_COURSES}
			where: {
				course: { season_code: { _eq: $season } }
				avg_rating: { _gte: $minRating }
				enrollment: { _is_null: false }
			}
			order_by: { avg_rating: asc }
		) {
			course_id
			enrollment
			course {
				season_code
				title
				listings {
					crn
					course_code
				}
			}
		}
	}
`;

// query for retrieving course enrollment data again
const verifyEvalsQuery = gql`
	query($course_ids: [Int!]) {
		evaluation_statistics(where: { course_id: { _in: $course_ids } }) {
			course_id
			enrollment
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

function constructChallenge(response) {
	// array of course enrollment counts
	const course_enrollments = response['data']['evaluation_statistics'].map(
		x => x['enrollment']['enrolled']
	);

	// array of CourseTable course IDs
	const course_ids = response['data']['evaluation_statistics'].map(
		x => x['course_id']
	);

	// construct token object
	const secrets = course_enrollments.map((x, index) => {
		return {
			course_id: course_ids[index],
		};
	});
	// encrypt token
	const salt = crypto.randomBytes(16).toString('hex');
	const token = encrypt(JSON.stringify(secrets), salt);

	// course titles for user's benefit
	const course_titles = response['data']['evaluation_statistics'].map(
		x => x['course']['title']
	);

	// Yale OCE urls for user to retrieve answers
	const oce_urls = response['data']['evaluation_statistics'].map(x => {
		const crn = x['course']['listings'][0]['crn'];
		const season = x['course']['season_code'];

		const oce_url = `https://oce.app.yale.edu/oce-viewer/studentSummary/index?crn=${crn}&term_code=${season}`;

		return oce_url;
	});

	// merged course information object
	const course_info = course_titles.map((x, index) => {
		return {
			course_title: x,
			course_id: course_ids[index],
			course_oce_url: oce_urls[index],
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
	const truth = response['data']['evaluation_statistics'];

	// course_id:answer mapping for easier checking
	let truthPairs = {};
	let answerPairs = {};

	// populate truthPairs
	truth.forEach(x => {
		truthPairs[x['course_id']] = x['enrollment']['enrolled'];
	});

	// populate answerPairs
	answers.forEach(x => {
		answerPairs[x['course_id']] = x['answer'];
	});

	// compare keys again just to be sure courses match
	truthKeys = Object.keys(truthPairs);
	answerKeys = Object.keys(answerPairs);

	if (truthKeys.sort().join(',') !== answerKeys.sort().join(',')) {
		return 'INVALID_TOKEN';
	}

	// compare answers
	for (const key of truthKeys) {
		if (truthPairs[key] !== answerPairs[key]) {
			return 'INCORRECT';
		}
	}

	return 'CORRECT';
}

app.post('/challenge/verify', (req, res) => {
	let { token, salt, answers } = req.body;

	let secrets; // the decrypted token
	let secret_course_ids;
	let answer_course_ids;

	try {
		secrets = JSON.parse(decrypt(token, salt));
		secret_course_ids = secrets.map(x => x['course_id']);
	} catch (e) {
		res.json({ body: 'INVALID_TOKEN' });
	}

	try {
		answers = JSON.parse(answers);
		answer_course_ids = answers.map(x => x['course_id']);
	} catch (e) {
		res.json({ body: 'INVALID_ANSWERS' });
	}

	// make sure the provided course IDs match those we have
	if (
		secret_course_ids.sort().join(',') !== answer_course_ids.sort().join(',')
	) {
		res.json({ body: 'INVALID_TOKEN' });
	}

	query({
		query: verifyEvalsQuery,
		endpoint: GRAPHQL_ENDPOINT,
		variables: {
			course_ids: secret_course_ids,
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
