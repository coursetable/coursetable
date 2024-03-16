import type express from 'express';
import { FERRY_SECRET } from '../config.js';
import winston from '../logging/winston.js';
import { fetchCatalog } from './catalog.utils.js';

export const verifyHeaders = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  winston.info('Verifying headers');
  const authd = req.header('x-ferry-secret');

  // Should only be reachable if request made by Ferry
  if (FERRY_SECRET !== '' && authd !== FERRY_SECRET) {
    res.status(401).json({ error: 'NOT_FERRY' });
    return;
  }

  next();
};

export async function refreshCatalog(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  winston.info('Refreshing catalog');
  // Always overwrite when the refresh endpoint is hit
  await fetchCatalog(true);
  res.sendStatus(200);
}
