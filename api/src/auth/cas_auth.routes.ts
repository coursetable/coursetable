/// <reference path="./user.d.ts" />
import express from 'express';
import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas';
import { User } from '../models/student';
import Student from '../models/student.models';

import axios from 'axios';

import { FRONTEND_ENDPOINT, YALIES_API_KEY } from '../config';

export const passportConfig = (passport: passport.PassportStatic) => {
  passport.use(
    new CasStrategy(
      {
        version: 'CAS2.0',
        ssoBaseURL: 'https://secure.its.yale.edu/cas',
      },
      // function (profile, done) {
      //   axios
      //     .post(
      //       'https://yalies.io/api/people',
      //       {
      //         filters: {
      //           netId: profile.user,
      //         },
      //       },
      //       {
      //         headers: {
      //           Authorization: `Bearer ${YALIES_API_KEY}`,
      //           'Content-Type': 'application/json',
      //         },
      //       }
      //     )
      //     .then(({ data }) => {
      //       // if no user found, do not grant access
      //       if (data === null || data.length === 0) {
      //         return done(null, {
      //           netId: profile.user,
      //           evals: false,
      //         });
      //       }

      //       // otherwise, add the user to the cookie
      //       const user = data[0];
      //       return done(null, {
      //         netId: profile.user,
      //         evals: true,
      //         profile: user,
      //       });
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //       return done(null, {
      //         netId: profile.user,
      //         evals: false,
      //       });
      //     });
      // }
      function (profile, done) {
        done(null, {
          netId: profile.user,
        });
      }
    )
  );

  passport.serializeUser(function (user: User, done) {
    return done(null, user.netId);
  });

  // when deserializing, ping Yalies to get the user's profile
  passport.deserializeUser(function (netId: string, done) {
    // Student.getEvalsStatus(netId, (statusCode, err, hasEvals) => {
    //   return done(null, { netId, evals: hasEvals });
    // });
    // return done(null, { netId, evals: true });
    const user: User = {
      netId,
      evals: true,
    };
    done(null, user);
  });
};

const postAuth = (req: express.Request, res: express.Response): void => {
  const redirect = req.query['redirect'] as string | undefined;
  if (redirect && !redirect.startsWith('//')) {
    if (redirect.startsWith('/')) {
      return res.redirect(`${FRONTEND_ENDPOINT}${redirect}`);
    }
    // We prefix this with a slash to avoid an open redirect vulnerability.
    return res.redirect(`${FRONTEND_ENDPOINT}/${redirect}`);
  }

  // If no redirect is provided, simply redirect to the auth status.
  return res.redirect(`${FRONTEND_ENDPOINT}/catalog`);
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

      Student.findOrCreate(user.netId, () => {
        return postAuth(req, res);
      });
    });
  })(req, res, next);
};

// middleware function for requiring cas authentication
export const casCheck = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log('USER', req.user);
  if (req.user) {
    // add headers for legacy API compatibility
    req.headers['x-coursetable-authd'] = 'true';
    req.headers['x-coursetable-netid'] = req.user.netId;

    return next();
  }
  return next(new Error('CAS auth but no user'));
};

// actual authentication routes
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

  app.get('/api/auth/logout', (req, res) => {
    req.logOut();
    return res.json({ success: true });
  });
};
