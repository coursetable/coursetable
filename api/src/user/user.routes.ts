import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  toggleBookmark,
  getUserWorksheet,
  toggleWish,
  getUserWishlist,
} from './user.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/user/*', authBasic);
  app.post('/api/user/toggleBookmark', asyncHandler(toggleBookmark));
  app.get('/api/user/worksheets', asyncHandler(getUserWorksheet));
  app.post('/api/user/toggleWish', asyncHandler(toggleWish));
  app.get('/api/user/wishlist', asyncHandler(getUserWishlist));
};
