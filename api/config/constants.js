const die = (err) => {
  throw new Error(err);
};

export const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || die('graphql endpoint');
export const PORT = 4096;

export const CHALLENGE_ALGORITHM = 'aes-256-ctr';
export const CHALLENGE_PASSWORD =
  process.env.CHALLENGE_PASSWORD || die('challenge password');

export const NUM_CHALLENGE_COURSES = 3; // number of courses to select for the challenge
export const CHALLENGE_SEASON = '201903'; // season to select the challenge from
export const MAX_CHALLENGE_REQUESTS = 100; // maximum number of allowed challenge tries

export const FERRY_SECRET =
  process.env.FERRY_SECRET !== undefined
    ? process.env.FERRY_SECRET
    : die('ferry secret');
