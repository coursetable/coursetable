import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  updateWorksheetCourses,
  getUserInfo,
  getUserWorksheet,
  updateWorksheetMetadata,
  updateWishlistCourses,
  getUserWishlist,
  getUserPublicProfile,
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
  app.get('/api/user/wishlist', asyncHandler(getUserWishlist));
  app.post(
    '/api/user/updateWishlistCourses',
    asyncHandler(updateWishlistCourses),
  );
  app.get(
    '/api/user/public-profile/:netId',
    asyncHandler(getUserPublicProfile),
  );
};
