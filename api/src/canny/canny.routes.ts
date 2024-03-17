import type express from 'express';
import asyncHandler from 'express-async-handler';

import { cannyIdentify } from './canny.handlers.js';

export default (app: express.Express): void => {
  app.get('/api/canny/board', asyncHandler(cannyIdentify));
};
