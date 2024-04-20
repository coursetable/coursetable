import fs from 'fs/promises';
import path from 'path';
import { request } from 'graphql-request';

import {
  evalsBySeasonQuery,
  catalogBySeasonQuery,
  listSeasonsQuery,
  courseAttributesQuery,
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

async function fetchData(
  seasonCode: string,
  type: 'evals' | 'public',
  overwrite: boolean,
) {
  const filePath = `${STATIC_FILE_DIR}/catalogs/${type}/${seasonCode}.json`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  if (
    !overwrite &&
    (await fs.access(filePath).then(
      () => true,
      () => false,
    ))
  ) {
    winston.info(`Skipping ${type} data for ${seasonCode}`);
    return;
  }
  try {
    const data = await request<{ computed_listing_info: unknown[] }>(
      GRAPHQL_ENDPOINT,
      type === 'evals' ? evalsBySeasonQuery : catalogBySeasonQuery,
      { season: seasonCode },
    );
    await fs.writeFile(filePath, JSON.stringify(data.computed_listing_info));
    winston.info(
      `Fetched ${type} data for ${seasonCode}; n=${data.computed_listing_info.length}`,
    );
  } catch (err) {
    winston.error(`Error fetching ${type} data for ${seasonCode}: ${err}`);
  }
}

export async function fetchCatalog(overwrite: boolean) {
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

  try {
    const infoAttributes = await request<{
      course_flags: { flag: { flag_text: string } }[];
    }>(GRAPHQL_ENDPOINT, courseAttributesQuery);
    await fs.writeFile(
      `${STATIC_FILE_DIR}/infoAttributes.json`,
      JSON.stringify(
        infoAttributes.course_flags.map((x) => x.flag.flag_text).sort(),
      ),
    );
  } catch (err) {
    winston.error(err);
    throw err;
  }

  // For each season, fetch all courses inside it and save
  // (if overwrite = true or if file does not exist)

  const processSeasons = seasons.seasons.flatMap((season) =>
    (['evals', 'public'] as const).map((type) =>
      fetchData(season.season_code, type, overwrite),
    ),
  );
  await Promise.all(processSeasons);
}
