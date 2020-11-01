import graphqurl from 'graphqurl';
const { query } = graphqurl;

import fs from 'fs';

import { GRAPHQL_ENDPOINT } from '../config/constants.js';

import { toJSON } from '../utils.js';

import {
  listSeasonsQuery,
  catalogBySeasonQuery,
} from '../queries/catalog.queries.js';

export const refreshCatalog = async (req, res, next) => {
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

      return [catalog, season_code];
    }
  );

  const catalogs = await Promise.all(processSeasons);

  catalogs.map(([catalog, season_code]) => {
    fs.writeFileSync(
      `./static/catalogs/${season_code}.json`,
      JSON.stringify(catalog.data.computed_listing_info)
    );
  });

  return res.status(200).json({
    status: 'OK',
  });
};
