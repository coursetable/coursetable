import fs from 'fs';

import crypto from 'crypto';

import graphqurl from 'graphqurl';
const { query } = graphqurl;

import {
  GRAPHQL_ENDPOINT,
  STATIC_FILE_DIR,
  CHALLENGE_ALGORITHM,
  CHALLENGE_PASSWORD,
} from './config/constants';

import {
  listSeasonsQuery,
  catalogBySeasonQuery,
} from './queries/catalog.queries.js';

/**
 * Encrypt a string according to CHALLENGE_ALGORITHM and CHALLENGE_PASSWORD.
 * @prop text - string to encrypt
 * @prop salt - salt value to append to password
 */
export function encrypt(text, salt) {
  const cipher = crypto.createCipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt
  );
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * Decrypt a salted string according to CHALLENGE_ALGORITHM and CHALLENGE_PASSWORD.
 * @prop text - string to decrypt
 * @prop salt - salt value to append to password
 */
export function decrypt(text, salt) {
  const decipher = crypto.createDecipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt
  );
  let dec = decipher.update(text, 'hex', 'utf8');
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
 * Middleware to verify request headers
 *
 * @prop req - express request object
 * @prop res - express response object
 * @prop next - express next object
 */
export const verifyNetID = (req, res, next) => {
  // get authentication headers
  const netid = req.header('x-coursetable-netid'); // user's NetID
  const authd = req.header('x-coursetable-authd'); // if user is logged in

  // require NetID authentication
  if (authd !== 'true' || !netid) {
    return res.status(401).json({
      error: 'NOT_AUTHENTICATED',
    });
  }

  next();
};

/**
 * Get static catalogs for each season from Hasura,
 * @prop overwrite - whether or not to skip existing catalogs.
 */
export async function fetchCatalog(overwrite) {
  let seasons;
  // get a list of all seasons
  try {
    seasons = await query({
      query: listSeasonsQuery,
      endpoint: GRAPHQL_ENDPOINT,
    });
  } catch (err) {
    console.error(err);
    throw Error(err);
  }

  console.log(`Fetched ${seasons.data.seasons.length} seasons`);
  fs.writeFileSync(
    `${STATIC_FILE_DIR}/seasons.json`,
    JSON.stringify(seasons.data.seasons)
  );

  // for each season, fetch all courses inside it and save
  // (if overwrite = true or if file does not exist)
  const processSeasons = await seasons.data.seasons.map(
    async ({ season_code }) => {
      const output_path = `${STATIC_FILE_DIR}/catalogs/${season_code}.json`;

      if (!overwrite && fs.existsSync(output_path)) {
        console.log(`Catalog for ${season_code} exists, skipping`);
        return;
      }

      let catalog;

      try {
        catalog = await query({
          query: catalogBySeasonQuery,
          endpoint: GRAPHQL_ENDPOINT,
          variables: {
            season: season_code,
          },
        });
      } catch (err) {
        console.error(err);
        throw err;
      }

      if (catalog.data.computed_listing_info) {
        fs.writeFileSync(
          output_path,
          JSON.stringify(catalog.data.computed_listing_info)
        );

        console.log(
          `Fetched season ${season_code}: n=${catalog.data.computed_listing_info.length}`
        );
      }
    }
  );

  return Promise.allSettled(processSeasons);
}
