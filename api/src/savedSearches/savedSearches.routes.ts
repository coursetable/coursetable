import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  getSavedSearches,
  createSavedSearch,
  deleteSavedSearch,
} from './savedSearches.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  // Each route gets authBasic explicitly; app.use with path can mismatch GET
  app.get('/api/savedSearches', authBasic, asyncHandler(getSavedSearches));
  app.post(
    '/api/savedSearches/create',
    authBasic,
    asyncHandler(createSavedSearch),
  );
  app.post(
    '/api/savedSearches/delete',
    authBasic,
    asyncHandler(deleteSavedSearch),
  );
};
