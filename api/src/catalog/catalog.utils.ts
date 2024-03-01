/**
 * @file utilities used for fetching catalog files.
 */

import fs from 'fs/promises';
import { request } from 'graphql-request';

import {
  catalogBySeasonQuery,
  catalogBySeasonNoRatingsQuery,
  listSeasonsQuery,
} from './catalog.queries';
import { GRAPHQL_ENDPOINT, STATIC_FILE_DIR } from '../config';
import winston from '../logging/winston';

type Seasons = {
  seasons: {
    season_code: string;
    term: string;
    year: number;
  }[];
};

type Catalog = {
  computed_listing_info: {
    all_course_codes: string[];
    areas: string[];
    average_gut_rating: number;
    average_professor: number;
    average_rating: number;
    average_workload: number;
    average_rating_same_professors: number;
    average_workload_same_professors: number;
    classnotes: string;
    course_code: string;
    credits: number;
    crn: string;
    description: string;
    enrolled: number;
    extra_info: string;
    final_exam: string;
    flag_info: string;
    fysem: boolean;
    last_enrollment: number;
    last_enrollment_same_professors: number;
    listing_id: string;
    locations_summary: string;
    number: string;
    professor_ids: string[];
    professor_names: string[];
    regnotes: string;
    requirements: string;
    rp_attr: string;
    same_course_id: string;
    same_course_and_profs_id: string;
    last_offered_course_id: string;
    school: string;
    season_code: string;
    section: string;
    skills: string;
    subject: string;
    syllabus_url: string;
    times_by_day: string;
    times_summary: string;
    title: string;
  }[];
};

/**
 * Get static catalogs for each season from Hasura,
 * @param overwrite - whether or not to skip existing catalogs.
 */
export async function fetchCatalog(
  overwrite: boolean,
): Promise<PromiseSettledResult<void>[]> {
  let seasons: Seasons = { seasons: [] };
  // Get a list of all seasons
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
    const fullCatalogPath = `${STATIC_FILE_DIR}/catalogs/${seasonCode}.json`;
    const publicCatalogPath = `${STATIC_FILE_DIR}/catalogs/public/${seasonCode}.json`;
    let catalogFull: Catalog = { computed_listing_info: [] };
    let catalogPublic: Catalog = { computed_listing_info: [] };

    // Fetch and save the full catalog (including evaluations)
    if (
      overwrite ||
      !(await fs.access(fullCatalogPath)
      .then(
        () => true,
        () => false,
      ))
    ) {
      try {
        catalogFull = await request(GRAPHQL_ENDPOINT, catalogBySeasonQuery, {
          season: seasonCode,
        });
        await fs.writeFile(
          fullCatalogPath,
          JSON.stringify(catalogFull.computed_listing_info),
        );
        winston.info(
          `Fetched full catalog for season ${seasonCode}: n=${catalogFull.computed_listing_info.length}`,
        );
      } catch (err) {
        winston.error(
          `Error fetching full catalog for season ${seasonCode}: ${err}`,
        );
      }
    } else {
      winston.info(`Full catalog for ${seasonCode} exists, skipping`);
    }

    // Fetch and save the public catalog (no evaluations)
    if (
      overwrite ||
      !(await fs.access(publicCatalogPath).then(
        () => true,
        () => false,
      ))
    ) {
      try {
        catalogPublic = await request(
          GRAPHQL_ENDPOINT,
          catalogBySeasonNoRatingsQuery,
          { season: seasonCode },
        );
        await fs.writeFile(
          publicCatalogPath,
          JSON.stringify(catalogPublic.computed_listing_info),
        );
        winston.info(
          `Fetched public catalog for season ${seasonCode}: n=${catalogPublic.computed_listing_info.length}`,
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
