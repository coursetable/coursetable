/**
 * @file Routes for linking accounts with Facebook.
 */

import express from 'express';

import { cannyIdentify } from './canny.handlers';

/**
 * Set up Facebook routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  app.get('/api/canny/token', cannyIdentify);
};
