/**
 * @file Catalog fetch scripts.
 */

import { FERRY_SECRET } from '../config';
import express from 'express';

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
): void | express.Response => {
  winston.info('Verifying headers');
  // get authentication headers
  const authd = req.header('x-ferry-secret'); // if user is logged in

  // require NetID authentication
  if (FERRY_SECRET !== '' && authd !== FERRY_SECRET) {
    return res.status(401).json({
      error: 'NOT_AUTHENTICATED',
    });
  }

  return next();
};

/**
 * Endpoint to refresh static catalog JSONs
 *
 * @param req - express request object
 * @param res - express response object
 * @param next - express next object
 */
export const refreshCatalog = (
  req: express.Request,
  res: express.Response,
): void => {
  winston.info('Refreshing catalog');
  // always overwrite when called
  const overwrite = true;

  // fetch the catalog files and confirm success
  fetchCatalog(overwrite)
    .then(() =>
      res.status(200).json({
        status: 'OK',
      }),
    )
    .catch((err) => {
      winston.error(err);
      return res.status(500).json(err);
    });
};
