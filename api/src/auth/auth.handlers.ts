/**
 * @file Handlers for passport-CAS authentication with Yale.
 */

import type express from 'express';
import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas';

import winston from '../logging/winston';
import { YALIES_API_KEY, prisma } from '../config';

// TODO: we should not be handwriting this. https://github.com/Yalies/api/issues/216
export type YaliesResponse =
  | {
      organization_code?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      upi?: number;
      school?: string;
      year?: number;
      college?: string;
      major?: string;
      curriculum?: string;
      school_code?: string;
    }[]
  | null;

// Codes for allowed organizations (to give faculty access to the site)
const ALLOWED_ORG_CODES: unknown[] = [
  'MED', // Medical school
  'FAS', // Faculty of arts and sciences
  'SOM', // School of medicine
  'LAW', // Law school
  'NUR', // Nursing school
  'ENV', // School of the environment
  'SPH', // Public health
  'DIV', // Divinity school
  'DRA', // Drama
  'ARC', // Architecture
  'ART', // Art
  'MAC', // MacMillan center
  'SCM', // Music
  'ISM', // Sacred music
  'JAC', // Jackson institute
  'GRA', // Graduate school
];

const extractHostname = (url: string): string => {
  let hostname = '';
  // Find & remove protocol (http, ftp, etc.) and get hostname

  if (url.includes('//')) [, , hostname] = url.split('/');
  else [hostname] = url.split('/');

  // Find & remove port number
  [hostname] = hostname.split(':');
  // Find & remove "?"
  [hostname] = hostname.split('?');

  return hostname;
};

/**
 * Passport configuration for authentication
 * @param passportInstance: passport instance.
 */
export const passportConfig = (
  passportInstance: passport.PassportStatic,
): void => {
  // Strategy for integrating with CAS
  passportInstance.use(
    new CasStrategy(
      {
        version: 'CAS2.0',
        ssoBaseURL: 'https://secure.its.yale.edu/cas',
      },
      async (profile, done) => {
        // Create or update user's profile
        winston.info("Creating user's profile");
        const existingUser = await prisma.studentBluebookSettings.upsert({
          where: {
            netId: profile.user,
          },
          update: {},
          create: {
            netId: profile.user,
            evaluationsEnabled: false,
          },
        });

        winston.info("Getting user's enrollment status from Yalies.io");
        try {
          const data = (await fetch('https://yalies.io/api/people', {
            headers: {
              Authorization: `Bearer ${YALIES_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filters: {
                netid: profile.user,
              },
            }),
          }).then((res) => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
          })) as YaliesResponse;
          // If no user found, do not grant access
          if (data === null || data.length === 0) {
            done(null, {
              netId: profile.user,
              evals: false,
            });
            return;
          }

          const [user] = data;

          // Enable evaluations if user has a school code
          // or is a member of an approved organization (for faculty).
          // also leave evaluations enabled if the user already has access.
          const enableEvals =
            existingUser.evaluationsEnabled ||
            Boolean(user.school_code) ||
            ALLOWED_ORG_CODES.includes(user.organization_code);

          winston.info(`Updating evaluations for ${profile.user}`);
          await prisma.studentBluebookSettings.update({
            where: {
              netId: profile.user,
            },
            data: {
              evaluationsEnabled: enableEvals,
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              upi: user.upi,
              school: user.school,
              year: user.year,
              college: user.college,
              major: user.major,
              curriculum: user.curriculum,
            },
          });

          done(null, {
            netId: profile.user,
            evals: enableEvals,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
          });
        } catch (err) {
          winston.error(`Yalies connection error: ${String(err)}`);
          done(null, {
            netId: profile.user,
            evals: false,
          });
        }
      },
    ),
  );

  /**
   * Serialization function for identifying a user.
   * @param user: user to encode.
   * @param done: callback function to be executed after serialization.
   */
  passport.serializeUser((user, done) => {
    winston.info(`Serializing user ${user.netId}`);
    done(null, user.netId);
  });

  /**
   * Deserialization function for identifying a user.
   * @param netId: netId of user to get info for.
   * @param done: callback function to be executed after deserialization.
   */
  passport.deserializeUser(async (sessionKey: unknown, done) => {
    if (!sessionKey) {
      // Can this happen?
      done(null, undefined);
      return;
    }
    const netId = String(sessionKey);
    winston.info(`Deserializing user ${netId}`);
    const student = await prisma.studentBluebookSettings.findUnique({
      where: {
        netId,
      },
    });
    if (!student) {
      done(null, undefined);
      return;
    }
    done(null, {
      netId,
      evals: Boolean(student.evaluationsEnabled),
      // Convert nulls to undefined
      email: student.email ?? undefined,
      firstName: student.firstName ?? undefined,
      lastName: student.lastName ?? undefined,
    });
  });
};

const ALLOWED_ORIGINS = ['localhost', 'coursetable.com'];
/**
 * Redirects to be executed after login.
 * @param req: express request.
 * @param res: express response.
 */
const postAuth = (req: express.Request, res: express.Response): void => {
  winston.info('Executing post-authentication redirect');
  const redirect = req.query.redirect as string | undefined;

  const hostName = extractHostname(redirect ?? 'coursetable.com/catalog');

  if (redirect && !redirect.startsWith('//')) {
    winston.info(`Redirecting to ${redirect}`);
    // Prefix the redirect with a slash to avoid an open redirect vulnerability.
    if (
      ALLOWED_ORIGINS.includes(hostName) ||
      hostName.endsWith('.coursetable.com') ||
      (hostName.endsWith('-coursetable.vercel.app') &&
        hostName.startsWith('coursetable-'))
    ) {
      res.redirect(redirect);
      return;
    }

    winston.error('Redirect not in allowed origins');
    res.redirect('https://coursetable.com');
    return;
  }
  winston.error(`No redirect provided`);
  res.redirect('https://coursetable.com');
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
  next: express.NextFunction,
): void => {
  winston.info('Logging in with CAS');
  // Authenticate with passport
  (
    passport.authenticate(
      'cas',
      (casError: Error | undefined, user: Express.User | undefined) => {
        // Handle auth errors or missing users
        if (casError) {
          next(casError);
          return;
        }

        if (!user) {
          next(new Error('CAS auth but no user'));
          return;
        }

        // Log in the user
        winston.info(`"Logging in ${user.netId}`);
        req.logIn(user, (loginError) => {
          if (loginError) {
            next(loginError);
            return;
          }

          // Redirect if authentication successful
          postAuth(req, res);
        });
      },
    ) as express.Handler
  )(req, res, next);
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
  next: express.NextFunction,
): void => {
  winston.info('Intercepting basic authentication');
  if (!req.user) {
    res.status(401).json({ error: 'USER_NOT_FOUND' });
    return;
  }
  // Add headers for legacy API compatibility
  req.headers['x-coursetable-authd'] = 'true';
  req.headers['x-coursetable-netid'] = req.user.netId;
  next();
};

/**
 * Middleware for requiring user account to be present as well as evals access.
 * @param req: express request.
 * @param res: express response.
 * @param next: express next function.
 */
export const authWithEvals = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  winston.info('Intercepting with-evals authentication');
  if (!req.user) {
    res.status(401).json({ error: 'USER_NOT_FOUND' });
    return;
  } else if (!req.user.evals) {
    res.status(401).json({ error: 'USER_NO_EVALS' });
    return;
  }
  // Add headers for legacy API compatibility
  req.headers['x-coursetable-authd'] = 'true';
  req.headers['x-coursetable-netid'] = req.user.netId;
  next();
};
