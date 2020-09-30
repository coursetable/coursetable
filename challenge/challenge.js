const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');
const axios = require('axios').default;

const app = express();
const port = 4096;

const gql = require('graphql-tag');
const { query } = require('graphqurl');

const crypto = require('crypto');
const CHALLENGE_ALGORITHM = 'aes-256-ctr';
const CHALLENGE_PASSWORD = process.env.CHALLENGE_PASSWORD || 'thisisapassword';

function encrypt(text, salt) {
	var cipher = crypto.createCipher(
		CHALLENGE_ALGORITHM,
		CHALLENGE_PASSWORD + salt
	);
	var crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(text, salt) {
	var decipher = crypto.createDecipher(
		CHALLENGE_ALGORITHM,
		CHALLENGE_PASSWORD + salt
	);
	var dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

function constructChallenge(queryResponse) {
	const course_enrollments = queryResponse['data']['evaluation_statistics'].map(
		x => x['enrollment']['enrolled']
	);
	const course_ids = queryResponse['data']['evaluation_statistics'].map(
		x => x['course_id']
	);

	const secrets = {
		course_enrollments: course_enrollments,
		course_ids: course_ids,
	};
	const salt = crypto.randomBytes(16).toString('hex');
	const token = encrypt(JSON.stringify(secrets), salt);

	const course_titles = queryResponse['data']['evaluation_statistics'].map(
		x => x['course']['title']
	);

	const oce_urls = queryResponse['data']['evaluation_statistics'].map(x => {
		const crn = x['course']['listings'][0]['crn'];
		const season = x['course']['season_code'];

		const oce_url = `https://oce.app.yale.edu/oce-viewer/studentSummary/index?crn=${crn}&term_code=${season}`;

		return oce_url;
	});

	return {
		token: token,
		salt: salt,
		course_titles: course_titles,
		oce_urls: oce_urls,
	};
}

// Enable request logging.
app.use(morgan('tiny'));

const getEvalsQuery = gql`
	query($season: String, $minRating: float8) {
		evaluation_statistics(
			limit: 3
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

app.get('/challenge', (req, res) => {
	const minRating = 1 + Math.random() * 4;

	query({
		query: getEvalsQuery,
		endpoint: 'http://graphql-engine:8080/v1/graphql',
		variables: {
			season: '201903',
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

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
