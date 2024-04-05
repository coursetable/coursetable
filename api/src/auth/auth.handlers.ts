import type express from 'express';
import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas';
import { eq } from 'drizzle-orm';

import winston from '../logging/winston.js';
import { YALIES_API_KEY, db } from '../config.js';
import { studentBluebookSettings } from '../../drizzle/schema.js';

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

  if (url.includes('//')) hostname = url.split('/')[2]!;
  else hostname = url.split('/')[0]!;

  // Find & remove port number
  hostname = hostname.split(':')[0]!;
  // Find & remove "?"
  hostname = hostname.split('?')[0]!;

  return hostname;
};

export const passportConfig = (
  passportInstance: passport.PassportStatic,
): void => {
  passportInstance.use(
    new CasStrategy(
      {
        version: 'CAS2.0',
        ssoBaseURL: 'https://secure.its.yale.edu/cas',
      },
      async (profile, done) => {
        // Create or update user's profile
        winston.info("Creating user's profile");

        const existingUser = (
          await db
            .insert(studentBluebookSettings)
            .values({
              netId: profile.user,
              evaluationsEnabled: false,
            })
            .onConflictDoNothing()
            .returning()
        )[0]!;

        winston.info("Getting user's enrollment status from Yalies.io");
        try {
          const data = (await fetch('https://yalies.io/api/people', {
            method: 'POST',
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

          const user = data[0]!;

          // Enable evaluations if user has a school code
          // or is a member of an approved organization (for faculty).
          // also leave evaluations enabled if the user already has access.
          const enableEvals =
            existingUser.evaluationsEnabled ||
            Boolean(user.school_code) ||
            ALLOWED_ORG_CODES.includes(user.organization_code);

          winston.info(`Updating evaluations for ${profile.user}`);

          await db
            .update(studentBluebookSettings)
            .set({
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
            })
            .where(eq(studentBluebookSettings.netId, profile.user));

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

  passport.serializeUser((user, done) => {
    winston.info(`Serializing user ${user.netId}`);
    done(null, user.netId);
  });

  passport.deserializeUser(async (sessionKey: unknown, done) => {
    if (!sessionKey) {
      // Return `null`/`false` to denote no user; don't use `undefined`
      // https://github.com/jaredhanson/passport/pull/975
      done(null, null);
      return;
    }
    const netId = String(sessionKey);
    winston.info(`Deserializing user ${netId}`);
    const student = await db
      .selectDistinctOn([studentBluebookSettings.netId])
      .from(studentBluebookSettings)
      .where(eq(studentBluebookSettings.netId, netId));
    if (!student.length) {
      done(null, null);
      return;
    }
    done(null, {
      netId,
      evals: Boolean(student[0]!.evaluationsEnabled),
      // Convert nulls to undefined
      email: student[0]!.email ?? undefined,
      firstName: student[0]!.firstName ?? undefined,
      lastName: student[0]!.lastName ?? undefined,
    });
  });
};

const ALLOWED_ORIGINS = ['localhost', 'coursetable.com'];

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

export const casLogin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {
  winston.info('Logging in with CAS');
  (
    passport.authenticate(
      'cas',
      (casError: Error | undefined, user: Express.User | undefined) => {
        if (casError) {
          next(casError);
          return;
        }

        if (!user) {
          next(new Error('CAS auth but no user'));
          return;
        }

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
