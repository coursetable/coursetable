import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  addFriend,
  removeFriend,
  getFriendsWorksheets,
  requestAddFriend,
  getRequestsForFriend,
  getNames,
} from './friends.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/friends/*', authBasic);
  app.post('/api/friends/add', asyncHandler(addFriend));
  app.post('/api/friends/remove', asyncHandler(removeFriend));
  app.post('/api/friends/request', asyncHandler(requestAddFriend));
  app.get('/api/friends/getRequests', asyncHandler(getRequestsForFriend));
  app.get('/api/friends/worksheets', asyncHandler(getFriendsWorksheets));
  app.get('/api/friends/names', asyncHandler(getNames));
};
