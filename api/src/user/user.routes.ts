/**
 * @file Routes for working with user accounts.
 */

import express from 'express';

import cookieParser from 'cookie-parser';

import {
  toggleBookmark,
  getUserWorksheet,
  changeWorksheetName,
  addWorksheet,
  deleteWorksheet,
} from './user.handlers';

/**
 * Set up user routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  app.use(cookieParser());
  app.post('/api/user/toggleBookmark', toggleBookmark);
  app.get('/api/user/worksheets', getUserWorksheet);
  app.get('/api/user/worksheets/changeName', changeWorksheetName);
  app.get('/api/user/worksheets/add', addWorksheet);
  app.get('/api/user/worksheets/delete', deleteWorksheet);
};
