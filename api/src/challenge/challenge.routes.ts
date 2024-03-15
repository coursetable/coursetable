import type express from 'express';
import asyncHandler from 'express-async-handler';

import { requestChallenge, verifyChallenge } from './challenge.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

/**
 * Set up challenge routes.
 * @param app: express app instance.
 */
export default (app: express.Express): void => {
  app.use('/api/challenge/*', authBasic);
  app.get('/api/challenge/request', asyncHandler(requestChallenge));
  app.post('/api/challenge/verify', asyncHandler(verifyChallenge));
};
