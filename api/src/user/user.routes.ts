import type express from 'express';
import asyncHandler from 'express-async-handler';

import { updateWorksheets, getUserWorksheet } from './user.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/user/*', authBasic);
  app.post('/api/user/updateWorksheet', asyncHandler(updateWorksheets));
  app.get('/api/user/worksheets', asyncHandler(getUserWorksheet));
};
