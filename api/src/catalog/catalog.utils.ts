import fs from 'node:fs/promises';
import path from 'node:path';
import { request } from 'graphql-request';

import {
  evalsBySeasonQuery,
  catalogBySeasonQuery,
  listSeasonsQuery,
  courseAttributesQuery,
} from './catalog.queries.js';
import { GRAPHQL_ENDPOINT, STATIC_FILE_DIR } from '../config.js';
import winston from '../logging/winston.js';

/**
 * This is the legacy "flat" data format we used. This shape seems to be easier
 * to work with, and for the purpose of API compatibility we "massage" the GQL
 * response into the same shape.
 *
 * TODO: remove this
 */
function processEvals(listing: {
  // TODO: instead of writing all the keys (not too bad since we don't care
  // about the value types), we should run graphql-codegen for api too
  course: {
    average_gut_rating: unknown;
    average_professor_rating: unknown;
    average_rating: unknown;
    average_rating_same_professors: unknown;
    average_workload: unknown;
    average_workload_same_professors: unknown;
    evaluation_statistic: {
      enrolled: unknown;
    } | null;
    last_enrollment: unknown;
    last_enrollment_same_professors: unknown;
  };
  crn: unknown;
}) {
  return {
    average_gut_rating: listing.course.average_gut_rating,
    average_professor: listing.course.average_professor_rating,
    average_rating: listing.course.average_rating,
    average_workload: listing.course.average_workload,
    average_rating_same_professors:
      listing.course.average_rating_same_professors,
    average_workload_same_professors:
      listing.course.average_workload_same_professors,
    crn: listing.crn,
    enrolled: listing.course.evaluation_statistic?.enrolled ?? null,
    last_enrollment: listing.course.last_enrollment,
    last_enrollment_same_professors:
      listing.course.last_enrollment_same_professors,
  };
}

function processCatalog(listing: {
  course: {
    areas: unknown;
    classnotes: unknown;
    colsem: unknown;
    course_flags: {
      flag: { flag_text: unknown };
    }[];
    course_professors: {
      professor: {
        professor_id: unknown;
        name: unknown;
      };
    }[];
    credits: unknown;
    description: unknown;
    extra_info: unknown;
    final_exam: unknown;
    fysem: unknown;
    last_offered_course_id: unknown;
    listings: {
      crn: unknown;
      course_code: unknown;
    }[];
    locations_summary: unknown;
    regnotes: unknown;
    requirements: unknown;
    rp_attr: unknown;
    same_course_and_profs_id: unknown;
    same_course_id: unknown;
    skills: unknown;
    syllabus_url: unknown;
    sysem: unknown;
    times_by_day: unknown;
    times_summary: unknown;
    title: unknown;
  };
  course_code: unknown;
  crn: unknown;
  listing_id: unknown;
  number: unknown;
  school: unknown;
  season_code: unknown;
  section: unknown;
  subject: unknown;
}) {
  return {
    all_course_codes: listing.course.listings.map((x) => x.course_code),
    areas: listing.course.areas,
    classnotes: listing.course.classnotes,
    colsem: listing.course.colsem,
    course_code: listing.course_code,
    credits: listing.course.credits,
    crn: listing.crn,
    description: listing.course.description,
    extra_info: listing.course.extra_info,
    final_exam: listing.course.final_exam,
    flag_info: listing.course.course_flags.map((x) => x.flag.flag_text),
    fysem: listing.course.fysem,
    listing_id: listing.listing_id,
    locations_summary: listing.course.locations_summary,
    number: listing.number,
    professor_ids: listing.course.course_professors.map((x) =>
      // This is how this API used to work.
      // TODO: restore this to number
      String(x.professor.professor_id),
    ),
    professor_names: listing.course.course_professors.map(
      (x) => x.professor.name,
    ),
    regnotes: listing.course.regnotes,
    requirements: listing.course.requirements,
    rp_attr: listing.course.rp_attr,
    same_course_id: listing.course.same_course_id,
    same_course_and_profs_id: listing.course.same_course_and_profs_id,
    last_offered_course_id: listing.course.last_offered_course_id,
    school: listing.school,
    season_code: listing.season_code,
    section: listing.section,
    skills: listing.course.skills,
    subject: listing.subject,
    syllabus_url: listing.course.syllabus_url,
    sysem: listing.course.sysem,
    times_by_day: listing.course.times_by_day,
    times_summary: listing.course.times_summary,
    title: listing.course.title,
  };
}

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
    const data = await request<{ listings: any[] }>(
      GRAPHQL_ENDPOINT,
      type === 'evals' ? evalsBySeasonQuery : catalogBySeasonQuery,
      { season: seasonCode },
    );
    const postprocess: (data: any) => any =
      type === 'evals' ? processEvals : processCatalog;
    await fs.writeFile(
      filePath,
      JSON.stringify(data.listings.map(postprocess)),
    );
    winston.info(
      `Fetched ${type} data for ${seasonCode}; n=${data.listings.length}`,
    );
  } catch (err) {
    winston.error(`Error fetching ${type} data for ${seasonCode}: ${err}`);
  }
}

export async function fetchCatalog(overwrite: boolean) {
  let seasons: string[] = [];
  try {
    seasons = (
      await request<{ seasons: { season_code: string }[] }>(
        GRAPHQL_ENDPOINT,
        listSeasonsQuery,
      )
    ).seasons.map((x) => x.season_code);
  } catch (err) {
    winston.error(err);
    throw err;
  }

  winston.info(`Fetched ${seasons.length} seasons`);
  await fs.writeFile(
    `${STATIC_FILE_DIR}/seasons.json`,
    JSON.stringify(seasons.sort((a, b) => Number(b) - Number(a))),
  );

  try {
    const infoAttributes = await request<{
      flags: { flag_text: string }[];
    }>(GRAPHQL_ENDPOINT, courseAttributesQuery);
    await fs.writeFile(
      `${STATIC_FILE_DIR}/infoAttributes.json`,
      JSON.stringify(infoAttributes.flags.map((x) => x.flag_text).sort()),
    );
  } catch (err) {
    winston.error(err);
    throw err;
  }

  // For each season, fetch all courses inside it and save
  // (if overwrite = true or if file does not exist)

  const processSeasons = seasons.flatMap((season) =>
    (['evals', 'public'] as const).map((type) =>
      fetchData(season, type, overwrite),
    ),
  );
  await Promise.all(processSeasons);
}
