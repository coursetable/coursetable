/**
 * @file Handlers for passport-CAS authentication with Yale.
 */

import express from 'express';
import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas';
import { User } from '../models/student';

import winston from '../logging/winston';

import axios from 'axios';

import { FRONTEND_ENDPOINT, YALIES_API_KEY } from '../config';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Passport configuration for authentication
 * @param passportInstance: passport instance.
 */
export const passportConfig = async (
  passportInstance: passport.PassportStatic
): Promise<void> => {
  // strategy for integrating with CAS
  passportInstance.use(
    new CasStrategy(
      {
        version: 'CAS2.0',
        ssoBaseURL: 'https://secure.its.yale.edu/cas',
      },
      async (profile, done) => {
        // Create or update user's profile
        winston.info("Creating user's profile");
        await prisma.studentBluebookSettings.upsert({
          where: {
            netId: profile.user,
          },
          update: {},
          create: {
            netId: profile.user,
            facebookLastUpdated: 0,
            noticeLastSeen: 0,
            timesNoticeSeen: 0,
            evaluationsEnabled: false,
          },
        });

        winston.info("Getting user's enrollment status from Yalies.io");
        axios
          .post(
            'https://yalies.io/api/people',
            {
              filters: {
                netid: profile.user,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${YALIES_API_KEY}`,
                'Content-Type': 'application/json',
              },
            }
          )
          .then(async ({ data }) => {
            // if no user found, do not grant access
            if (data === null || data.length === 0) {
              return done(null, {
                netId: profile.user,
                evals: false,
              });
            }

            const user = data[0];

            // otherwise, add the user to the cookie if school is specified
            if (user.school_code) {
              winston.info(`Enabling evaluations for ${profile.user}`);
              await prisma.studentBluebookSettings.update({
                where: {
                  netId: profile.user,
                },
                data: { evaluationsEnabled: true },
              });
              return done(null, {
                netId: profile.user,
                evals: true,
              });
            }

            // otherwise, user isn't a Yale student
            return done(null, { netId: profile.user, evals: false });
          })
          .catch((err) => {
            winston.error(`Yalies connection error: ${err}`);
            return done(null, {
              netId: profile.user,
              evals: false,
            });
          });
      }
    )
  );

  /**
   * Serialization function for identifying a user.
   * @param user: user to encode.
   * @param done: callback function to be executed after serialization.
   */
  passport.serializeUser((user: User, done): void => {
    winston.info(`Serializing user ${user}`);
    return done(null, user.netId);
  });

  /**
   * Deserialization function for identifying a user.
   * @param netId: netId of user to get info for.
   * @param done: callback function to be executed after deserialization.
   */
  passport.deserializeUser((netId: string, done): void => {
    winston.info(`Deserializing user ${netId}`);
    prisma.studentBluebookSettings
      .findUnique({
        where: {
          netId,
        },
      })
      .then((student) => {
        done(null, { netId, evals: !!student?.evaluationsEnabled });
      });
  });
};

/**
 * Redirects to be executed after login.
 * @param req: express request.
 * @param res: express response.
 */
const postAuth = (req: express.Request, res: express.Response): void => {
  winston.info('Executing post-authentication redirect');
  let redirect = req.query.redirect as string | undefined;
  if (redirect && !redirect.startsWith('//')) {
    winston.info(`Redirecting to ${redirect}`);
    // prefix the redirect with a slash to avoid an open redirect vulnerability.
    if (!redirect.startsWith('/')) {
      redirect = `/${redirect}`;
    }
    return res.redirect(`${FRONTEND_ENDPOINT}${redirect}`);
  }

  winston.info(`Redirecting to /catalog fallback`);
  // If no redirect is provided, simply redirect to the auth status.
  return res.redirect(`${FRONTEND_ENDPOINT}/catalog`);
};

/**
 * Login handler.
 * @param req: express request.
 * @param res: express response.
 * @param next: express next function.
 */
export const casLogin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  winston.info('Logging in with CAS');
  // Authenticate with passport
  passport.authenticate('cas', (casError, user) => {
    // handle auth errors or missing users
    if (casError) {
      return next(casError);
    }
    if (!user) {
      return next(new Error('CAS auth but no user'));
    }

    // log in the user
    winston.info(`"Logging in ${user}`);
    return req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      // redirect if authentication successful
      return postAuth(req, res);
    });
  })(req, res, next);
};

/**
 * Middleware for requiring user account to be present.
 * @param req: express request.
 * @param res: express response.
 * @param next: express next function.
 */
export const authBasic = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  winston.info('Intercepting basic authentication');
  if (req.user) {
    // add headers for legacy API compatibility
    req.headers['x-coursetable-authd'] = 'true';
    req.headers['x-coursetable-netid'] = req.user.netId;

    return next();
  }
  return next(new Error('CAS auth but no user'));
};

/**
 * Middleware for requiring user account to be present as well as evaluations access.
 * @param req: express request.
 * @param res: express response.
 * @param next: express next function.
 */
export const authWithEvals = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  winston.info('Intercepting with-evals authentication');
  if (req.user && req.user.evals) {
    // add headers for legacy API compatibility
    req.headers['x-coursetable-authd'] = 'true';
    req.headers['x-coursetable-netid'] = req.user.netId;

    return next();
  }
  return next(new Error('CAS auth but no user / no evals access'));
};
