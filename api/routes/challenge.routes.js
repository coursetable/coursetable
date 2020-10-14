import {
  verifyHeaders,
  requestChallenge,
  verifyChallenge,
} from '../controllers/challenge.controllers.js';

export default app => {
  app.get('/api/challenge/request', verifyHeaders, requestChallenge);
  app.post('/api/challenge/verify', verifyChallenge);
};
