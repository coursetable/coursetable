import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  updateWorksheetCourses,
  getUserInfo,
  getUserWorksheet,
  updateWorksheetMetadata,
  toggleWish,
  getUserWishlist,
} from './user.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/user/*', authBasic);
  app.get('/api/user/info', asyncHandler(getUserInfo));
  app.get('/api/user/worksheets', asyncHandler(getUserWorksheet));
  app.post(
    '/api/user/updateWorksheetCourses',
    asyncHandler(updateWorksheetCourses),
  );
  app.post(
    '/api/user/updateWorksheetMetadata',
    asyncHandler(updateWorksheetMetadata),
  );
  app.post('/api/user/toggleWish', asyncHandler(toggleWish));
  app.get('/api/user/wishlist', asyncHandler(getUserWishlist));
};
