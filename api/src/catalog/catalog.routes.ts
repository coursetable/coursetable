import type express from 'express';
import asyncHandler from 'express-async-handler';
import { verifyHeaders, refreshCatalog } from './catalog.handlers.js';

export default (app: express.Express): void => {
  // Enable static catalog refresh on demand.
  // After the crawler runs, we hit this route to refresh the static files.
  app.get('/api/catalog/refresh', verifyHeaders, asyncHandler(refreshCatalog));
};
