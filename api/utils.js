import crypto from 'crypto';

import { CHALLENGE_ALGORITHM, CHALLENGE_PASSWORD } from './config/constants.js';

/**
 * Encrypt a string according to CHALLENGE_ALGORITHM and CHALLENGE_PASSWORD.
 * @prop text - string to encrypt
 * @prop salt - salt value to append to password
 */
export function encrypt(text, salt) {
  var cipher = crypto.createCipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt
  );
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * Decrypt a salted string according to CHALLENGE_ALGORITHM and CHALLENGE_PASSWORD.
 * @prop text - string to decrypt
 * @prop salt - salt value to append to password
 */
export function decrypt(text, salt) {
  var decipher = crypto.createDecipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt
  );
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/**
 * Randomly-generate an integer between 0 and max-1
 * @prop max - max integer to return (not inclusive)
 */
export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Generate a challenge object given a query response
 * @prop response - response from the query
 */
export function constructChallenge(response) {
  // array of course enrollment counts
  let ratingIndices = new Array();

  for (const evaluation_rating of response['data']['evaluation_ratings']) {
    const ratingIndex = getRandomInt(5); // 5 is the number of rating categories

    if (!Number.isInteger(evaluation_rating['rating'][ratingIndex])) {
      return 'RATINGS_RETRIEVAL_ERROR';
    }
    ratingIndices.push(ratingIndex);
  }

  // array of CourseTable question IDs
  const ratingIds = response['data']['evaluation_ratings'].map(x => x['id']);

  // construct token object
  const secrets = ratingIds.map((x, index) => {
    return {
      courseRatingId: ratingIds[index],
      courseRatingIndex: ratingIndices[index],
    };
  });

  // encrypt token
  const salt = crypto.randomBytes(16).toString('hex');
  const token = encrypt(JSON.stringify(secrets), salt);

  // course ids, titles and questions for user
  const courseIds = response['data']['evaluation_ratings'].map(x => x['id']);
  const courseTitles = response['data']['evaluation_ratings'].map(
    x => x['course']['title']
  );
  const courseQuestionTexts = response['data']['evaluation_ratings'].map(
    x => x['evaluation_question']['question_text']
  );

  // Yale OCE urls for user to retrieve answers
  const oceUrls = response['data']['evaluation_ratings'].map(x => {
    // courses have multiple CRNs, and any one should be fine
    const crn = x['course']['listings'][0]['crn'];
    const season = x['course']['season_code'];

    const oceUrl = `https://oce.app.yale.edu/oce-viewer/studentSummary/index?crn=${crn}&term_code=${season}`;

    return oceUrl;
  });

  // merged course information object
  const course_info = courseTitles.map((x, index) => {
    return {
      courseId: courseIds[index],
      courseTitle: courseTitles[index],
      courseRatingIndex: ratingIndices[index],
      courseQuestionTexts: courseQuestionTexts[index],
      courseOceUrl: oceUrls[index],
    };
  });

  return {
    token: token,
    salt: salt,
    course_info: course_info,
  };
}

/**
 * Compare a response from the database and user-provided answers
 * to verify that a challenge is solved or not.
 * @prop response - response from the query
 * @prop answers - user-provided answers
 */
export function checkChallenge(response, answers) {
  // the true values in CourseTable to compare against
  const truth = response['data']['evaluation_ratings'];

  // mapping from question ID to ratings
  let truthById = {};

  truth.forEach(x => {
    truthById[x['id']] = x['rating'];
  });

  // return [truthById, answers];
  // for each answer, check that it matches our data
  for (const answer of answers) {
    if (
      truthById[answer['courseRatingId']][
        parseInt(answer['courseRatingIndex'])
      ] !== parseInt(answer['answer'])
    ) {
      return false;
    }
  }

  return true;
}
