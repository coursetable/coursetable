/**
 * @file Routes for linking accounts with Facebook.
 */

import express from 'express';
import cookieParser from 'cookie-parser';

import {
  updateFriends,
  getFriendsWorksheets,
  disconnectFacebook,
} from './facebook.handlers';

/**
 * Set up Facebook routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  app.use(cookieParser());
  app.post('/api/facebook/update', updateFriends);
  app.post('/api/facebook/disconnect', disconnectFacebook);
  app.get('/api/facebook/worksheets', getFriendsWorksheets);
};
