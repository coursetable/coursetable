import {
  requestChallenge,
  verifyChallenge,
} from '../controllers/challenge.controllers.js';

export default app => {
  app.get('/api/challenge/request', requestChallenge);
  app.post('/api/challenge/verify', verifyChallenge);
};
