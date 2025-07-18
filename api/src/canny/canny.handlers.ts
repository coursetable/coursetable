import type express from 'express';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

import { studentBluebookSettings } from '../../drizzle/schema.js';
import type { YaliesResponse } from '../auth/auth.handlers.js';
import { YALIES_API_KEY, CANNY_KEY, FRONTEND_ENDPOINT, db } from '../config.js';
import winston from '../logging/winston.js';

// Create a JWT-signed Canny token with user info
const createCannyToken = (user: Express.User) => {
  const userData = {
    email: user.email,
    id: user.netId,
    name: `${user.firstName ?? '[unknown]'} ${user.lastName ?? '[unknown]'}`,
  };
  return jwt.sign(userData, CANNY_KEY, { algorithm: 'HS256' });
};

// Identify a user for Canny
export const cannyIdentify = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  if (!req.user) {
    res.redirect(FRONTEND_ENDPOINT);
    return;
  }

  const { netId } = req.user;

  // Make another request to Yalies.io to get most up-to-date info
  // (also done upon login, but our cookies last a while)
  try {
    const data = (await fetch('https://api.yalies.io/v2/people', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${YALIES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: {
          netid: netId,
        },
      }),
    }).then((yaliesRes) => {
      if (!yaliesRes.ok) throw new Error(yaliesRes.statusText);
      return yaliesRes.json();
    })) as YaliesResponse;
    // If no user found, do not grant access
    if (data === null || data.length === 0) {
      res.status(401).json({ error: 'USER_NO_YALIES_INFO' });
      return;
    }

    const user = data[0]!;

    await db
      .update(studentBluebookSettings)
      .set({
        // Enable evaluations if user has a school code
        evaluationsEnabled: Boolean(user.school_code),
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
      .where(eq(studentBluebookSettings.netId, netId));

    const token = createCannyToken({
      netId,
      evals: Boolean(user.school_code),
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    });

    res.redirect(`https://feedback.coursetable.com/?ssoToken=${token}`);
  } catch (err) {
    winston.error(`Yalies connection error: ${String(err)}`);
    res.redirect(FRONTEND_ENDPOINT);
  }
};
