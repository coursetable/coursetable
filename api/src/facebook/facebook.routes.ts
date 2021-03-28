import express from 'express';

import cookieParser from 'cookie-parser';

import { updateFriends, getFriendsWorksheets } from './facebook.handlers';

/**
 * Set up Facebook routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  app.use(cookieParser());
  app.post('/api/facebook/update', updateFriends);
  app.get('/api/facebook/worksheets', getFriendsWorksheets);
};
