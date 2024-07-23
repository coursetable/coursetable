import fs from 'node:fs/promises';
import path from 'node:path';

import { Readable } from 'node:stream';
import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import {
  getSdk,
  type CatalogBySeasonQuery,
  type EvalsBySeasonQuery,
} from './catalog.queries.js';
import { STATIC_FILE_DIR, SITEMAP_DIR, graphqlClient } from '../config.js';
import winston from '../logging/winston.js';

interface SitemapListing {
  crn: string;
}
/**
 * This is the legacy "flat" data format we used. This shape seems to be easier
 * to work with, and for the purpose of API compatibility we "massage" the GQL
 * response into the same shape.
 *
 * TODO: remove this
 */
function processEvals(listing: EvalsBySeasonQuery['listings'][number]) {
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

function processCatalog(listing: CatalogBySeasonQuery['listings'][number]) {
  return {
    all_course_codes: listing.course.listings.map((x) => x.course_code),
    areas: listing.course.areas as string[],
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
    skills: listing.course.skills as string[],
    subject: listing.subject,
    syllabus_url: listing.course.syllabus_url,
    sysem: listing.course.sysem,
    times_by_day: listing.course.times_by_day as unknown,
    times_summary: listing.course.times_summary,
    title: listing.course.title,
  };
}

const exists = (p: string) =>
  fs.access(p).then(
    () => true,
    () => false,
  );

function transformListingToSitemapListing(
  listing: CatalogBySeasonQuery['listings'][number],
): SitemapListing {
  return {
    crn: String(listing.crn),
  };
}

async function generateSeasonSitemap(
  seasonCode: string,
  courses: SitemapListing[],
): Promise<void> {
  await fs.mkdir(SITEMAP_DIR, { recursive: true });

  const links = courses.map((course: SitemapListing) => ({
    url: `/catalog?course-modal=${seasonCode}-${course.crn}`,
    priority: 0.8,
  }));

  const stream = new SitemapStream({ hostname: 'https://coursetable.com' });
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(
    (data: Buffer) => data.toString(),
  );

  const sitemapPath = path.join(SITEMAP_DIR, `sitemap_${seasonCode}.xml`);
  await fs.writeFile(sitemapPath, xml, 'utf-8');

  winston.info(`Sitemap generated for ${seasonCode} at ${sitemapPath}`);
}

async function generateSitemapIndex(): Promise<void> {
  await fs.mkdir(SITEMAP_DIR, { recursive: true });

  const sitemapFiles = await fs.readdir(SITEMAP_DIR);
  const sitemapUrls = sitemapFiles
    .filter((file) => file.startsWith('sitemap_') && file.endsWith('.xml'))
    .map((file) => `https://coursetable.com/static/sitemaps/${file}`);

  const links = sitemapUrls.map((url) => ({ url }));

  const indexStream = new SitemapIndexStream();

  for (const link of links) indexStream.write(link);

  indexStream.end();

  const indexXml = await streamToPromise(indexStream).then((data) =>
    data.toString(),
  );

  const sitemapIndexPath = path.join(SITEMAP_DIR, 'sitemap_index.xml');
  await fs.writeFile(sitemapIndexPath, indexXml, 'utf-8');

  winston.info(`Sitemap index generated at ${sitemapIndexPath}`);
}

async function fetchData(
  seasonCode: string,
  type: 'evals' | 'public',
  overwrite: boolean,
): Promise<void> {
  // Support two versions of the frontend.
  // TODO: remove the legacy format and rename catalogs-v2 to catalogs
  const filePath = `${STATIC_FILE_DIR}/catalogs/${type}/${seasonCode}.json`;
  const v2FilePath = `${STATIC_FILE_DIR}/catalogs-v2/${type}/${seasonCode}.json`;
  const sitemapFilePath = `${STATIC_FILE_DIR}/sitemaps/sitemap_${seasonCode}.xml`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.mkdir(path.dirname(v2FilePath), { recursive: true });
  if (
    !overwrite &&
    (await exists(filePath)) &&
    (await exists(v2FilePath)) &&
    (await exists(sitemapFilePath))
  ) {
    winston.info(`Skipping ${type} data for ${seasonCode}`);
    return;
  }
  try {
    const sdk = getSdk(graphqlClient);
    const data = await (type === 'evals'
      ? sdk.evalsBySeason({ season: seasonCode })
      : sdk.catalogBySeason({ season: seasonCode }));
    const postprocess: (data: any) => any =
      type === 'evals' ? processEvals : processCatalog;
    await fs.writeFile(
      filePath,
      JSON.stringify(data.listings.map(postprocess)),
    );
    await fs.writeFile(v2FilePath, JSON.stringify(data.listings));
    winston.info(
      `Fetched ${type} data for ${seasonCode}; n=${data.listings.length}`,
    );

    // Generate the season sitemap
    if (type === 'public') {
      const courses = (data.listings as CatalogBySeasonQuery['listings']).map(
        transformListingToSitemapListing,
      );
      await generateSeasonSitemap(seasonCode, courses);
    }
  } catch (err) {
    winston.error(`Error fetching ${type} data for ${seasonCode}: ${err}`);
  }
}

export async function fetchCatalog(overwrite: boolean) {
  let seasons: string[] = [];

  try {
    seasons = (await getSdk(graphqlClient).listSeasons()).seasons.map(
      (x) => x.season_code,
    );
  } catch (err) {
    winston.error(err);
    throw err;
  }

  winston.info(`Fetched ${seasons.length} seasons`);

  // The seasons.json and infoAttributes.json files are copied to frontend
  await fs.writeFile(
    `${STATIC_FILE_DIR}/seasons.json`,
    JSON.stringify(seasons.sort((a, b) => Number(b) - Number(a))),
  );

  try {
    const infoAttributes = await getSdk(graphqlClient).courseAttributes();
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
  winston.info('Finished generating season sitemaps');
  await generateSitemapIndex();
}
