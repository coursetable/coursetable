import fs from 'fs/promises';
import path from 'path';
import { request } from 'graphql-request';

import {
  evalsBySeasonQuery,
  catalogBySeasonQuery,
  listSeasonsQuery,
} from './catalog.queries.js';
import { GRAPHQL_ENDPOINT, STATIC_FILE_DIR } from '../config.js';
import winston from '../logging/winston.js';

type Seasons = {
  seasons: {
    season_code: string;
    term: string;
    year: number;
  }[];
};

export async function fetchCatalog(
  overwrite: boolean,
): Promise<PromiseSettledResult<void>[]> {
  let seasons: Seasons = { seasons: [] };
  try {
    seasons = await request(GRAPHQL_ENDPOINT, listSeasonsQuery);
  } catch (err) {
    winston.error(err);
    throw err;
  }

  winston.info(`Fetched ${seasons.seasons.length} seasons`);
  await fs.writeFile(
    `${STATIC_FILE_DIR}/seasons.json`,
    JSON.stringify(
      seasons.seasons
        .map((x) => x.season_code)
        .sort((a, b) => Number(b) - Number(a)),
    ),
  );

  // For each season, fetch all courses inside it and save
  // (if overwrite = true or if file does not exist)

  const processSeasons = seasons.seasons.map(async (season) => {
    const seasonCode = season.season_code;
    const evalsPath = `${STATIC_FILE_DIR}/catalogs/evals/${seasonCode}.json`;
    const catalogPath = `${STATIC_FILE_DIR}/catalogs/public/${seasonCode}.json`;
    await fs.mkdir(path.dirname(evalsPath), { recursive: true });
    await fs.mkdir(path.dirname(catalogPath), { recursive: true });

    // Fetch and save evals data
    if (
      overwrite ||
      !(await fs.access(evalsPath).then(
        () => true,
        () => false,
      ))
    ) {
      try {
        const evals = await request<{ computed_listing_info: unknown[] }>(
          GRAPHQL_ENDPOINT,
          evalsBySeasonQuery,
          {
            season: seasonCode,
          },
        );
        await fs.writeFile(
          evalsPath,
          JSON.stringify(evals.computed_listing_info),
        );
        winston.info(
          `Fetched evals for season ${seasonCode}: n=${evals.computed_listing_info.length}`,
        );
      } catch (err) {
        winston.error(`Error fetching evals for season ${seasonCode}: ${err}`);
      }
    } else {
      winston.info(`Evals for ${seasonCode} exists, skipping`);
    }

    // Fetch and save the public catalog (no evaluations)
    if (
      overwrite ||
      !(await fs.access(catalogPath).then(
        () => true,
        () => false,
      ))
    ) {
      try {
        const catalog = await request<{ computed_listing_info: unknown[] }>(
          GRAPHQL_ENDPOINT,
          catalogBySeasonQuery,
          {
            season: seasonCode,
          },
        );
        await fs.writeFile(
          catalogPath,
          JSON.stringify(catalog.computed_listing_info),
        );
        winston.info(
          `Fetched public catalog for season ${seasonCode}: n=${catalog.computed_listing_info.length}`,
        );
      } catch (err) {
        winston.error(
          `Error fetching public catalog for season ${seasonCode}: ${err}`, // MAKE SURE ITS MADE
        );
      }
    } else {
      winston.info(`Public catalog for ${seasonCode} exists, skipping`);
    }
  });
  return Promise.allSettled(processSeasons);
}
