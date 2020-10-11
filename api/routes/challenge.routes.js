import bodyParser from 'body-parser';

import graphqurl from 'graphqurl';
const { query } = graphqurl;

import {
  GRAPHQL_ENDPOINT,
  CHALLENGE_SEASON,
  MAX_CHALLENGE_REQUESTS,
} from '../config/constants.js';

import {
  requestEvalsQuery,
  verifyEvalsQuery,
} from '../queries/challenge.queries.js';

import { constructChallenge, checkChallenge, decrypt } from '../utils.js';

import Student from '../models/student.models.js';

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
export const requestChallenge = (req, res) => {
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

  const student = new Student();

  Student.getChallengeStatus(netid, (err, data) => {
    if (err) {
      if (err === 'USER_NOT_FOUND') {
        res.status(401).send({
          error: 'USER_NOT_FOUND',
        });
        return;
      } else if (err === 'ALREADY_ENABLED') {
        res.status(403).send({
          error: 'ALREADY_ENABLED',
        });
        return;
      } else if (err === 'MAX_TRIES_REACHED') {
        res.status(429).send({
          error: 'MAX_TRIES_REACHED',
        });
        return;
      }

      res.status(500).send({
        error: 'INTERNAL_ERROR',
      });
      return;
    }

    const challengeTries = data['challengeTries'];

    Student.incrementChallengeTries(challengeTries, netid, (err, data) => {
      if (err) {
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
    });
  });
};

/**
 * Verifies answers to a challenge.
 * @prop req - request object
 * @prop res - return object
 */
export const verifyChallenge = (req, res) => {
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

  const student = new Student();

  Student.getChallengeStatus(netid, (err, data) => {
    if (err) {
      if (err === 'USER_NOT_FOUND') {
        res.status(401).send({
          error: 'USER_NOT_FOUND',
        });
        return;
      } else if (err === 'ALREADY_ENABLED') {
        res.status(403).send({
          error: 'ALREADY_ENABLED',
        });
        return;
      } else if (err === 'MAX_TRIES_REACHED') {
        res.status(429).send({
          error: 'MAX_TRIES_REACHED',
        });
        return;
      }

      res.status(500).send({
        error: 'INTERNAL_ERROR',
      });
      return;
    }
    const challengeTries = data['challengeTries'];

    Student.incrementChallengeTries(challengeTries, netid, (err, data) => {
      if (err) {
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
      if (secretRatings.sort().join(',') !== answerRatings.sort().join(',')) {
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
          if (!checkChallenge(response, answers)) {
            res.status(200).send({
              body: 'INCORRECT',
              challengeTries: challengeTries + 1,
            });
            return;
          }

          Student.enableEvaluations(netid, (err, data) => {
            if (err) {
              res.status(500).send({
                error: 'INTERNAL_ERROR',
              });
              return;
            }

            res.json({
              body: 'CORRECT',
              challengeTries: challengeTries + 1,
            });

            return;
          });
        })
        .catch(error => {
          res.json({ body: error, challengeTries: challengeTries + 1 });
        });
    });
  });
};
