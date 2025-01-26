import fs from 'node:fs/promises';
import path from 'node:path';

import { Readable } from 'node:stream';
import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import { getSdk, type CatalogBySeasonQuery } from './catalog.queries.js';
import { fetchBuildingData } from '../building/building.utils.js';
import { STATIC_FILE_DIR, SITEMAP_DIR, graphqlClient } from '../config.js';
import winston from '../logging/winston.js';

interface SitemapListing {
  crn: string;
  lastmod: string;
}

const exists = (p: string) =>
  fs.access(p).then(
    () => true,
    () => false,
  );

function transformCourseToSitemapListings(
  course: CatalogBySeasonQuery['courses'][number],
): SitemapListing[] {
  const year = parseInt(course.season_code.substring(0, 4), 10);
  const [today] = new Date().toISOString().split('T');
  if (!today) throw new Error('Unable to determine the current date.');

  const season = course.season_code.substring(4);

  const semesterStartDate = {
    '01': `${year}-01-15`,
    '02': `${year}-05-25`,
    '03': `${year}-08-25`,
  }[season];
  if (!semesterStartDate)
    throw new Error(`Unknown season code: ${course.season_code}`);

  const lastmod = semesterStartDate <= today ? semesterStartDate : today;

  return course.listings.map((l) => ({
    crn: String(l.crn),
    lastmod,
  }));
}

async function generateSeasonSitemap(
  seasonCode: string,
  courses: SitemapListing[],
): Promise<void> {
  await fs.mkdir(SITEMAP_DIR, { recursive: true });
  const [today] = new Date().toISOString().split('T');
  const links = courses.map((course: SitemapListing) => ({
    url: `/catalog?course-modal=${seasonCode}-${course.crn}`,
    lastmod: course.lastmod,
    priority: 0.8,
    changefreq: course.lastmod === today ? 'daily' : 'never',
  }));
  const stream = new SitemapStream({ hostname: 'https://coursetable.com' });
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(
    (data: Buffer) => data.toString(),
  );

  const sitemapPath = path.join(SITEMAP_DIR, `sitemap_${seasonCode}.xml`);
  await fs.writeFile(sitemapPath, xml, 'utf-8');

  winston.info(`Sitemap generated for ${seasonCode} at ${sitemapPath}`);
}

export async function generateSitemapIndex(): Promise<void> {
  await fs.mkdir(SITEMAP_DIR, { recursive: true });
  const sitemapFiles = await fs.readdir(SITEMAP_DIR);
  const sitemapUrls = sitemapFiles
    .filter(
      (file) =>
        file.startsWith('sitemap_') &&
        file.endsWith('.xml') &&
        file !== 'sitemap_index.xml',
    )
    .map((file) => `https://api.coursetable.com/api/sitemaps/${file}`);

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

async function generateMetadata() {
  // Note: the metadata does not read the psql metadata on purpose:
  // It indicates the last time the static files were updated.
  // If there's significant deviation between this time and the psql metadata,
  // then it would be a bug.
  // TODO: add a check for this in the future.
  const metadata = {
    last_update: new Date().toISOString(),
  };
  await fs.writeFile(
    `${STATIC_FILE_DIR}/metadata.json`,
    JSON.stringify(metadata),
  );
}

async function fetchData(
  seasonCode: string,
  type: 'evals' | 'public',
  overwrite: boolean,
): Promise<void> {
  // Support two versions of the frontend.
  const filePath = `${STATIC_FILE_DIR}/catalogs/${type}/${seasonCode}.json`;
  const sitemapFilePath = `${STATIC_FILE_DIR}/sitemaps/sitemap_${seasonCode}.xml`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  if (
    !overwrite &&
    (await exists(filePath)) &&
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
    await fs.writeFile(filePath, JSON.stringify(data.courses));
    winston.info(
      `Fetched ${type} data for ${seasonCode}; n=${data.courses.length}`,
    );

    // Generate the season sitemap
    if (type === 'public') {
      const listings = (
        data.courses as CatalogBySeasonQuery['courses']
      ).flatMap(transformCourseToSitemapListings);
      await generateSeasonSitemap(seasonCode, listings);
    }
  } catch (err) {
    winston.error(`Error fetching ${type} data for ${seasonCode}`);
    winston.error(err);
    throw err;
  }
}

export async function fetchCatalog(overwrite: boolean, latestN?: number) {
  try {
    await generateMetadata();
    const seasons = (await getSdk(graphqlClient).listSeasons()).seasons.map(
      (x) => x.season_code,
    );

    winston.info(`Fetched ${seasons.length} seasons`);

    // The seasons.json and infoAttributes.json files are copied to frontend
    await fs.writeFile(
      `${STATIC_FILE_DIR}/seasons.json`,
      JSON.stringify(seasons.sort((a, b) => Number(b) - Number(a))),
    );

    const infoAttributes = await getSdk(graphqlClient).courseAttributes();
    await fs.writeFile(
      `${STATIC_FILE_DIR}/infoAttributes.json`,
      JSON.stringify(infoAttributes.flags.map((x) => x.flag_text).sort()),
    );

    // For each season, fetch all courses inside it and save
    // (if overwrite, file does not exist, or season is one of the latest N)

    const processSeasons = seasons.flatMap((season, idx) =>
      (['evals', 'public'] as const).map((type) =>
        fetchData(season, type, overwrite || idx < (latestN ?? 0)),
      ),
    );
    await Promise.all(processSeasons);
    await fetchBuildingData();
    await generateSitemapIndex();
  } catch (err) {
    winston.error(err);
    throw err;
  }
}
