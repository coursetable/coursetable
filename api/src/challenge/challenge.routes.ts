import express from 'express';

import { requestChallenge, verifyChallenge } from './challenge.controllers.js';

/**
 * Set up challenge routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  app.get('/api/challenge/request', requestChallenge);
  app.post('/api/challenge/verify', verifyChallenge);
};
