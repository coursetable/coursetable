import { requestChallenge, verifyChallenge } from './challenge.controllers.js';

import { verifyNetID } from '../auth/utils';

export default async (app) => {
  app.get('/api/challenge/request', verifyNetID, requestChallenge);
  app.post('/api/challenge/verify', verifyChallenge);
};
