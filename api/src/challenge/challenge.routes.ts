import type express from 'express';
import asyncHandler from 'express-async-handler';

import { requestChallenge, verifyChallenge } from './challenge.controllers';

/**
 * Set up challenge routes.
 * @param app: express app instance.
 */
export default (app: express.Express): void => {
  app.post('/api/challenge/request', asyncHandler(requestChallenge));
  app.post('/api/challenge/verify', asyncHandler(verifyChallenge));
};
