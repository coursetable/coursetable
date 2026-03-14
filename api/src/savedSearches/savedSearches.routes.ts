import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  getSavedSearches,
  createSavedSearch,
  updateSavedSearch,
  deleteSavedSearch,
} from './savedSearches.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/savedSearches/*', authBasic);
  app.get('/api/savedSearches', asyncHandler(getSavedSearches));
  app.post('/api/savedSearches/create', asyncHandler(createSavedSearch));
  app.post('/api/savedSearches/update', asyncHandler(updateSavedSearch));
  app.post('/api/savedSearches/delete', asyncHandler(deleteSavedSearch));
};
