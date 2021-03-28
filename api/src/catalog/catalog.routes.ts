/**
 * @file Routes for catalog
 */

import { verifyHeaders, refreshCatalog } from './catalog.controllers';
import express from 'express';
import { fetchCatalog } from './catalog.utils';

import winston from '../logging/winston';

/**
 * Set up catalog routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  // Enable static catalog refresh on demand.
  // After the crawler runs, we hit this route to refresh the static files.
  app.get('/api/catalog/refresh', verifyHeaders, refreshCatalog);

  // Generate the static catalog on start.
  winston.info('Updating static catalog');
  const overwriteCatalog = process.env.OVERWRITE_CATALOG === 'true';
  await fetchCatalog(overwriteCatalog);
};
