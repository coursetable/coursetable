/**
 * @file Handlers for generating JWT tokens for Canny.
 */

import type express from 'express';
import jwt from 'jsonwebtoken';
import {
  YALIES_API_KEY,
  CANNY_KEY,
  FRONTEND_ENDPOINT,
  prisma,
} from '../config';
import type { YaliesResponse } from '../auth/auth.handlers';
import winston from '../logging/winston';

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
  winston.info("Getting user's enrollment status from Yalies.io");
  try {
    const data = (await fetch('https://yalies.io/api/people', {
      headers: {
        Authorization: `Bearer ${YALIES_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: {
          netid: netId,
        },
      }),
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })) as YaliesResponse;
    // If no user found, do not grant access
    if (data === null || data.length === 0) {
      res.status(401).json({ success: false });
      return;
    }

    const [user] = data;

    winston.info(`Updating profile for ${netId}`);
    await prisma.studentBluebookSettings.update({
      where: {
        netId,
      },
      data: {
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
      },
    });

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
