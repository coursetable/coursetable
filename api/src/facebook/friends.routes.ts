/**
 * @file Routes for handling friends.
 */

import express from 'express';
import cookieParser from 'cookie-parser';

import {
  addFriend,
  removeFriend,
  getFriendsWorksheets,
  friendRequest,
  resolveFriendRequest,
  getRequestsForFriend,
  getNames,
} from './friends.handlers';

/**
 * Set up friend routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  app.use(cookieParser());
  app.get('/api/friends/add', addFriend);
  app.get('/api/friends/remove', removeFriend);
  app.get('/api/friends/request', friendRequest);
  app.get('/api/friends/resolveRequest', resolveFriendRequest);
  app.get('/api/friends/getRequests', getRequestsForFriend);
  app.get('/api/friends/worksheets', getFriendsWorksheets);
  app.get('/api/friends/names', getNames);
};
