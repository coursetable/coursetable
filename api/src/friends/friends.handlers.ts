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
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }
  const { friendNetId } = bodyParseRes.data;

  if (netId === friendNetId) {
    res.status(400).json({ error: 'SAME_USER' });
    return;
  }

  // Make sure user has a friend request to accept
  const existingRequest = await prisma.studentFriendRequests.findUnique({
    where: {
      netId_friendNetId: { netId: friendNetId, friendNetId: netId },
    },
  });

  if (!existingRequest) {
    res.status(400).json({ error: 'NO_FRIEND_REQUEST' });
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

  res.sendStatus(200);
};

export const removeFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info('Removing friend');

  const { netId } = req.user!;
  const bodyParseRes = FriendsOpRequestSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }
  const { friendNetId } = bodyParseRes.data;

  if (netId === friendNetId) {
    res.status(400).json({ error: 'SAME_USER' });
    return;
  }

  const friend = await prisma.studentFriends.findUnique({
    where: {
      netId_friendNetId: { netId, friendNetId },
    },
  });

  if (!friend) {
    res.status(400).json({ error: 'NO_FRIEND' });
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

  res.sendStatus(200);
};

export const requestAddFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Sending friend request`);

  const { netId } = req.user!;
  const bodyParseRes = FriendsOpRequestSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }
  const { friendNetId } = bodyParseRes.data;

  if (netId === friendNetId) {
    res.status(400).json({ error: 'SAME_USER' });
    return;
  }

  const friendUser = await prisma.studentBluebookSettings.findUnique({
    where: {
      netId: friendNetId,
    },
  });

  if (!friendUser) {
    res.status(400).json({ error: 'FRIEND_NOT_FOUND' });
    return;
  }

  const existingFriend = await prisma.studentFriends.findUnique({
    where: {
      netId_friendNetId: { netId, friendNetId },
    },
  });

  if (existingFriend) {
    res.status(400).json({ error: 'ALREADY_FRIENDS' });
    return;
  }

  const existingOppositeRequest = await prisma.studentFriendRequests.findUnique(
    {
      where: {
        netId_friendNetId: { netId: friendNetId, friendNetId: netId },
      },
    },
  );

  if (existingOppositeRequest) {
    res.status(400).json({ error: 'ALREADY_RECEIVED_REQUEST' });
    return;
  }

  const existingSameRequest = await prisma.studentFriendRequests.findUnique({
    where: {
      netId_friendNetId: { netId, friendNetId },
    },
  });

  if (existingSameRequest) {
    res.status(400).json({ error: 'ALREADY_SENT_REQUEST' });
    return;
  }

  await prisma.studentFriendRequests.create({
    data: {
      netId,
      friendNetId,
    },
  });

  res.sendStatus(200);
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
    name: `${friendInfo.firstName ?? '[unknown]'} ${
      friendInfo.lastName ?? '[unknown]'
    }`,
  }));

  res.status(200).json({ requests: friendNames });
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
      netId: {
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

  const friendInfoMap: {
    [netId: string]: {
      name: string;
      worksheets: [season: string, ociId: string, worksheetNumber: string][];
    };
  } = Object.fromEntries(
    friendInfos.map((f) => [
      f.netId,
      {
        name: `${f.firstName ?? '[unknown]'} ${f.lastName ?? '[unknown]'}`,
        worksheets: [],
      },
    ]),
  );

  friendWorksheets.forEach(
    ({ netId: friendNetId, ociId, season, worksheetNumber }) => {
      (friendInfoMap[friendNetId] ??= {
        name: '[unknown]',
        worksheets: [[String(season), String(ociId), String(worksheetNumber)]],
      }).worksheets.push([
        String(season),
        String(ociId),
        String(worksheetNumber),
      ]);
    },
  );

  res.status(200).json({ friends: friendInfoMap });
};

export const getNames = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Fetching friends' names`);
  const allNameRecords = await prisma.studentBluebookSettings.findMany();

  const names = allNameRecords.map((nameRecord) => ({
    netId: nameRecord.netId,
    first: nameRecord.firstName,
    last: nameRecord.lastName,
    college: nameRecord.college,
  }));
  res.status(200).json({ names });
};
