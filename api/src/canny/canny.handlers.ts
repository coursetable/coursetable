/**
 * @file Handlers for generating JWT tokens for Canny.
 */
import express from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/student';

var PrivateKey = 'd508c798-d0fd-6528-3c55-35a7ef90203a';

import winston from '../logging/winston';

import axios from 'axios';

import { YALIES_API_KEY } from '../config';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createCannyToken = (user: User) => {
  var userData = {
    email: user.email,
    id: user.netId,
    name: `${user.firstName} ${user.lastName}`,
  };
  return jwt.sign(userData, PrivateKey, { algorithm: 'HS256' });
};

export const cannyIdentify = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  if (!req.user) {
    return res.status(401).json({ success: false });
  }

  const { netId } = req.user;

  winston.info("Getting user's enrollment status from Yalies.io");
  return await axios
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
