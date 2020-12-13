import { catalogBySeasonQuery, listSeasonsQuery } from './catalog.queries';
import { GRAPHQL_ENDPOINT, STATIC_FILE_DIR } from '../config/constants';
import fs from 'fs';
import graphqurl from 'graphqurl';
const { query } = graphqurl;

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
