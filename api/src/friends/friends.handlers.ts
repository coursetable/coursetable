/**
 * @file Handlers for managing users' friends.
 */

import type express from 'express';
import z from 'zod';
import { prisma } from '../config';

import winston from '../logging/winston';

const FriendsOpRequestSchema = z.object({
  friendNetId: z.string(),
});

export const addFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info('Adding new friend');

  const { netId } = req.user!;
  const bodyParseRes = FriendsOpRequestSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ success: false });
    return;
  }
  const { friendNetId } = bodyParseRes.data;

  if (netId === friendNetId) {
    res.status(400).json({ success: false });
    return;
  }

  // Make sure user has a friend request to accept
  const existingRequest = await prisma.studentFriendRequests.findUnique({
    where: {
      netId_friendNetId: { netId: friendNetId, friendNetId: netId },
    },
  });

  if (!existingRequest) {
    res.status(400).json({ success: false });
    return;
  }

  await prisma.$transaction([
    prisma.studentFriends.upsert({
      // Update (do not create a new friend) when one already matches the
      // netId
      where: {
        netId_friendNetId: { netId, friendNetId },
      },
      // Basic info for creation
      create: {
        netId,
        friendNetId,
      },
      // Update people's names if they've changed
      update: {},
    }),
    // Bidirectional addition
    prisma.studentFriends.upsert({
      where: {
        netId_friendNetId: { netId: friendNetId, friendNetId: netId },
      },
      create: {
        netId: friendNetId,
        friendNetId: netId,
      },
      update: {},
    }),
    prisma.studentFriendRequests.delete({
      where: {
        netId_friendNetId: { netId: friendNetId, friendNetId: netId },
      },
    }),
  ]);

  res.json({ success: true });
};

export const removeFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info('Removing friend');

  const { netId } = req.user!;
  const bodyParseRes = FriendsOpRequestSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ success: false });
    return;
  }
  const { friendNetId } = bodyParseRes.data;

  if (typeof friendNetId !== 'string') {
    res.status(400).json({ success: false });
    return;
  }

  if (netId === friendNetId) {
    res.status(400).json({ success: false });
    return;
  }

  await prisma.$transaction([
    prisma.studentFriends.delete({
      where: {
        netId_friendNetId: { netId, friendNetId },
      },
    }),
    // Bidirectional deletion
    prisma.studentFriends.delete({
      where: {
        netId_friendNetId: { netId: friendNetId, friendNetId: netId },
      },
    }),
  ]);

  res.json({ success: true });
};

export const requestAddFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Sending friend request`);

  const { netId } = req.user!;
  const bodyParseRes = FriendsOpRequestSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ success: false });
    return;
  }
  const { friendNetId } = bodyParseRes.data;

  if (typeof friendNetId !== 'string') {
    res.status(400).json({ success: false });
    return;
  }

  if (netId === friendNetId) {
    res.status(400).json({ success: false });
    return;
  }

  await prisma.$transaction([
    prisma.studentFriendRequests.upsert({
      // Update (do not create a new request) when one already matches the
      // netId and friend ID
      where: {
        netId_friendNetId: { netId, friendNetId },
      },
      // Basic info for creation
      create: {
        netId,
        friendNetId,
      },
      // Update people's names if they've changed
      update: {},
    }),
  ]);

  res.json({ success: true });
};

export const getRequestsForFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Sending friend request`);

  const { netId } = req.user!;

  const friendReqs = await prisma.studentFriendRequests.findMany({
    where: {
      friendNetId: netId,
    },
  });

  const reqFriends = friendReqs.map((friendReq) => friendReq.netId);

  const friendInfos = await prisma.studentBluebookSettings.findMany({
    where: {
      netId: {
        in: reqFriends,
      },
    },
  });

  const friendNames = friendInfos.map((friendInfo) => ({
    netId: friendInfo.netId,
    name: `${friendInfo.first_name ?? '[unknown]'} ${
      friendInfo.last_name ?? '[unknown]'
    }`,
  }));

  res.status(200).json({
    success: true,
    friends: friendNames,
  });
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
): Promise<void> => {
  winston.info(`Fetching friends' worksheets`);

  const { netId } = req.user!;

  // Get NetIDs of friends
  winston.info('Getting NetIDs of friends');
  const friendRecords = await prisma.studentFriends.findMany({
    where: {
      netId,
    },
  });

  const friendNetIds = friendRecords.map(
    (friendRecord) => friendRecord.friendNetId,
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

  // Get friends' infos from NetIDs
  winston.info('Getting info of friends');

  const friendInfos = await prisma.studentBluebookSettings.findMany({
    where: {
      netId: {
        in: friendNetIds,
      },
    },
  });

  const friendNames = friendInfos.map((friendInfo) => ({
    netId: friendInfo.netId,
    name: `${friendInfo.first_name ?? '[unknown]'} ${
      friendInfo.last_name ?? '[unknown]'
    }`,
  }));

  const friendNameMap: { [netId: string]: { name: string } } = {};

  for (const nameRecord of friendNames)
    friendNameMap[nameRecord.netId] = { name: nameRecord.name };

  // Map netId to worksheets (list of [season, oci_id, worksheet_number])
  const worksheetsByFriend: {
    [netId: string]: [string, string, string][];
  } = {};
  friendWorksheets.forEach(
    ({
      net_id: friendNetId,
      oci_id: ociId,
      season,
      worksheet_number: worksheetNumber,
    }) => {
      if (friendNetId in worksheetsByFriend) {
        worksheetsByFriend[friendNetId].push([
          String(season),
          String(ociId),
          String(worksheetNumber),
        ]);
      } else {
        worksheetsByFriend[friendNetId] = [
          [String(season), String(ociId), String(worksheetNumber)],
        ];
      }
    },
  );

  res.status(200).json({
    success: true,
    worksheets: worksheetsByFriend,
    friendInfo: friendNameMap,
  });
};

export const getNames = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Fetching friends' names`);
  const allNameRecords = await prisma.studentBluebookSettings.findMany();

  const allNames = allNameRecords.map((nameRecord) => ({
    netId: nameRecord.netId,
    first: nameRecord.first_name,
    last: nameRecord.last_name,
    college: nameRecord.college,
  }));
  res.status(200).json(allNames);
};
