import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  toggleBookmark,
  getUserWorksheet,
  updateBookmark,
} from './user.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/user/*', authBasic);
  app.post('/api/user/toggleBookmark', asyncHandler(toggleBookmark));
  app.post('/api/user/updateBookmark', asyncHandler(updateBookmark));
  app.get('/api/user/worksheets', asyncHandler(getUserWorksheet));
};
