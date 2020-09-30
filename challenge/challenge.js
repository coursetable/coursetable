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

app.get('/challenge', (req, res) => {
	query({
		query: testQuery,
		endpoint: 'http://graphql-engine:8080/v1/graphql',
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
