/**
 * @file Routes for handling friends.
 */

import express from 'express';
import cookieParser from 'cookie-parser';

import {
  addFriend,
  getFriendsWorksheets,
  friendRequest,
  getNames
} from './friends.handlers';

/**
 * Set up friend routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  app.use(cookieParser());
  app.post('/api/friends/add', addFriend);
  app.post('/api/friends/request', friendRequest);
  app.get('/api/friends/worksheets', getFriendsWorksheets);
  app.get('/api/friends/names', getNames);
};