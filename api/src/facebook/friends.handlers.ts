/**
 * @file Handlers for managing users' friends.
 */

import express from 'express';

// import axios from 'axios';

import { prisma } from '../config';

import winston from '../logging/winston';
import { StudentBluebookSettings, StudentFriends, StudentFriendRequests } from '@prisma/client';

export const addFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info("Adding new friend")


  if (!req.user) {
    return res.status(401).json({ success: false})
  }

  const { netId } = req.user

  winston.info(netId);

  if (!req.query || typeof req.query.id !== "string") {
    return res.status(401).json({ success: false })
  }

  const friendNetId: string = req.query.id

  winston.info("friend net id: " + friendNetId);

  try {

    await prisma.$transaction([
      prisma.studentFriends.upsert({
        // update (do not create a new friend) when one already matches the netId and Facebook ID
        where: {
          netId_friendNetId: { netId, friendNetId },
        },
        // basic info for creation
        create: {
          netId,
          // name: friend.name,
          friendNetId,
        },
        // update people's names if they've changed
        update: {},
      })
    ]);

    return res.json({ success: true });
  } catch (err) {
    winston.error(`Error with upserting friend: ${err}`);
    return res.status(500).json({ success: false });
  }
}

export const friendRequest = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Sending friend request`)

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  if (!req.query || typeof req.query.id !== "string") {
    return res.status(401).json({ success: false })
  }

  const friendNetId: string = req.query.id

  try {

    await prisma.$transaction([
      prisma.studentFriendRequests.upsert({
        // update (do not create a new request) when one already matches the netId and friend ID
        where: {
          netId_friendNetId: { netId, friendNetId },
        },
        // basic info for creation
        create: {
          netId,
          // name: friend.name,
          friendNetId,
        },
        // update people's names if they've changed
        update: {},
      })
    ]);

    return res.json({ success: true });
  } catch (err) {
    winston.error(`Error with upserting friend request: ${err}`);
    return res.status(500).json({ success: false });
  }

}

export const resolveFriendRequest = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Sending friend request`)

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  const friendNetId = req.params["friendNetId"]

  try {
    await prisma.$transaction([
      prisma.studentFriendRequests.delete({
        where: {
          netId_friendNetId: { netId, friendNetId },
        },
      })
    ])
    return res.json({ success: true });
  } catch (err) {
    winston.error(`Error with resolving friend request: ${err}`);
    return res.status(500).json({ success: false });
  }
}

export const getRequestsForFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Sending friend request`)

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  const friendReqs: StudentFriendRequests[] = await prisma.studentFriendRequests.findMany({
    where: {
      friendNetId: netId,
    },
  })

  const reqFriends = friendReqs.map(
    (friendReq: StudentFriendRequests) => friendReq.netId,
  );

  return res.status(200).json({
    success: true,
    friends: reqFriends
  });

}

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
  winston.info('Getting NetIDs of Facebook friends');
  const friendRecords = await prisma.studentFriends.findMany({
    where: {
      netId,
    },
  });

  const friendNetIds = friendRecords.map(
    (friendRecord: StudentFriends) => friendRecord.friendNetId,
  );

  winston.info(netId);

  winston.info(friendNetIds);

  // Get friends' worksheets from NetIDs
  winston.info('Getting worksheets of friends');
  const friendWorksheets = await prisma.worksheetCourses.findMany({
    where: {
      net_id: {
        in: friendNetIds,
      },
    },
  });

  winston.info("get worksheets: " + friendWorksheets.map((ws: any) => {
    return ws.net_id + " - " + ws.oci_id + " - " + ws.worksheet_number
  }))

  // Get friends' infos from NetIDs
  winston.info('Getting info of friends');

  const test = await prisma.studentBluebookSettings.findMany({});

  winston.info(test);

  const friendInfos = await prisma.studentBluebookSettings.findMany({
    where: {
      netId: {
        in: friendNetIds,
      },
    },
  });

  winston.info(friendInfos);

  const friendNames = friendInfos.map(
    (friendInfo: StudentBluebookSettings) => ({netId: friendInfo.netId, name: friendInfo.first_name + " " + friendInfo.last_name})
  )

  const friendNameMap: {[key: string]: { name: string }} = {};

  for (const nameRecord of friendNames) {
    friendNameMap[nameRecord.netId] = { name: nameRecord.name }
  }

  // map netId to worksheets (list of [season, oci_id, worksheet_number])
  const worksheetsByFriend: { [key: string]: [string, number, number | null][] } = {};
  friendWorksheets.forEach(
    ({
      net_id,
      oci_id,
      season,
      worksheet_number,
    }: {
      net_id: string;
      oci_id: number;
      season: number;
      worksheet_number: number | null;
    }) => {
      if (net_id in worksheetsByFriend) {
        worksheetsByFriend[net_id].push([String(season), oci_id, worksheet_number]);
        // worksheetsByFriend[net_id].push([String(season), oci_id]);
      } else {
        worksheetsByFriend[net_id] = [[String(season), oci_id, worksheet_number]];
        // worksheetsByFriend[net_id] = [[String(season), oci_id]];
      }
    },
  );

  return res.status(200).json({
    success: true,
    worksheets: worksheetsByFriend,
    friendInfo: friendNameMap,
  });
};

export const getNames = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {

  winston.info(`Fetching friends' names`);
  const allNameRecords: StudentBluebookSettings[] = await prisma.studentBluebookSettings.findMany();

  const allNames = allNameRecords.map(
    (nameRecord: StudentBluebookSettings) => {
      return {name: nameRecord.first_name + " " + nameRecord.last_name, college: nameRecord.college}
    }
  );
  return res.status(200).json(allNames);
}