import type express from 'express';

import { casLogin } from './auth.handlers.js';
import winston from '../logging/winston.js';

export default (app: express.Express): void => {
  app.get('/api/auth/check', (req, res) => {
    if (req.user)
      res.json({ auth: true, netId: req.user.netId, user: req.user });
    else res.json({ auth: false, netId: null, user: null });
  });

  app.get('/api/auth/cas', casLogin);

  app.post('/api/auth/logout', (req, res, next) => {
    if (!req.user) return res.status(400).json({ error: 'USER_NOT_FOUND' });
    winston.info(`Logging out ${req.user.netId}`);

    req.logOut((err) => {
      if (err) next(err);
    });
    return res.sendStatus(200);
  });
};
