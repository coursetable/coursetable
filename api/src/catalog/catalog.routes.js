import { verifyHeaders, refreshCatalog } from './catalog.controllers.js';
import { verifyNetID } from '../auth/utils';
import express from 'express';
import path from 'path';
import { STATIC_FILE_DIR } from '../config';

export default (app) => {
  // Enable static catalog refresh on demand.
  // After the crawler runs, we hit this route to refresh the static files.
  app.get('/api/catalog/refresh', verifyHeaders, refreshCatalog);

  // Mount static files route and require NetID authentication
  app.use(
    '/api/static',
    verifyNetID,
    express.static(STATIC_FILE_DIR, {
      cacheControl: true,
      maxAge: '1h',
      lastModified: true,
      etag: true,
    })
  );
};
