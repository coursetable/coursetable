/// <reference path="../auth/user.d.ts" />

import express from 'express';
import axios from 'axios';

import cookieParser from 'cookie-parser';

import { FACEBOOK_API_ENDPOINT } from '../config';

import winston from '../logging/winston';

const FRIEND_FIELDS = 'id,name,first_name,middle_name,last_name';
const FRIENDS_PAGE_LIMIT = 500;

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function asyncForEach(
  array: any[],
  callback: (item: any, index: number, array: any[]) => void
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const getFriends = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info(`Fetching Facebook friends`);

  if (!req.user) {
    return res.status(401);
  }

  const { netId } = req.user;

  const fbToken = req.headers['fb-token'];

  let userFriends: any[] = [];

  let after = '';

  while (after !== undefined) {
    try {
      winston.info(`Fetching Facebook friends page`);

      const { data } = await axios({
        url: `${FACEBOOK_API_ENDPOINT}/me/friends?fields=${FRIEND_FIELDS}&limit=${FRIENDS_PAGE_LIMIT}&access_token=${fbToken}&after=${after}`,
        method: 'get',
      });

      userFriends = userFriends.concat(data.data);

      if (data.length === 0 || !data.paging) {
        break;
      }

      after = data.paging.cursors.after;
    } catch (err) {
      winston.error(`Facebook Graph API error: ${err}`);
      break;
    }
  }

  await asyncForEach(userFriends, async (friend) => {
    winston.info(JSON.stringify(friend));

    const facebookId = parseInt(friend.id, 10);

    const create = await prisma.studentFacebookFriends.upsert({
      where: {
        netId_friendFacebookId: { netId, facebookId },
      },
      create: {
        netId,
        name: friend.name,
        facebookId,
      },
      update: {
        name: friend.name,
      },
    });
  });

  return res.json(userFriends);
};

// actual authentication routes
export default async (app: express.Express) => {
  app.use(cookieParser());
  app.get('/api/facebook/friends', getFriends);
};
