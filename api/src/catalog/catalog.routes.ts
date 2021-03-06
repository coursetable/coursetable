import { verifyHeaders, refreshCatalog } from './catalog.controllers.js';
import { verifyNetID } from '../auth/utils';
import express from 'express';
import { STATIC_FILE_DIR } from '../config';
import { fetchCatalog } from './catalog.utils';

export default async (app: express.Express) => {
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

  // Generate the static catalog on start.
  console.log('Updating static catalog');
  const overwriteCatalog = process.env.OVERWRITE_CATALOG || false;
  await fetchCatalog(overwriteCatalog);
};
