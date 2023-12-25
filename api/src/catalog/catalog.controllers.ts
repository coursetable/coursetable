/**
 * @file Catalog fetch scripts.
 */

import type express from 'express';
import { FERRY_SECRET } from '../config';
import winston from '../logging/winston';
import { fetchCatalog } from './catalog.utils';

/**
 * Middleware to verify request headers
 *
 * @param req - express request object
 * @param res - express response object
 * @param next - express next object
 */
export const verifyHeaders = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  winston.info('Verifying headers');
  // Get authentication headers
  const authd = req.header('x-ferry-secret'); // If user is logged in

  // require NetID authentication
  if (FERRY_SECRET !== '' && authd !== FERRY_SECRET) {
    res.status(401).json({
      error: 'NOT_AUTHENTICATED',
    });
    return;
  }

  next();
};

/**
 * Endpoint to refresh static catalog JSONs
 *
 * @param req - express request object
 * @param res - express response object
 * @param next - express next object
 */
export async function refreshCatalog(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  winston.info('Refreshing catalog');
  // Always overwrite when called
  const overwrite = true;

  // Fetch the catalog files and confirm success
  await fetchCatalog(overwrite);
  res.sendStatus(200);
}
