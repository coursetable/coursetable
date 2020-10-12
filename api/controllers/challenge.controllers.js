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

const verifyHeaders = (req, res) => {
  // get authentication headers
  const netid = req.header('x-coursetable-netid'); // user's NetID
  const authd = req.header('x-coursetable-authd'); // if user is logged in

  // require NetID authentication
  if (authd !== 'true') {
    return res.status(401).json({
      error: 'NOT_AUTHENTICATED',
    });
  }
};

/**
 * Generates and returns a user challenge.
 * @prop req - request object
 * @prop res - return object
 */
export const requestChallenge = (req, res) => {
  verifyHeaders(req, res);

  const student = new Student();

  Student.getChallengeStatus(netid, (statusCode, err, data) => {
    if (err) {
      return res.status(statusCode).json({
        error: err,
      });
    }

    const challengeTries = data['challengeTries'];

    Student.incrementChallengeTries(
      challengeTries,
      netid,
      (statusCode, err, data) => {
        if (err) {
          return res.status(statusCode).json({
            error: err,
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
            return res.json({
              body: constructChallenge(response),
              challengeTries: challengeTries + 1,
            });
          })
          .catch(error => {
            return res.json({
              body: error,
              challengeTries: challengeTries + 1,
            });
          });
      }
    );
  });
};

/**
 * Verifies answers to a challenge.
 * @prop req - request object
 * @prop res - return object
 */
export const verifyChallenge = (req, res) => {
  verifyHeaders(req, res);

  const student = new Student();

  Student.getChallengeStatus(netid, (statusCode, err, data) => {
    if (err) {
      return res.status(statusCode).json({
        error: err,
      });
    }
    const challengeTries = data['challengeTries'];

    Student.incrementChallengeTries(
      challengeTries,
      netid,
      (statusCode, err, data) => {
        if (err) {
          return res.status(statusCode).json({
            error: err,
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
          return res.status(406).json({
            error: 'INVALID_TOKEN',
            challengeTries: challengeTries + 1,
          });
        }

        // catch malformed answer JSON errors
        try {
          answers = JSON.parse(answers);
          answerRatings = answers.map(
            x => `${x['courseRatingId']}_${x['courseRatingIndex']}`
          );
        } catch (e) {
          return res.status(406).json({
            error: 'MALFORMED_ANSWERS',
            challengeTries: challengeTries + 1,
          });
        }

        // make sure the provided ratings IDs and indices match those we have
        if (secretRatings.sort().join(',') !== answerRatings.sort().join(',')) {
          return res.status(406).json({
            error: 'INVALID_TOKEN',
            challengeTries: challengeTries + 1,
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
            // if answers are incorrect, respond with error
            if (!checkChallenge(response, answers)) {
              return res.status(200).json({
                body: 'INCORRECT',
                challengeTries: challengeTries + 1,
              });
            }

            // otherwise, enable evaluations
            Student.enableEvaluations(netid, (statusCode, err, data) => {
              if (err) {
                return res.status(statusCode).json({
                  error: err,
                  challengeTries: challengeTries + 1,
                });
              }

              return res.json({
                body: 'CORRECT',
                challengeTries: challengeTries + 1,
              });
            });
          })
          .catch(err => {
            return res.status(500).json({
              error: err,
            });
          });
      }
    );
  });
};
