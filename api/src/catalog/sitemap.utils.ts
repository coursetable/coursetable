import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { SitemapStream, streamToPromise } from 'sitemap';
import { getSdk, type CatalogBySeasonQuery } from './catalog.queries.js';
import { STATIC_FILE_DIR, graphqlClient } from '../config.js';
import winston from '../logging/winston.js';

interface Course {
  crn: string;
}

function transformListingToCourse(
  listing: CatalogBySeasonQuery['listings'][number],
): Course {
  return {
    crn: String(listing.crn),
  };
}

async function generateSeasonSitemap(
  seasonCode: string,
  courses: Course[],
): Promise<void> {
  const sitemapDir = path.join(STATIC_FILE_DIR, 'sitemaps');
  await fs.mkdir(sitemapDir, { recursive: true });

  const links = courses.map((course) => ({
    url: `/catalog?course-modal=${seasonCode}-${course.crn}`,
    priority: 0.8,
  }));

  const stream = new SitemapStream({ hostname: 'https://coursetable.com' });
  const xml = await streamToPromise(Readable.from(links).pipe(stream)).then(
    (data: Buffer) => data.toString(),
  );

  const sitemapPath = path.join(sitemapDir, `sitemap_${seasonCode}.xml`);
  await fs.writeFile(sitemapPath, xml, 'utf-8');

  winston.info(`Sitemap generated for ${seasonCode} at ${sitemapPath}`);
}

export async function generateSitemaps(): Promise<void> {
  let seasons: string[] = [];
  try {
    const sdk = getSdk(graphqlClient);
    seasons = (await sdk.listSeasons()).seasons.map((x) => x.season_code);
  } catch (err) {
    winston.error(err);
    throw err;
  }

  winston.info(`Fetched ${seasons.length} seasons`);

  for (const seasonCode of seasons) {
    try {
      const sdk = getSdk(graphqlClient);
      const data = await sdk.catalogBySeason({ season: seasonCode });
      const courses = data.listings.map(transformListingToCourse);
      await generateSeasonSitemap(seasonCode, courses);
    } catch (err) {
      winston.error(`Error generating sitemap for ${seasonCode}: ${err}`);
    }
  }
}
