/**
 * @file Handlers for generating JWT tokens for Canny.
 */
import express from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/student';

var PrivateKey = 'd508c798-d0fd-6528-3c55-35a7ef90203a';

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
): Promise<express.Response> => {};
