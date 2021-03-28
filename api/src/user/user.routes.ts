import express from 'express';

import cookieParser from 'cookie-parser';

import { toggleBookmark, getUserWorksheet } from './user.handlers';

// actual authentication routes
export default async (app: express.Express): Promise<void> => {
  app.use(cookieParser());
  app.post('/api/user/toggleBookmark', toggleBookmark);
  app.get('/api/user/worksheets', getUserWorksheet);
};
