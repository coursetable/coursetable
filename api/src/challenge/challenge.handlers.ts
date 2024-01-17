import type express from 'express';
import { request } from 'graphql-request';
import crypto from 'crypto';
import z from 'zod';

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
  type RequestEvalsQueryResponse,
  verifyEvalsQuery,
  type VerifyEvalsQueryResponse,
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
  evals: RequestEvalsQueryResponse,
  challengeTries: number,
  netId: string,
) => {
  const courseInfo = evals.evaluation_ratings.map((x) => {
    const ratingIndex = getRandomInt(5); // 5 is the number of rating categories

    if (!Number.isInteger(x.rating[ratingIndex]))
      throw new Error(`Invalid rating index: ${ratingIndex}`);

    return {
      courseId: x.id,
      courseTitle: x.course.title,
      courseRatingIndex: ratingIndex,
      // Courses have multiple CRNs, and any one should be fine
      courseOceUrl: `https://oce.app.yale.edu/ocedashboard/studentViewer/courseSummary?crn=${x.course.listings[0]!.crn}&termCode=${x.course.season_code}`,
    };
  });

  const ratingSecrets = courseInfo.map((x) => ({
    courseRatingId: x.courseId,
    courseRatingIndex: x.courseRatingIndex,
  }));

  const secrets: Secrets = { netId, ratingSecrets };

  // Encrypt token
  const salt = crypto.randomBytes(16).toString('hex');
  const token = encrypt(JSON.stringify(secrets), salt);

  return {
    token,
    salt,
    courseInfo,
    challengeTries,
    maxChallengeTries: MAX_CHALLENGE_REQUESTS,
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

  const { challengeTries, evaluationsEnabled } =
    (await prisma.studentBluebookSettings.findUnique({
      where: { netId },
    }))!;

  if (evaluationsEnabled) {
    res.status(403).json({ error: 'ALREADY_ENABLED' });
    return;
  }

  if (challengeTries > MAX_CHALLENGE_REQUESTS) {
    res.status(429).json({ error: 'MAX_TRIES_REACHED' });
    return;
  }

  // Randomize the selected challenge courses by
  // randomly choosing a minimum rating
  const minRating = 1 + Math.random() * 4;

  // Get a list of all seasons
  const evals: RequestEvalsQueryResponse = await request(
    GRAPHQL_ENDPOINT,
    requestEvalsQuery,
    {
      season: CHALLENGE_SEASON,
      minRating,
    },
  );
  res.json(constructChallenge(evals, challengeTries, netId));
};

const checkChallenge = (
  trueEvals: VerifyEvalsQueryResponse,
  answers: VerifyEvalsReqBody['answers'],
): boolean[] => {
  // Mapping from question ID to ratings
  const truthById = Object.fromEntries(
    trueEvals.evaluation_ratings.map((x) => [x.id, x.rating]),
  );

  return answers.map(
    ({ answer, courseRatingId, courseRatingIndex }) =>
      truthById[courseRatingId]?.[courseRatingIndex] === answer,
  );
};

const SecretsSchema = z.object({
  netId: z.string(),
  ratingSecrets: z.array(
    z.object({
      courseRatingId: z.number(),
      courseRatingIndex: z.number(),
    }),
  ),
});

type Secrets = z.infer<typeof SecretsSchema>;

const VerifyEvalsReqBodySchema = z.object({
  token: z.string(),
  salt: z.string(),
  answers: z.array(
    z.object({
      courseRatingId: z.number(),
      courseRatingIndex: z.number(),
      answer: z.number(),
    }),
  ),
});

type VerifyEvalsReqBody = z.infer<typeof VerifyEvalsReqBodySchema>;

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

  const { challengeTries, evaluationsEnabled } =
    (await prisma.studentBluebookSettings.findUnique({
      where: { netId },
    }))!;

  if (evaluationsEnabled) {
    res.status(403).json({ error: 'ALREADY_ENABLED' });
    return;
  }

  if (challengeTries > MAX_CHALLENGE_REQUESTS) {
    res.status(429).json({ error: 'MAX_TRIES_REACHED' });
    return;
  }

  const bodyParseRes = VerifyEvalsReqBodySchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { token, salt, answers } = bodyParseRes.data;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let trueEvals: VerifyEvalsQueryResponse;
  // Catch malformed token decryption errors
  try {
    const secrets: unknown = JSON.parse(decrypt(token, salt));
    const secretsParseRes = SecretsSchema.safeParse(secrets);
    if (!secretsParseRes.success) throw new Error('Malformed token');
    const { netId: secretNetId, ratingSecrets } = secretsParseRes.data;
    if (secretNetId !== netId)
      throw new Error('netId in token not the same as in headers');
    // List in the format "<question_id>_<rating_index>" to verify
    // the submitted answers match those encoded in the token
    if (
      ratingSecrets
        .map((x) => `${x.courseRatingId}_${x.courseRatingIndex}`)
        .sort()
        .join(',') !==
      answers
        .map((x) => `${x.courseRatingId}_${x.courseRatingIndex}`)
        .sort()
        .join(',')
    )
      throw new Error('Answer ratings IDs and indices do not match questions');
    trueEvals = await request(GRAPHQL_ENDPOINT, verifyEvalsQuery, {
      questionIds: ratingSecrets.map((x) => x.courseRatingId),
    });
  } catch {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }
  await prisma.studentBluebookSettings.update({
    where: { netId },
    data: { challengeTries: { increment: 1 } },
  });

  const results = checkChallenge(trueEvals, answers);

  if (results.every((x) => x)) {
    // Enable evaluations and respond with success
    await prisma.studentBluebookSettings.update({
      where: { netId },
      data: { evaluationsEnabled: true },
    });
  }
  res.status(200).json({
    results,
    challengeTries,
    maxChallengeTries: MAX_CHALLENGE_REQUESTS,
  });
};
