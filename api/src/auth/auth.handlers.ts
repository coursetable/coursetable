/**
 * @file Handlers for passport-CAS authentication with Yale.
 */

import express from 'express';
import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas';
import { User } from '../models/student';

import winston from '../logging/winston';

import axios from 'axios';

import { YALIES_API_KEY } from '../config';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const extractHostname = (url: string): string => {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};

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

            winston.info(`Updating evaluations for ${profile.user}`);
            await prisma.studentBluebookSettings.update({
              where: {
                netId: profile.user,
              },
              data: {
                // enable evaluations if user has a school code
                evaluationsEnabled: !!user.school_code,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                upi: user.upi,
                school: user.school,
                year: user.year,
                college: user.college,
                major: user.major,
                curriculum: user.curriculum,
              },
            });
            return done(null, {
              netId: profile.user,
              evals: !!user.school_code,
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
            });
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
  passport.deserializeUser(
    async (netId: string, done): Promise<void> => {
      winston.info(`Deserializing user ${netId}`);
      await prisma.studentBluebookSettings
        .findUnique({
          where: {
            netId,
          },
        })
        .then((student) => {
          done(null, {
            netId,
            evals: !!student?.evaluationsEnabled,
            // convert nulls to undefined
            email: student?.email || undefined,
            firstName: student?.first_name || undefined,
            lastName: student?.last_name || undefined,
          });
        });
    }
  );
};

const ALLOWED_ORIGINS = ['localhost', 'coursetable.com'];
/**
 * Redirects to be executed after login.
 * @param req: express request.
 * @param res: express response.
 */
const postAuth = (req: express.Request, res: express.Response): void => {
  winston.info('Executing post-authentication redirect');
  let redirect = req.query.redirect as string | undefined;

  const hostName = extractHostname(redirect || 'coursetable.com/catalog');

  if (redirect && !redirect.startsWith('//')) {
    winston.info(`Redirecting to ${redirect}`);
    // prefix the redirect with a slash to avoid an open redirect vulnerability.
    if (
      ALLOWED_ORIGINS.includes(hostName) ||
      hostName.endsWith('.coursetable.com')
    ) {
      return res.redirect(redirect);
    } else {
      winston.error('Redirect not in allowed origins');
      return res.redirect('https://coursetable.com');
    }
  }
  winston.error(`No redirect provided`);
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
