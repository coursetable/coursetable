import {
  requestChallenge,
  verifyChallenge,
} from '../controllers/challenge.controllers.js';

import { verifyNetID } from '../utils.js';

export default (app) => {
  app.get('/api/challenge/request', verifyNetID, requestChallenge);
  app.post('/api/challenge/verify', verifyChallenge);
};
