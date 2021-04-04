/**
 * @file Routes for passport-CAS authentication with Yale.
 */

import express from 'express';
import passport from 'passport';

import { casLogin } from './auth.handlers';

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
  app.get('/api/auth/logout', (req, res) => {
    req.logOut();
    return res.json({ success: true });
  });
};
