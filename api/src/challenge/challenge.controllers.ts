import express from 'express';
import { request } from 'graphql-request';
import crypto from 'crypto';

import {
  GRAPHQL_ENDPOINT,
  CHALLENGE_SEASON,
  MAX_CHALLENGE_REQUESTS,
  prisma,
} from '../config';

import winston from '../logging/winston';

import {
  requestEvalsQuery,
  requestEvalsQueryResponse,
  verifyEvalsQuery,
  verifyEvalsQueryResponse,
} from './challenge.queries';

import { encrypt, decrypt, getRandomInt } from './challenge.utils';

/**
 * Generate a challenge object given a query response.
 * Used by the requestChallenge controller.
 *
 * @prop req - express request object
 * @prop res - express response object
 * @prop evals - evals from the GraphQL query over evaluations
 * @prop challengeTries - number of user attempts
 */
const constructChallenge = (
  req: express.Request,
  res: express.Response,
  evals: requestEvalsQueryResponse,
  challengeTries: number,
  netid: string
): express.Response => {
  // array of course enrollment counts
  let ratingIndices: number[];

  try {
    ratingIndices = evals.evaluation_ratings.map((evaluation_rating) => {
      const ratingIndex = getRandomInt(5); // 5 is the number of rating categories

      if (!Number.isInteger(evaluation_rating.rating[ratingIndex])) {
        throw new Error(`Invalid rating index: ${ratingIndex}`);
      }

      return ratingIndex;
    });
  } catch {
    return res.status(500).json({
      error: 'RATINGS_RETRIEVAL_ERROR',
    });
  }

  // array of CourseTable question IDs
  const ratingIds = evals.evaluation_ratings.map((x) => x.id);

  // construct token object
  const ratingSecrets = ratingIds.map((x, index: number) => {
    return {
      courseRatingId: ratingIds[index],
      courseRatingIndex: ratingIndices[index],
    };
  });

  const secrets = {
    netid,
    ratingSecrets,
  };

  // encrypt token
  const salt = crypto.randomBytes(16).toString('hex');
  const token = encrypt(JSON.stringify(secrets), salt);

  // course ids, titles and questions for user
  const courseIds = evals.evaluation_ratings.map((x) => x.id);
  const courseTitles = evals.evaluation_ratings.map((x) => x.course.title);
  const courseQuestionTexts = evals.evaluation_ratings.map(
    (x) => x.evaluation_question.question_text
  );

  // Yale OCE urls for user to retrieve answers
  const oceUrls = evals.evaluation_ratings.map((x) => {
    // courses have multiple CRNs, and any one should be fine
    const { crn } = x.course.listings[0];
    const season = x.course.season_code;

    return `https://oce.app.yale.edu/oce-viewer/studentSummary/index?crn=${crn}&term_code=${season}`;
  });

  // merged course information object
  const course_info = courseTitles.map((title: string, index: number) => {
    return {
      courseId: courseIds[index],
      courseTitle: title,
      courseRatingIndex: ratingIndices[index],
      courseQuestionTexts: courseQuestionTexts[index],
      courseOceUrl: oceUrls[index],
    };
  });

  return res.json({
    body: {
      token,
      salt,
      course_info,
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    },
  });
};

/**
 * Generates and returns a user challenge.
 * @prop req - request object
 * @prop res - return object
 */
export const requestChallenge = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info(`Requesting challenge`);

  if (!req.user) {
    return res.status(401).json({ error: 'USER_NOT_FOUND' });
  }

  const { netId } = req.user;

  // increment challenge tries
  const { challengeTries, evaluationsEnabled } =
    await prisma.studentBluebookSettings.update({
      where: { netId },
      data: { challengeTries: { increment: 1 } },
    });

  if (evaluationsEnabled) {
    return res.status(403).json({ error: 'ALREADY_ENABLED' });
  }

  if (challengeTries > MAX_CHALLENGE_REQUESTS) {
    return res.status(429).json({
      error: 'MAX_TRIES_REACHED',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
  }

  // randomize the selected challenge courses by
  // randomly choosing a minimum rating
  const minRating = 1 + Math.random() * 4;

  return request(GRAPHQL_ENDPOINT, requestEvalsQuery, {
    season: CHALLENGE_SEASON,
    minRating,
  })
    .then((evals) => {
      return constructChallenge(req, res, evals, challengeTries, netId);
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
        challengeTries,
        maxChallengeTries: MAX_CHALLENGE_REQUESTS,
      });
    });
};

/**
 * Compare a response from the database and user-provided answers
 * to verify that a challenge is solved or not. Used by the
 * verifyChallenge controller.
 *
 * @prop true_evals - response from the GraphQL query over the evaluations
 * @prop answers - user-provided answers
 */
const checkChallenge = (
  true_evals: verifyEvalsQueryResponse,
  answers: {
    answer: string;
    courseRatingId: string;
    courseRatingIndex: string;
  }[]
): boolean => {
  // the true values in CourseTable to compare against
  const truth = true_evals.evaluation_ratings;

  // mapping from question ID to ratings
  const truthById: { [key: string]: number[] } = {};

  truth.forEach((x) => {
    truthById[x.id] = x.rating;
  });

  const allCorrect = answers.every((answer) => {
    const trueRating =
      truthById[answer.courseRatingId][parseInt(answer.courseRatingIndex, 10)];
    const providedRating = parseInt(answer.answer, 10);

    return trueRating === providedRating;
  });

  return allCorrect;
};

/**
 * Verifies answers to a challenge.
 * @prop req - request object
 * @prop res - return object
 */
export const verifyChallenge = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info(`Verifying challenge`);

  if (!req.user) {
    return res.status(401).json({ error: 'USER_NOT_FOUND' });
  }

  const { netId } = req.user;

  // increment challenge tries
  const { challengeTries, evaluationsEnabled } =
    await prisma.studentBluebookSettings.update({
      where: { netId },
      data: { challengeTries: { increment: 1 } },
    });

  if (evaluationsEnabled) {
    return res.status(403).json({ error: 'ALREADY_ENABLED' });
  }

  if (challengeTries > MAX_CHALLENGE_REQUESTS) {
    return res.status(429).json({
      error: 'MAX_TRIES_REACHED',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
  }

  const { token, salt, answers } = req.body;
  let secrets: {
    netid: string;
    ratingSecrets: { courseRatingId: string; courseRatingIndex: number }[];
  }; // the decrypted token
  let secretRatingIds; // for retrieving the correct ones from the database
  // list in the format "<question_id>_<rating_index>" to verify
  // the submitted answers match those encoded in the token
  let secretRatings;
  let answerRatings;
  // catch malformed token decryption errors
  try {
    secrets = JSON.parse(decrypt(token, salt));
    secretRatingIds = secrets.ratingSecrets.map((x) => x.courseRatingId);
    secretRatings = secrets.ratingSecrets.map(
      (x) => `${x.courseRatingId}_${x.courseRatingIndex}`
    );
  } catch (e) {
    return res.status(406).json({
      error: 'INVALID_TOKEN',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
  }
  // ensure that netid in token is same as in headers
  if (secrets.netid !== netId) {
    return res.status(406).json({
      error: 'INVALID_TOKEN',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
  }
  // catch malformed answer JSON errors
  try {
    answerRatings = answers.map(
      (x: { courseRatingId: string; courseRatingIndex: number }) =>
        `${x.courseRatingId}_${x.courseRatingIndex}`
    );
  } catch (e) {
    return res.status(406).json({
      error: 'MALFORMED_ANSWERS',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
  }
  // make sure the provided ratings IDs and indices match those we have
  if (secretRatings.sort().join(',') !== answerRatings.sort().join(',')) {
    return res.status(406).json({
      error: 'INVALID_TOKEN',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
  }

  // check the answers against the true values
  return request(GRAPHQL_ENDPOINT, verifyEvalsQuery, {
    questionIds: secretRatingIds,
  })
    .then((true_evals) => {
      // if answers are incorrect, respond with error
      if (!checkChallenge(true_evals, answers)) {
        return res.status(200).json({
          body: {
            message: 'INCORRECT',
            challengeTries,
            maxChallengeTries: MAX_CHALLENGE_REQUESTS,
          },
        });
      }

      // otherwise, enable evaluations and respond with success
      return prisma.studentBluebookSettings
        .update({
          where: { netId },
          data: { evaluationsEnabled: true },
        })
        .then(() => {
          return res.json({
            body: {
              message: 'CORRECT',
              challengeTries,
              maxChallengeTries: MAX_CHALLENGE_REQUESTS,
            },
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
        challengeTries,
        maxChallengeTries: MAX_CHALLENGE_REQUESTS,
      });
    });
};
