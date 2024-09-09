import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  toggleBookmark,
  getUserWorksheet,
  updateBookmarkBatch,
} from './user.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/user/*', authBasic);
  app.post('/api/user/toggleBookmark', asyncHandler(toggleBookmark));
  app.post('/api/user/updateBookmarkBatch', asyncHandler(updateBookmarkBatch));
  app.get('/api/user/worksheets', asyncHandler(getUserWorksheet));
};
