/**
 * @file Handlers for linking accounts with Facebook.
 */

import express from 'express';

import axios from 'axios';

import { FACEBOOK_API_ENDPOINT, prisma } from '../config';

import winston from '../logging/winston';
import { StudentFriends, Students } from '@prisma/client';

const ME_FIELDS = 'id,name,first_name,middle_name,last_name';
const FRIEND_FIELDS = 'id,name,first_name,middle_name,last_name';
const FRIENDS_PAGE_LIMIT = 500;

/**
 * Fetch and create/update user's Facebook friends.
 *
 * @param req - express request object
 * @param res - express response object
 */
export const addFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Updating Facebook friends`);

  if (!req.user) {
    return res.status(401).json({ success: false });
  }

  const { netId } = req.user;

  winston.info(`Creating friend info for user ${netId}`);

  // Update user's Facebook info
  await prisma.students.upsert({
    // update (do not create a new friend) when one already matches the netId and Facebook ID
    where: {
      netId,
    },
    // basic info for creation
    create: {
      netId,
    },
    // update people's names if they've changed
    update: {

    },
  });

  let userFriends: { id: string; name: string }[] = [];

  try {
    const upsertFriends = userFriends.map((friend) => {

      return prisma.studentFacebookFriends.upsert({
        // update (do not create a new friend) when one already matches the netId and Facebook ID
        where: {
          netId: netId
        },
        // basic info for creation
        create: {
          netId,
          name: friend.name
        },
        // update people's names if they've changed
        update: {
          name: friend.name
        }
      });
    });

    await prisma.$transaction(upsertFriends);

    return res.json({ success: true });
  } catch (err) {
    winston.error(`Error with upserting friends: ${err}`);
    return res.status(500).json({ success: false });
  }
};

/**
 * Get worksheets of user's friends.
 *
 * @param req - express request object
 * @param res - express response object
 */
export const getFriendsWorksheets = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Fetching friends' worksheets`);

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  // Get NetIDs of Facebook friends
  winston.info('Getting NetIDs of friends');
  const friends = await prisma.studentFriends.findMany({
    where: {
      netId : netId, 
    },
  });

  const friendNetIds = friends.map(
    (friend: StudentFriends) => friend.netId,
  );

  // Get friends' worksheets from NetIDs
  winston.info('Getting worksheets of friends');
  const friendWorksheets = await prisma.worksheetCourses.findMany({
    where: {
      net_id: {
        in: friendNetIds,
      },
    },
  });

  // Get friends' worksheets from NetIDs
  winston.info('Getting info of friends');
  const friendInfos: Students[] = await prisma.students.findMany({
    where: {
      netId: {
        in: friendNetIds,
      },
    },
  });

  // map netId to worksheets (list of [season, oci_id])
  const worksheetsByFriend: { [key: string]: [string, number][] } = {};
  friendWorksheets.forEach(
    ({
      net_id,
      oci_id,
      season,
    }: {
      net_id: string;
      oci_id: number;
      season: number;
    }) => {
      if (net_id in worksheetsByFriend) {
        worksheetsByFriend[net_id].push([String(season), oci_id]);
      } else {
        worksheetsByFriend[net_id] = [[String(season), oci_id]];
      }
    },
  );

  // map netId to friend name
  const infoByFriend: {
    [key: string]: { name: string };
  } = {};
  friendInfos.forEach(
    ({ netId: friendNetId }: Students) => {
        infoByFriend[friendNetId] = {
          name: friendNetId,
        };
    },
  );

  return res.status(200).json({
    success: true,
    worksheets: worksheetsByFriend,
    friendInfo: infoByFriend,
  });
};
