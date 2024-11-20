import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  updateWorksheetCourses,
  getUserWorksheet,
  updateWorksheetMetadata,
  getUserWorksheetMetadata,
  toggleWish,
  getUserWishlist,
} from './user.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/user/*', authBasic);
  app.post(
    '/api/user/updateWorksheetCourses',
    asyncHandler(updateWorksheetCourses),
  );
  app.get('/api/user/worksheets', asyncHandler(getUserWorksheet));
  app.post(
    '/api/user/updateWorksheetMetadata',
    asyncHandler(updateWorksheetMetadata),
  );
  app.get(
    '/api/user/worksheetMetadata',
    asyncHandler(getUserWorksheetMetadata),
  );
  app.post('/api/user/toggleWish', asyncHandler(toggleWish));
  app.get('/api/user/wishlist', asyncHandler(getUserWishlist));
};
