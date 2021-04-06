/**
 * @file Handlers for generating JWT tokens for Canny.
 */
import express from 'express';

import { YALIES_API_KEY, CANNY_KEY } from '../config';

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
): Promise<express.Response> => {
  if (!req.user) {
    return res.status(401).json({ success: false });
  }

  const { netId } = req.user;

  // Make another request to Yalies.io to get most up-to-date info
  // (also done upon login, but our cookies last a while)
  winston.info("Getting user's enrollment status from Yalies.io");
  return axios
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
      const token = createCannyToken({
        netId,
        evals: !!user.school_code,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      });

      return res.json({ success: true, token });
    })
    .catch((err) => {
      winston.error(`Yalies connection error: ${err}`);
      return res.status(500).json({ success: false });
    });
};
