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

// Enable request logging.
app.use(morgan('tiny'));

const testQuery = gql`
	query Test {
		courses(limit: 10) {
			title
		}
	}
`;

const getEvalsQuery = gql`
	query($season: String, $minRating: float8) {
		evaluation_statistics(
			limit: 3
			where: {
				course: { season_code: { _eq: $season } }
				avg_rating: { _gte: $minRating }
			}
			order_by: { avg_rating: asc }
		) {
			course_id
			enrollment
			course {
				season_code
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
			res.json({ body: response });
		})
		.catch(error => {
			res.json({ body: error });
		});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
