import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  updateWorksheetCourses,
  getUserWorksheet,
  updateWorksheet,
  getUserWorksheetNames,
} from './user.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/user/*', authBasic);
  app.post(
    '/api/user/updateWorksheetCourses',
    asyncHandler(updateWorksheetCourses),
  );
  app.get('/api/user/worksheets', asyncHandler(getUserWorksheet));
  app.post('/api/user/updateWorksheet', asyncHandler(updateWorksheet));
  app.get('/api/user/worksheetNames', asyncHandler(getUserWorksheetNames));
};
