import fs from 'node:fs/promises';
import path from 'node:path';
import { create } from 'xmlbuilder2';
import { getSdk, type CatalogBySeasonQuery } from './catalog.queries.js';
import { STATIC_FILE_DIR, graphqlClient } from '../config.js';
import winston from '../logging/winston.js';

interface Course {
  crn: string;
}

function transformListingToCourse(listing: CatalogBySeasonQuery['listings'][number]): Course {
  return {
    crn: String(listing.crn),
  };
}

async function generateSeasonSitemap(seasonCode: string, courses: Course[]) {
  const sitemapDir = path.join(STATIC_FILE_DIR, 'sitemaps');
  await fs.mkdir(sitemapDir, { recursive: true });

  const urlset = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

  courses.forEach((course) => {
    const url = urlset.ele('url');
    url.ele('loc').txt(`https://coursetable.com/catalog?course-modal=${seasonCode}-${course.crn}`);
    url.ele('priority').txt('0.8');
  });

  const xml = urlset.end({ prettyPrint: true });
  const sitemapPath = path.join(sitemapDir, `sitemap_${seasonCode}.xml`);
  await fs.writeFile(sitemapPath, xml, 'utf-8');

  winston.info(`Sitemap generated for ${seasonCode} at ${sitemapPath}`);
}

export async function generateSitemaps() {
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
