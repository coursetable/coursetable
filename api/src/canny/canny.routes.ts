/**
 * @file Routes for getting Canny authentication info.
 */

import type express from 'express';

import { cannyIdentify } from './canny.handlers';

/**
 * Set up Canny routes.
 * @param app: express app instance.
 */
export default (app: express.Express): void => {
  app.get('/api/canny/board', cannyIdentify);
};
