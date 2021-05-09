/**
 * @file Handlers for generating JWT tokens for Canny.
 */
import express from 'express';

import {
  YALIES_API_KEY,
  CANNY_KEY,
  POSTHOG_CLIENT,
  FRONTEND_ENDPOINT,
} from '../config';

import { User } from '../models/student';

import winston from '../logging/winston';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a JWT-signed Canny token with user info
const createCannyToken = (user: User) => {
  const userData = {
    email: user.email,
    id: user.netId,
    name: `${user.firstName} ${user.lastName}`,
  };
  return jwt.sign(userData, CANNY_KEY, { algorithm: 'HS256' });
};

// Identify a user for Canny
export const cannyIdentify = async (
  req: express.Request,
  res: express.Response
): // eslint-disable-next-line consistent-return
Promise<void> => {
  if (!req.user) {
    return res.redirect(FRONTEND_ENDPOINT);
  }

  const { netId } = req.user;

  // Make another request to Yalies.io to get most up-to-date info
  // (also done upon login, but our cookies last a while)
  winston.info("Getting user's enrollment status from Yalies.io");
  await axios
    .post(
      'https://yalies.io/api/people',
      {
        filters: {
          netid: netId,
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
        return res.status(401).json({ success: false });
      }

      const user = data[0];

      winston.info(`Updating profile for ${netId}`);
      await prisma.studentBluebookSettings.update({
        where: {
          netId,
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

      // Update user in PostHog
      POSTHOG_CLIENT.identify({
        distinctId: netId,
        properties: {
          email: user.email,
          name: user.name,
          firstName: user.first_name,
          middleName: user.middle_name,
          lastName: user.last_name,
          upi: user.upi,
          school: user.school,
          college: user.college,
          major: user.major,
          curriculum: user.curriculum,
          year: user.year,
          organization: user.organization,
          leave: user.leave,
        },
      });

      POSTHOG_CLIENT.capture({
        distinctId: netId,
        event: 'request-canny-token',
      });

      const token = createCannyToken({
        netId,
        evals: !!user.school_code,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      });

      return res.redirect(
        `https://feedback.coursetable.com/?ssoToken=${token}`
      );
    })
    .catch((err) => {
      winston.error(`Yalies connection error: ${err}`);
      return res.redirect(FRONTEND_ENDPOINT);
    });
};
