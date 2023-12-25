import type express from 'express';

import { requestChallenge, verifyChallenge } from './challenge.controllers';

/**
 * Set up challenge routes.
 * @param app: express app instance.
 */
export default (app: express.Express): void => {
  app.post('/api/challenge/request', requestChallenge);
  app.post('/api/challenge/verify', verifyChallenge);
};
