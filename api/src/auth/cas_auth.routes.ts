/// <reference path="./user.d.ts" />
import express from 'express';
import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas';
import { User } from '../models/student';

passport.use(
  new CasStrategy(
    {
      version: 'CAS2.0',
      ssoBaseURL: 'https://secure.its.yale.edu/cas',
    },
    function (profile, done) {
      done(null, {
        netId: profile.user,
      });
    }
  )
);

passport.serializeUser(function (user: User, done) {
  done(null, user.netId);
});

passport.deserializeUser(function (netId: string, done) {
  const user: User = {
    netId,
  };
  done(null, user);
});

const postAuth = (req: express.Request, res: express.Response): void => {
  const redirect = req.query['redirect'] as string | undefined;
  if (redirect && !redirect.startsWith('//')) {
    if (redirect.startsWith('/')) {
      return res.redirect(redirect);
    }
    // We prefix this with a slash to avoid an open redirect vulnerability.
    return res.redirect(`/${redirect}`);
  }

  // If no redirect is provided, simply redirect to the auth status.
  return res.redirect('/catalog');
};

const casLogin = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  passport.authenticate('cas', function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('CAS auth but no user'));
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      return postAuth(req, res);
    });
  })(req, res, next);
};

export default async (app: express.Express) => {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/api/auth/check', (req, res) => {
    if (req.user) {
      res.json({ auth: true, id: req.user.netId, user: req.user });
    } else {
      res.json({ auth: false, id: null });
    }
  });

  app.get('/api/auth/cas', casLogin);

  app.post('/api/auth/logout', (req, res) => {
    req.logOut();
    return res.json({ success: true });
  });
};
