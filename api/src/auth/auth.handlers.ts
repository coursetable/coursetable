import type express from 'express';
import { Strategy as CasStrategy } from '@coursetable/passport-cas';
import { eq } from 'drizzle-orm';
import passport from 'passport';

import { studentBluebookSettings } from '../../drizzle/schema.js';
import {
  YALIES_API_KEY,
  db,
  FRONTEND_ENDPOINT,
  COURSETABLE_ORIGINS,
} from '../config.js';
import winston from '../logging/winston.js';

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

        const [existingUser] = await db
          .insert(studentBluebookSettings)
          .values({
            netId: profile.user,
            evaluationsEnabled: false,
          })
          .onConflictDoNothing()
          .returning();

        winston.info("Getting user's enrollment status from Yalies.io");
        const user = {
          netId: profile.user,
          // If we already have evaluations enabled in DB, never disable it
          // TODO: temporary; we should have three states, manually enabled for
          // faculty (never revoke), automatically synced from Yalies
          // (expiring based on Yalies data), and disabled
          evals: Boolean(existingUser?.evaluationsEnabled),
          email: existingUser?.email ?? null,
          firstName: existingUser?.firstName ?? null,
          lastName: existingUser?.lastName ?? null,
        };
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
          // If no user found, only use existing data
          if (data === null || data.length === 0) {
            done(null, user);
            return;
          }
          const yaliesUserData = data[0]!;
          // Enable evaluations if user has a school code
          // or is a member of an approved organization (for faculty).
          // also leave evaluations enabled if the user already has access.
          user.evals ||=
            Boolean(yaliesUserData.school_code) ||
            ALLOWED_ORG_CODES.includes(yaliesUserData.organization_code);
          // TODO: these should be customizable by the user via profile page
          user.firstName = yaliesUserData.first_name ?? user.firstName;
          user.lastName = yaliesUserData.last_name ?? user.lastName;
          user.email = yaliesUserData.email ?? user.email;

          winston.info(`Updating evaluations for ${profile.user}`);

          await db
            .update(studentBluebookSettings)
            .set({
              evaluationsEnabled: user.evals,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              // These are not sent in the API response so we can transparently
              // use Yalies data, but in the future they should be customizable
              upi: yaliesUserData.upi,
              school: yaliesUserData.school,
              year: yaliesUserData.year,
              college: yaliesUserData.college,
              major: yaliesUserData.major,
              curriculum: yaliesUserData.curriculum,
            })
            .where(eq(studentBluebookSettings.netId, profile.user));
        } catch (err) {
          winston.error(`Yalies connection error: ${String(err)}`);
        }
        done(null, user);
      },
    ),
  );

  passport.serializeUser((user, done) => {
    winston.info(`Serializing user ${user.netId}`);
    done(null, user.netId);
  });

  passport.deserializeUser(async (sessionKey: string | null, done) => {
    if (!sessionKey) {
      // Return `null`/`false` to denote no user; don't use `undefined`
      // https://github.com/jaredhanson/passport/pull/975
      done(null, null);
      return;
    }
    const netId = String(sessionKey);
    winston.info(`Deserializing user ${netId}`);
    const [student] = await db
      .selectDistinctOn([studentBluebookSettings.netId])
      .from(studentBluebookSettings)
      .where(eq(studentBluebookSettings.netId, netId));
    if (!student) {
      done(null, null);
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

const postAuth = (req: express.Request, res: express.Response): void => {
  winston.info('Executing post-authentication redirect');
  const redirect = req.query.redirect as string | undefined;
  if (!redirect) {
    winston.error('No redirect provided');
    res.redirect(FRONTEND_ENDPOINT);
    return;
  }
  try {
    const parsed = new URL(redirect, FRONTEND_ENDPOINT);
    if (
      COURSETABLE_ORIGINS.some(
        (x) =>
          (typeof x === 'string' && parsed.origin === x) ||
          (x instanceof RegExp && x.test(parsed.origin)),
      )
    ) {
      res.redirect(parsed.toString());
      return;
    }
  } catch {}
  winston.error('Redirect not in allowed origins');
  res.redirect(FRONTEND_ENDPOINT);
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
