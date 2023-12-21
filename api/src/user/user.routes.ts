/**
 * @file Routes for working with user accounts.
 */

import type express from 'express';

import cookieParser from 'cookie-parser';

import { toggleBookmark, getUserWorksheet } from './user.handlers';

/**
 * Set up user routes.
 * @param app: express app instance.
 */
export default (app: express.Express): void => {
  app.use(cookieParser());
  app.post('/api/user/toggleBookmark', toggleBookmark);
  app.get('/api/user/worksheets', getUserWorksheet);
};
