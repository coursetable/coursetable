/**
 * @file Handlers for managing users' friends.
 */

import type express from 'express';
import { prisma } from '../config';

import winston from '../logging/winston';

export const addFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info('Adding new friend');

  if (!req.user) return res.status(401).json({ error: 'USER_NOT_FOUND' });

  const { netId } = req.user;
  const { friendNetId } = req.body;

  if (typeof friendNetId !== 'string')
    return res.status(400).json({ success: false });

  if (netId === friendNetId) return res.status(400).json({ success: false });

  // Make sure user has a friend request to accept
  try {
    const existingRequest = await prisma.studentFriendRequests.findUnique({
      where: {
        netId_friendNetId: { netId: friendNetId, friendNetId: netId },
      },
    });

    if (!existingRequest) return res.status(400).json({ success: false });
  } catch (err) {
    winston.error(`Error with finding friend request: ${err}`);
    return res.status(500).json({ success: false });
  }

  try {
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

    return res.json({ success: true });
  } catch (err) {
    winston.error(`Error with upserting friend: ${err}`);
    return res.status(500).json({ success: false });
  }
};

export const removeFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info('Removing friend');

  if (!req.user) return res.status(401).json({ error: 'USER_NOT_FOUND' });

  const { netId } = req.user;
  const { friendNetId } = req.body;

  if (typeof friendNetId !== 'string')
    return res.status(400).json({ success: false });

  if (netId === friendNetId) return res.status(400).json({ success: false });

  try {
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

    return res.json({ success: true });
  } catch (err) {
    winston.error(`Error with upserting friend: ${err}`);
    return res.status(500).json({ success: false });
  }
};

export const requestAddFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Sending friend request`);

  if (!req.user) return res.status(401).json({ error: 'USER_NOT_FOUND' });

  const { netId } = req.user;
  const { friendNetId } = req.body;

  if (typeof friendNetId !== 'string')
    return res.status(400).json({ success: false });

  if (netId === friendNetId) return res.status(400).json({ success: false });

  try {
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

    return res.json({ success: true });
  } catch (err) {
    winston.error(`Error with upserting friend request: ${err}`);
    return res.status(500).json({ success: false });
  }
};

export const getRequestsForFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Sending friend request`);

  if (!req.user) return res.status(401).json({ error: 'USER_NOT_FOUND' });

  const { netId } = req.user;

  try {
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
      name: `${friendInfo.first_name} ${friendInfo.last_name}`,
    }));

    return res.status(200).json({
      success: true,
      friends: friendNames,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Error fetching friend requests',
    });
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

  if (!req.user) return res.status(401).json({ error: 'USER_NOT_FOUND' });

  try {
    // Get NetIDs of friends
    winston.info('Getting NetIDs of friends');
    const friendRecords = await prisma.studentFriends.findMany({
      where: {
        netId: req.user.netId,
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
      name: `${friendInfo.first_name} ${friendInfo.last_name}`,
    }));

    const friendNameMap: { [netId: string]: { name: string } } = {};

    for (const nameRecord of friendNames)
      friendNameMap[nameRecord.netId] = { name: nameRecord.name };

    // Map netId to worksheets (list of [season, oci_id, worksheet_number])
    const worksheetsByFriend: {
      [netId: string]: [string, number, number | null][];
    } = {};
    friendWorksheets.forEach(
      ({
        net_id: netId,
        oci_id: ociId,
        season,
        worksheet_number: worksheetNumber,
      }) => {
        if (netId in worksheetsByFriend) {
          worksheetsByFriend[netId].push([
            String(season),
            ociId,
            worksheetNumber,
          ]);
        } else {
          worksheetsByFriend[netId] = [
            [String(season), ociId, worksheetNumber],
          ];
        }
      },
    );

    return res.status(200).json({
      success: true,
      worksheets: worksheetsByFriend,
      friendInfo: friendNameMap,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Error fetching friend worksheets',
    });
  }
};

export const getNames = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Fetching friends' names`);
  const allNameRecords = await prisma.studentBluebookSettings.findMany();

  const allNames = allNameRecords.map((nameRecord) => ({
    netId: nameRecord.netId,
    first: nameRecord.first_name,
    last: nameRecord.last_name,
    college: nameRecord.college,
  }));
  return res.status(200).json(allNames);
};
