/**
 * @file Routes for passport-CAS authentication with Yale.
 */

import express from 'express';
import passport from 'passport';

import { POSTHOG_CLIENT } from '../config';

import { casLogin } from './auth.handlers';
import winston from '../logging/winston';

/**
 * Set up authentication routes.
 * @param app: express app instance.
 */
export default async (app: express.Express): Promise<void> => {
  app.use(passport.initialize());
  app.use(passport.session());

  // Endpoint to print out user access
  app.get('/api/auth/check', (req, res) => {
    if (req.user) {
      res.json({ auth: true, id: req.user.netId, user: req.user });
    } else {
      res.json({ auth: false, id: null });
    }
  });

  // CAS portal redirects
  app.get('/api/auth/cas', casLogin);

  // Logouts
  app.get('/api/auth/logout', (req, res, next) => {
    if (req.user) {
      POSTHOG_CLIENT.capture({
        distinctId: req.user.netId,
        event: 'api-logout',
      });
    }

    winston.info(`Logging out ${req.user?.netId}`);

    req.logOut((err) => {
      if (err) {
        return next(err);
      }
    });
    return res.json({ success: true });
  });
};
