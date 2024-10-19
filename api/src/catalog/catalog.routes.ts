import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  verifyHeaders,
  generateCSVCatalog,
  refreshCatalog,
} from './catalog.handlers.js';
import { authWithEvals } from '../auth/auth.handlers.js';
import { STATIC_FILE_DIR } from '../config.js';

const staticJSON = (path: string) =>
  express.static(`${STATIC_FILE_DIR}${path}`, {
    cacheControl: true,
    maxAge: '1h',
    lastModified: true,
    etag: true,
    extensions: ['json'],
  });

export default (app: express.Express): void => {
  // Enable static catalog refresh on demand.
  // After the crawler runs, we hit this route to refresh the static files.
  app.get('/api/catalog/refresh', verifyHeaders, asyncHandler(refreshCatalog));

  // Evals data require NetID authentication
  app.use('/api/catalog/evals', authWithEvals, staticJSON('/catalogs/evals'));

  // Serve public catalog files without authentication
  app.use('/api/catalog/public', staticJSON('/catalogs/public'));

  app.get(
    '/api/catalog/csv/:seasonCode(\\d{6}).csv',
    authWithEvals,
    asyncHandler(generateCSVCatalog),
  );

  app.use(
    '/api/sitemaps',
    express.static(`${STATIC_FILE_DIR}/sitemaps`, {
      cacheControl: true,
      maxAge: '1h',
      lastModified: true,
      etag: true,
    }),
  );
};
