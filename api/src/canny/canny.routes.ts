import type express from 'express';
import asyncHandler from 'express-async-handler';

import { cannyIdentify } from './canny.handlers.js';

/**
 * Set up Canny routes.
 * @param app: express app instance.
 */
export default (app: express.Express): void => {
  app.get('/api/canny/board', asyncHandler(cannyIdentify));
};
