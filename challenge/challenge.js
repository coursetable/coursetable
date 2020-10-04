import express from 'express';
import bodyParser from 'body-parser';

import morgan from 'morgan';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

import graphqurl from 'graphqurl';
const { query } = graphqurl;

// Enable request logging.
app.use(morgan('tiny'));

import { PORT, GRAPHQL_ENDPOINT, CHALLENGE_SEASON } from './constants.js';

import { requestEvalsQuery, verifyEvalsQuery } from './queries.js';

import { constructChallenge, verifyChallenge, decrypt } from './utils.js';

/**
 * Generates and returns a user challenge.
 * @prop req - request object
 * @prop res - return object
 */
app.get('/challenge/request', (req, res) => {
	// get authentication headers
	const netid = req.header('x-coursetable-netid'); // user's NetID
	const authd = req.header('x-coursetable-authd'); // if user is logged in

	// require NetID authentication
	if (authd !== 'true') {
		res.status(400).send({
			error: 'NOT_AUTHENTICATED',
		});
	}

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

/**
 * Verifies answers to a challenge.
 * @prop req - request object
 * @prop res - return object
 */
app.post('/challenge/verify', (req, res) => {
	// get authentication headers
	const netid = req.header('x-coursetable-netid'); // user's NetID
	const authd = req.header('x-coursetable-authd'); // if user is logged in

	// require NetID authentication
	if (authd !== 'true') {
		res.status(400).send({
			error: 'NOT_AUTHENTICATED',
		});
	}

	let { token, salt, answers } = req.body;

	let secrets; // the decrypted token

	let secretRatingIds; // for retrieving the correct ones from the database

	// list in the format "<question_id>_<rating_index>" to verify
	// the submitted answers match those encoded in the token
	let secretRatings;
	let answerRatings;

	// catch malformed token decryption errors
	try {
		secrets = JSON.parse(decrypt(token, salt));
		secretRatingIds = secrets.map(x => x['courseRatingId']);
		secretRatings = secrets.map(
			x => `${x['courseRatingId']}_${x['courseRatingIndex']}`
		);
	} catch (e) {
		res.status(400).send({
			error: 'INVALID_TOKEN',
		});
	}

	// catch malformed answer JSON errors
	try {
		answerRatings = answers.map(
			x => `${x['courseRatingId']}_${x['courseRatingIndex']}`
		);
	} catch (e) {
		res.status(400).send({
			error: 'MALFORMED_ANSWERS',
		});
	}

	// make sure the provided ratings IDs and indices match those we have
	if (secretRatings.sort().join(',') !== answerRatings.sort().join(',')) {
		res.status(400).send({
			error: 'INVALID_TOKEN',
		});
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

app.listen(PORT, () => {
	console.log(`Challenge API listening at http://localhost:${PORT}`);
});
