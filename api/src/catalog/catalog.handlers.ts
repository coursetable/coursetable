import fs from 'node:fs/promises';
import type express from 'express';
import { createObjectCsvStringifier } from 'csv-writer';
import { fetchCatalog } from './catalog.utils.js';
import { FERRY_RELOAD_SECRET, STATIC_FILE_DIR } from '../config.js';
import winston from '../logging/winston.js';

export const verifyHeaders = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  winston.info('Verifying headers');
  const authd = req.header('x-ferry-secret');

  // Should only be reachable if request made by Ferry
  if (authd !== FERRY_RELOAD_SECRET) {
    res.status(401).json({ error: 'NOT_FERRY' });
    return;
  }

  next();
};

function flattenObject(obj: { [key: string]: unknown }): {
  [key: string]: string;
} {
  const flattened: { [key: string]: string } = {};
  Object.keys(obj).forEach((key) => {
    if (Array.isArray(obj[key])) {
      switch (key) {
        case 'course_flags':
          flattened[key] = JSON.stringify(
            (obj[key] as { flag: { flag_text: string } }[]).map(
              (x) => x.flag.flag_text,
            ),
          );
          break;
        case 'course_professors':
          flattened[key] = JSON.stringify(
            (obj[key] as { professor: object }[]).map((x) => x.professor),
          );
          break;
        case 'listings':
          flattened[key] = JSON.stringify(obj[key]);
          break;
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      const flatObject = flattenObject(obj[key] as { [key: string]: unknown });
      Object.keys(flatObject).forEach((subkey) => {
        flattened[`${key}.${subkey}`] = flatObject[subkey]!;
      });
    } else {
      flattened[key] = String(obj[key]);
    }
  });
  return flattened;
}

export async function generateCSVCatalog(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  const seasonCode = req.params.seasonCode!;
  winston.info(`Generating CSV catalog for ${seasonCode}`);
  const publicData = await fs
    .readFile(`${STATIC_FILE_DIR}/catalogs/public/${seasonCode}.json`, 'utf-8')
    .then((data) => JSON.parse(data) as { [key: string]: unknown }[]);
  const evalsData = await fs
    .readFile(`${STATIC_FILE_DIR}/catalogs/evals/${seasonCode}.json`, 'utf-8')
    .then((data) => JSON.parse(data) as { [key: string]: unknown }[]);
  const allData = publicData.map((listing, i) => ({
    ...flattenObject(listing),
    ...flattenObject(evalsData[i]!),
  }));
  const csvWriter = createObjectCsvStringifier({
    header: Object.keys(allData[0]!).map((k) => ({ id: k, title: k })),
  });
  const csv = csvWriter.getHeaderString() + csvWriter.stringifyRecords(allData);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${seasonCode}.csv"`,
  );
  res.send(csv);
}

export async function refreshCatalog(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  winston.info('Refreshing catalog');
  // Always overwrite when the refresh endpoint is hit
  await fetchCatalog(true);
  res.sendStatus(200);
}
