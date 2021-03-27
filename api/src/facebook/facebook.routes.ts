import express from 'express';

import cookieParser from 'cookie-parser';

import { updateFriends } from './facebook.handlers';

// actual authentication routes
export default async (app: express.Express) => {
  app.use(cookieParser());
  app.post('/api/facebook/friends', updateFriends);
};
