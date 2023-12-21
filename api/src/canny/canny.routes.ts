/**
 * @file Routes for getting Canny authentication info.
 */

import type express from 'express';

import { cannyIdentify } from './canny.handlers';

/**
 * Set up Canny routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  app.get('/api/canny/board', cannyIdentify);
};
