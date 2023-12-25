/**
 * @file Routes for handling friends.
 */

import type express from 'express';
import cookieParser from 'cookie-parser';

import {
  addFriend,
  removeFriend,
  getFriendsWorksheets,
  friendRequest,
  getRequestsForFriend,
  getNames,
} from './friends.handlers';

/**
 * Set up friend routes.
 * @param app: express app instance.
 */
export default (app: express.Express): void => {
  app.use(cookieParser());
  app.get('/api/friends/add', addFriend);
  app.get('/api/friends/remove', removeFriend);
  app.get('/api/friends/request', friendRequest);
  app.get('/api/friends/getRequests', getRequestsForFriend);
  app.get('/api/friends/worksheets', getFriendsWorksheets);
  app.get('/api/friends/names', getNames);
};
