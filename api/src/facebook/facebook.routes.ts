import express from 'express';
import axios from 'axios';

import cookieParser from 'cookie-parser';

import { FACEBOOK_API_ENDPOINT } from '../config';

import winston from '../logging/winston';

const FRIEND_FIELDS = 'id,name,first_name,middle_name,last_name';
const FRIENDS_PAGE_LIMIT = 500;

const getFriends = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info(`Fetching Facebook friends`);

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

      userFriends = userFriends.concat(data);

      if (data.length === 0 || !data.paging) {
        break;
      }

      after = data.paging.cursors.after;
    } catch (err) {
      winston.error(`Facebook Graph API error: ${err}`);
      break;
    }
  }

  return res.json(userFriends);
};

// actual authentication routes
export default async (app: express.Express) => {
  app.use(cookieParser());
  app.get('/api/facebook/friends', getFriends);
};
