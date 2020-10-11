import express from 'express';
import bodyParser from 'body-parser';

import morgan from 'morgan';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

import graphqurl from 'graphqurl';
const { query } = graphqurl;

// Enable request logging.
app.use(morgan('tiny'));

import {
  PORT,
  GRAPHQL_ENDPOINT,
  CHALLENGE_SEASON,
  MAX_CHALLENGE_REQUESTS,
} from './constants.js';

import { requestEvalsQuery, verifyEvalsQuery } from './queries.js';

import { constructChallenge, verifyChallenge, decrypt } from './utils.js';

import mysql from 'mysql';
var mysqlConnection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'GoCourseTable',
  database: 'yaleplus',
});

// open the MySQL connection
mysqlConnection.connect(error => {
  if (error) throw error;
  console.log('Successfully connected to the database.');
});

/**
 * Generates and returns a user challenge.
 * @prop req - request object
 * @prop res - return object
 */
app.get('/api/challenge/request', (req, res) => {
  // get authentication headers
  const netid = req.header('x-coursetable-netid'); // user's NetID
  const authd = req.header('x-coursetable-authd'); // if user is logged in

  // require NetID authentication
  if (authd !== 'true') {
    res.status(401).send({
      error: 'NOT_AUTHENTICATED',
    });
    return;
  }

  // use mysql.escape() to prevent injection attacks
  mysqlConnection.query(
    `SELECT challengeTries,evaluationsEnabled FROM StudentBluebookSettings WHERE netid=${mysql.escape(
      netid
    )} LIMIT 1`,
    (error, results, fields) => {
      // catch general query errors
      if (error) {
        console.error(error.message);
        res.status(500).send({
          error: 'INTERNAL_ERROR',
        });
        return;
      }

      // affirm single user retrieved
      if (results.length !== 1) {
        res.status(401).send({
          error: 'USER_NOT_FOUND',
        });
        return;
      }

      const challengeTries = results[0]['challengeTries'];
      const evaluationsEnabled = results[0]['evaluationsEnabled'];

      if (evaluationsEnabled === 1) {
        res.status(200).send({
          error: 'ALREADY_ENABLED',
        });
        return;
      }
      // limit number of challenge requests
      if (challengeTries >= MAX_CHALLENGE_REQUESTS) {
        res.status(429).send({
          error: 'MAX_TRIES_REACHED',
        });
        return;
      }

      // update number of tries
      mysqlConnection.query(
        `UPDATE StudentBluebookSettings SET challengeTries=${challengeTries +
          1} WHERE netid=${mysql.escape(netid)}`,
        (error, results, fields) => {
          // catch general query errors
          if (error) {
            console.error(error.message);
            res.status(500).send({
              error: 'INTERNAL_ERROR',
            });
            return;
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
              res.json({
                body: constructChallenge(response),
                challengeTries: challengeTries + 1,
              });
            })
            .catch(error => {
              res.json({ body: error, challengeTries: challengeTries + 1 });
            });
        }
      );
    }
  );
});

/**
 * Verifies answers to a challenge.
 * @prop req - request object
 * @prop res - return object
 */
app.post('/api/challenge/verify', (req, res) => {
  // get authentication headers
  const netid = req.header('x-coursetable-netid'); // user's NetID
  const authd = req.header('x-coursetable-authd'); // if user is logged in

  // require NetID authentication
  if (authd !== 'true') {
    res.status(401).send({
      error: 'NOT_AUTHENTICATED',
    });
  }

  mysqlConnection.query(
    `SELECT challengeTries,evaluationsEnabled FROM StudentBluebookSettings WHERE netid=${mysql.escape(
      netid
    )} LIMIT 1`,
    (error, results, fields) => {
      // catch general query errors
      if (error) {
        console.error(error.message);
        res.status(500).send({
          error: 'INTERNAL_ERROR',
        });
        return;
      }

      // affirm single user retrieved
      if (results.length !== 1) {
        res.status(401).send({
          error: 'USER_NOT_FOUND',
        });
        return;
      }

      const challengeTries = results[0]['challengeTries'];
      const evaluationsEnabled = results[0]['evaluationsEnabled'];

      if (evaluationsEnabled === 1) {
        res.status(200).send({
          error: 'ALREADY_ENABLED',
        });
        return;
      }

      // limit number of challenge requests
      if (challengeTries >= MAX_CHALLENGE_REQUESTS) {
        res.status(429).send({
          error: 'MAX_TRIES_REACHED',
        });
        return;
      }

      // update number of tries
      mysqlConnection.query(
        `UPDATE StudentBluebookSettings SET challengeTries=${challengeTries +
          1} WHERE netid=${mysql.escape(netid)}`,
        (error, results, fields) => {
          // catch general query errors
          if (error) {
            console.error(error.message);
            res.status(500).send({
              error: 'INTERNAL_ERROR',
            });
            return;
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
            res.status(406).send({
              error: 'INVALID_TOKEN',
              challengeTries: challengeTries + 1,
            });
            return;
          }

          // catch malformed answer JSON errors
          try {
            answers = JSON.parse(answers);
            answerRatings = answers.map(
              x => `${x['courseRatingId']}_${x['courseRatingIndex']}`
            );
          } catch (e) {
            console.error(e);
            res.status(406).send({
              error: 'MALFORMED_ANSWERS',
              challengeTries: challengeTries + 1,
            });
            return;
          }

          // make sure the provided ratings IDs and indices match those we have
          if (
            secretRatings.sort().join(',') !== answerRatings.sort().join(',')
          ) {
            res.status(406).send({
              error: 'INVALID_TOKEN',
              challengeTries: challengeTries + 1,
            });
            return;
          }

          query({
            query: verifyEvalsQuery,
            endpoint: GRAPHQL_ENDPOINT,
            variables: {
              questionIds: secretRatingIds,
            },
          })
            .then(response => {
              // if answers are incorrect, respond with error
              if (!verifyChallenge(response, answers)) {
                res.status(200).send({
                  error: 'INCORRECT',
                  challengeTries: challengeTries + 1,
                });
              }

              // otherwise, enable evaluations
              mysqlConnection.query(
                `UPDATE StudentBluebookSettings SET evaluationsEnabled=1 WHERE netid=${mysql.escape(
                  netid
                )}`,
                (error, results, fields) => {
                  // catch general query errors
                  if (error) {
                    console.error(error.message);
                    res.status(500).send({
                      error: 'INTERNAL_ERROR',
                    });
                    return;
                  }

                  res.json({
                    body: 'CORRECT',
                    challengeTries: challengeTries + 1,
                  });
                }
              );
            })
            .catch(error => {
              res.json({ body: error, challengeTries: challengeTries + 1 });
            });
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`Challenge API listening at http://localhost:${PORT}`);
});
