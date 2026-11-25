import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  getColorThemes,
  createColorTheme,
  updateColorTheme,
  deleteColorTheme,
} from './colorThemes.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  // Each route gets authBasic explicitly; app.use with path can mismatch GET
  app.get('/api/colorThemes', authBasic, asyncHandler(getColorThemes));
  app.post(
    '/api/colorThemes/create',
    authBasic,
    asyncHandler(createColorTheme),
  );
  app.post(
    '/api/colorThemes/update',
    authBasic,
    asyncHandler(updateColorTheme),
  );
  app.post(
    '/api/colorThemes/delete',
    authBasic,
    asyncHandler(deleteColorTheme),
  );
};
