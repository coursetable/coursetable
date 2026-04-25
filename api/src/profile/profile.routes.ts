import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  getOwnProfile,
  getSharedProfile,
  revokeEvaluationsAccess,
  searchProfiles,
  updateOwnProfile,
} from './profile.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.get('/api/profile/me', authBasic, asyncHandler(getOwnProfile));
  app.post('/api/profile/me', authBasic, asyncHandler(updateOwnProfile));
  app.post(
    '/api/profile/me/revokeEvaluations',
    authBasic,
    asyncHandler(revokeEvaluationsAccess),
  );
  app.get('/api/profile/search', authBasic, asyncHandler(searchProfiles));
  app.get('/api/profile/:netId', asyncHandler(getSharedProfile));
};
