import fs from 'fs';

import crypto from 'crypto';
import jsonfile from 'jsonfile';

import graphqurl from 'graphqurl';
const { query } = graphqurl;

import { GRAPHQL_ENDPOINT } from './config/constants.js';

import {
  listSeasonsQuery,
  catalogBySeasonQuery,
} from './queries/catalog.queries.js';

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
 * Get static catalogs for each season from Hasura,
 * @prop overwrite - whether or not to skip existing catalogs.
 */
export async function fetchCatalog(overwrite) {
  const seasons = await query({
    query: listSeasonsQuery,
    endpoint: GRAPHQL_ENDPOINT,
  });

  console.log(`Fetched ${seasons.data.seasons.length} seasons`);

  fs.writeFileSync(
    `./static/seasons.json`,
    JSON.stringify(seasons.data.seasons)
  );

  const processSeasons = await seasons.data.seasons.map(
    async ({ season_code }) => {
      const catalog = await query({
        query: catalogBySeasonQuery,
        endpoint: GRAPHQL_ENDPOINT,
        variables: {
          season: season_code,
        },
      });

      console.log(
        `Fetched season ${season_code}: n=${catalog.data.computed_listing_info.length}`
      );

      fs.writeFileSync(
        `./static/catalogs/${season_code}.json`,
        JSON.stringify(catalog.data.computed_listing_info)
      );

      return [catalog, season_code];
    }
  );

  const catalogs = await Promise.all(processSeasons);

  // catalogs.map(([catalog, season_code]) => {
  //   fs.writeFileSync(
  //     `./static/catalogs/${season_code}.json`,
  //     JSON.stringify(catalog.data.computed_listing_info)
  //   );
  // });
}
