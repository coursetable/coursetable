import type express from 'express';
import { request } from 'graphql-request';
import crypto from 'crypto';

import {
  GRAPHQL_ENDPOINT,
  CHALLENGE_SEASON,
  MAX_CHALLENGE_REQUESTS,
  CHALLENGE_ALGORITHM,
  CHALLENGE_PASSWORD,
  prisma,
} from '../config';

import winston from '../logging/winston';

import {
  requestEvalsQuery,
  type requestEvalsQueryResponse,
  verifyEvalsQuery,
  type verifyEvalsQueryResponse,
} from './challenge.queries';

/**
 * Encrypt a string according to CHALLENGE_ALGORITHM and CHALLENGE_PASSWORD.
 * @prop text - string to encrypt
 * @prop salt - salt value to append to password
 */
function encrypt(text: string, salt: string): string {
  // TODO
  // eslint-disable-next-line n/no-deprecated-api
  const cipher = crypto.createCipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt,
  );
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * Decrypt a salted string according to CHALLENGE_ALGORITHM and
 * CHALLENGE_PASSWORD.
 * @prop text - string to decrypt
 * @prop salt - salt value to append to password
 */
function decrypt(text: string, salt: string): string {
  // TODO
  // eslint-disable-next-line n/no-deprecated-api
  const decipher = crypto.createDecipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt,
  );
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/**
 * Randomly-generate an integer between 0 and max-1
 * @prop max - max integer to return (not inclusive)
 */
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

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
  evals: requestEvalsQueryResponse,
  challengeTries: number,
  netid: string,
) => {
  // Array of course enrollment counts
  const ratingIndices = evals.evaluation_ratings.map((evaluationRating) => {
    const ratingIndex = getRandomInt(5); // 5 is the number of rating categories

    if (!Number.isInteger(evaluationRating.rating[ratingIndex]))
      throw new Error(`Invalid rating index: ${ratingIndex}`);

    return ratingIndex;
  });

  // Array of CourseTable question IDs
  const ratingIds = evals.evaluation_ratings.map((x) => x.id);

  // Construct token object
  const ratingSecrets = ratingIds.map((x, index) => ({
    courseRatingId: ratingIds[index],
    courseRatingIndex: ratingIndices[index],
  }));

  const secrets = {
    netid,
    ratingSecrets,
  };

  // Encrypt token
  const salt = crypto.randomBytes(16).toString('hex');
  const token = encrypt(JSON.stringify(secrets), salt);

  // Course ids, titles and questions for user
  const courseIds = evals.evaluation_ratings.map((x) => x.id);
  const courseTitles = evals.evaluation_ratings.map((x) => x.course.title);
  const courseQuestionTexts = evals.evaluation_ratings.map(
    (x) => x.evaluation_question.question_text,
  );

  // Yale OCE urls for user to retrieve answers
  const oceUrls = evals.evaluation_ratings.map((x) => {
    // Courses have multiple CRNs, and any one should be fine
    // eslint-disable-next-line prefer-destructuring
    const { crn } = x.course.listings[0];
    const season = x.course.season_code;

    return `https://oce.app.yale.edu/ocedashboard/studentViewer/courseSummary?crn=${crn}&termCode=${season}`;
  });

  // Merged course information object
  const courseInfo = courseTitles.map((title, index) => ({
    courseId: courseIds[index],
    courseTitle: title,
    courseRatingIndex: ratingIndices[index],
    courseQuestionTexts: courseQuestionTexts[index],
    courseOceUrl: oceUrls[index],
  }));

  return {
    body: {
      token,
      salt,
      course_info: courseInfo,
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    },
  };
};

/**
 * Generates and returns a user challenge.
 * @prop req - request object
 * @prop res - return object
 */
export const requestChallenge = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Requesting challenge`);

  const { netId } = req.user!;

  // Increment challenge tries
  const { challengeTries, evaluationsEnabled } =
    await prisma.studentBluebookSettings.update({
      where: { netId },
      data: { challengeTries: { increment: 1 } },
    });

  if (evaluationsEnabled) {
    res.status(403).json({ error: 'ALREADY_ENABLED' });
    return;
  }

  if (challengeTries > MAX_CHALLENGE_REQUESTS) {
    res.status(429).json({
      error: 'MAX_TRIES_REACHED',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
    return;
  }

  // Randomize the selected challenge courses by
  // randomly choosing a minimum rating
  const minRating = 1 + Math.random() * 4;

  // Get a list of all seasons
  const evals: requestEvalsQueryResponse = await request(
    GRAPHQL_ENDPOINT,
    requestEvalsQuery,
    {
      season: CHALLENGE_SEASON,
      minRating,
    },
  );
  res.json(constructChallenge(evals, challengeTries, netId));
};

/**
 * Compare a response from the database and user-provided answers
 * to verify that a challenge is solved or not. Used by the
 * verifyChallenge controller.
 *
 * @prop trueEvals - response from the GraphQL query over the evaluations
 * @prop answers - user-provided answers
 */
const checkChallenge = (
  trueEvals: verifyEvalsQueryResponse,
  answers: {
    answer: string;
    courseRatingId: string;
    courseRatingIndex: string;
  }[],
): boolean => {
  // The true values in CourseTable to compare against
  const truth = trueEvals.evaluation_ratings;

  // Mapping from question ID to ratings
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
  res: express.Response,
): Promise<void> => {
  winston.info(`Verifying challenge`);

  const { netId } = req.user!;

  // Increment challenge tries
  const { challengeTries, evaluationsEnabled } =
    await prisma.studentBluebookSettings.update({
      where: { netId },
      data: { challengeTries: { increment: 1 } },
    });

  if (evaluationsEnabled) {
    res.status(403).json({ error: 'ALREADY_ENABLED' });
    return;
  }

  if (challengeTries > MAX_CHALLENGE_REQUESTS) {
    res.status(429).json({
      error: 'MAX_TRIES_REACHED',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
    return;
  }

  const { token, salt, answers } = req.body;
  let secrets: {
    netid: string;
    ratingSecrets: { courseRatingId: string; courseRatingIndex: number }[];
  } = { netid: '', ratingSecrets: [] }; // The decrypted token
  let secretRatingIds: string[] = []; // For retrieving the correct ones from the database
  // list in the format "<question_id>_<rating_index>" to verify
  // the submitted answers match those encoded in the token
  let secretRatings: string[] = [];
  let answerRatings: string[] = [];
  // Catch malformed token decryption errors
  try {
    secrets = JSON.parse(decrypt(token, salt));
    secretRatingIds = secrets.ratingSecrets.map((x) => x.courseRatingId);
    secretRatings = secrets.ratingSecrets.map(
      (x) => `${x.courseRatingId}_${x.courseRatingIndex}`,
    );
  } catch {
    res.status(400).json({
      error: 'INVALID_TOKEN',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
    return;
  }
  // Ensure that netid in token is same as in headers
  if (secrets.netid !== netId) {
    res.status(400).json({
      error: 'INVALID_TOKEN',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
    return;
  }
  // Catch malformed answer JSON errors
  try {
    answerRatings = answers.map(
      (x: { courseRatingId: string; courseRatingIndex: number }) =>
        `${x.courseRatingId}_${x.courseRatingIndex}`,
    );
  } catch {
    res.status(400).json({
      error: 'MALFORMED_ANSWERS',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
    return;
  }
  // Make sure the provided ratings IDs and indices match those we have
  if (secretRatings.sort().join(',') !== answerRatings.sort().join(',')) {
    res.status(400).json({
      error: 'INVALID_TOKEN',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    });
    return;
  }

  // Get a list of all seasons
  const trueEvals: verifyEvalsQueryResponse = await request(
    GRAPHQL_ENDPOINT,
    verifyEvalsQuery,
    {
      questionIds: secretRatingIds,
    },
  );

  if (!checkChallenge(trueEvals, answers)) {
    res.status(200).json({
      body: {
        message: 'INCORRECT',
        challengeTries,
        maxChallengeTries: MAX_CHALLENGE_REQUESTS,
      },
    });
    return;
  }
  // Otherwise, enable evaluations and respond with success
  await prisma.studentBluebookSettings.update({
    where: { netId },
    data: { evaluationsEnabled: true },
  });
  res.json({
    body: {
      message: 'CORRECT',
      challengeTries,
      maxChallengeTries: MAX_CHALLENGE_REQUESTS,
    },
  });
};
