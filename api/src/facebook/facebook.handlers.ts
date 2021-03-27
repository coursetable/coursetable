/// <reference path="../auth/user.d.ts" />

import express from 'express';

import axios from 'axios';

import { FACEBOOK_API_ENDPOINT } from '../config';

import winston from '../logging/winston';

import { PrismaClient, Prisma } from '@prisma/client';

const ME_FIELDS = 'id,name,first_name,middle_name,last_name';
const FRIEND_FIELDS = 'id,name,first_name,middle_name,last_name';
const FRIENDS_PAGE_LIMIT = 500;

const prisma = new PrismaClient();

export const updateFriends = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info(`Updating Facebook friends`);

  if (!req.user) {
    return res.status(401).json({ success: false });
  }

  const { netId } = req.user;

  // User's Facebook token for fetching their friends
  const fbToken = req.headers['fb-token'];

  // Get current user's Facebook info
  const { data: facebookProfile } = await axios({
    url: `${FACEBOOK_API_ENDPOINT}/me?fields=${ME_FIELDS}&access_token=${fbToken}`,
    method: 'get',
  });

  winston.info(`Creating Facebook info for user ${netId}`);

  // Update user's Facebook info
  await prisma.students.upsert({
    // update (do not create a new friend) when one already matches the netId and Facebook ID
    where: {
      netId,
    },
    // basic info for creation
    create: {
      netId,
      facebookId: BigInt(facebookProfile.id),
      facebookDataJson: JSON.stringify(facebookProfile),
    },
    // update people's names if they've changed
    update: {
      facebookId: BigInt(facebookProfile.id),
      facebookDataJson: JSON.stringify(facebookProfile),
    },
  });

  let userFriends: { id: string; name: string }[] = [];

  // Cursor pointing to the next page of friends
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
      return res.status(500).json({ success: false });
      break;
    }
  }

  try {
    const updateFriends = userFriends.map((friend) => {
      const facebookId = parseInt(friend.id, 10);

      return prisma.studentFacebookFriends.upsert({
        // update (do not create a new friend) when one already matches the netId and Facebook ID
        where: {
          netId_friendFacebookId: { netId, facebookId },
        },
        // basic info for creation
        create: {
          netId,
          name: friend.name,
          facebookId,
        },
        // update people's names if they've changed
        update: {
          name: friend.name,
        },
      });
    });

    await prisma.$transaction(updateFriends);

    return res.json({ success: true });
  } catch (err) {
    winston.error(`Error with upserting Facebook friends: ${err}`);
    return res.status(500).json({ success: false });
  }
};

export const getFriendsWorksheets = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info(`Fetching Facebook friends' worksheets`);

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  // Get Facebook ID of user
  winston.info("Getting user's Facebook ID");
  const studentProfile = await prisma.students.findUnique({
    where: {
      netId,
    },
  });

  winston.info(studentProfile);

  const userFacebookId = studentProfile?.facebookId;

  if (!userFacebookId) {
    return res.status(401).json();
  }

  // Get NetIDs of Facebook friends
  winston.info('Getting NetIDs of Facebook friends');
  const friends = await prisma.studentFacebookFriends.findMany({
    where: {
      facebookId: userFacebookId,
    },
  });

  const friendNetIds = friends.map((friend) => friend.netId);

  // Get friends' worksheets from NetIDs
  winston.info('Getting worksheets of Facebook friends');
  const friendWorksheets = await prisma.worksheetCourses.findMany({
    where: {
      net_id: {
        in: friendNetIds,
      },
    },
  });

  // Get friends' worksheets from NetIDs
  winston.info('Getting info of Facebook friends');
  const friendInfos = await prisma.students.findMany({
    where: {
      netId: {
        in: friendNetIds,
      },
    },
  });

  // map netId to worksheets (list of [season, oci_id])
  const worksheetsByFriend: { [key: string]: [string, number][] } = {};

  friendWorksheets.forEach(({ net_id, oci_id, season }) => {
    if (net_id in worksheetsByFriend) {
      worksheetsByFriend[net_id].push([String(season), oci_id]);
    } else {
      worksheetsByFriend[net_id] = [[String(season), oci_id]];
    }
  });

  // map netId to friend name and Facebook ID
  const infoByFriend: {
    [key: string]: { name: string; facebookId: string };
  } = {};

  friendInfos.forEach(({ netId, facebookId, facebookDataJson }) => {
    infoByFriend[netId] = {
      name: JSON.parse(facebookDataJson).name,
      facebookId: String(facebookId),
    };
  });

  return res.status(200).json({
    success: true,
    worksheets: worksheetsByFriend,
    friendInfo: infoByFriend,
  });
};
