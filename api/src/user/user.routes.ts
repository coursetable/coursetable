import express from 'express';

import cookieParser from 'cookie-parser';

import { getUserWorksheet } from './user.handlers';

// actual authentication routes
export default async (app: express.Express) => {
  app.use(cookieParser());
  app.get('/api/user/worksheets', getUserWorksheet);
};
