import type express from 'express';

import { casLogin } from './auth.handlers';
import winston from '../logging/winston';

/**
 * Set up authentication routes.
 * @param app: express app instance.
 */
export default (app: express.Express): void => {
  // Endpoint to print out user access
  app.get('/api/auth/check', (req, res) => {
    if (req.user) res.json({ auth: true, id: req.user.netId, user: req.user });
    else res.json({ auth: false, id: null, user: null });
  });

  // CAS portal redirects
  app.get('/api/auth/cas', casLogin);

  // Logouts
  app.get('/api/auth/logout', (req, res, next) => {
    if (!req.user) return res.status(400).json({ error: 'USER_NOT_FOUND' });
    winston.info(`Logging out ${req.user.netId}`);

    req.logOut((err) => {
      if (err) next(err);
    });
    return res.sendStatus(200);
  });
};
