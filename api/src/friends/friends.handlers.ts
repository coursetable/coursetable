import type express from 'express';
import z from 'zod';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { worksheetCoursesToWorksheets } from '../user/user.utils.js';

import { db } from '../config.js';
import winston from '../logging/winston.js';
import {
  studentBluebookSettings,
  studentFriendRequests,
  studentFriends,
  worksheetCourses,
} from '../../drizzle/schema.js';
import { findUniqueRequest } from './friends.queries.js';

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

  await db.transaction(async (tx) => {
    // Make sure user has a friend request to accept
    const [existingRequest] = await findUniqueRequest(tx, netId, friendNetId);
    if (!existingRequest) {
      res.status(400).json({ error: 'NO_FRIEND_REQUEST' });
      return;
    }

    // Update (do not create a new friend) when one already matches the
    // netId
    await tx
      .insert(studentFriends)
      // Basic info for creation
      .values({
        netId,
        friendNetId,
      })
      .onConflictDoNothing();
    // Bidirectional addition
    await tx
      .insert(studentFriends)
      .values({
        netId: friendNetId,
        friendNetId: netId,
      })
      .onConflictDoNothing();
    await tx
      .delete(studentFriendRequests)
      .where(
        and(
          eq(studentFriendRequests.netId, friendNetId),
          eq(studentFriendRequests.friendNetId, netId),
        ),
      );
  });

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

  const [friend] = await db
    .selectDistinctOn([studentFriends.netId, studentFriends.friendNetId])
    .from(studentFriends)
    .where(
      and(
        eq(studentFriends.netId, netId),
        eq(studentFriends.friendNetId, friendNetId),
      ),
    );

  if (!friend) {
    await db.transaction(async (tx) => {
      const [friendRequest] = await findUniqueRequest(tx, netId, friendNetId);

      if (!friendRequest) {
        res.status(400).json({ error: 'NO_FRIEND' });
        return;
      }

      await tx
        .delete(studentFriendRequests)
        .where(
          and(
            eq(studentFriendRequests.netId, friendNetId),
            eq(studentFriendRequests.friendNetId, netId),
          ),
        );
    });
  } else {
    await db.transaction(async (tx) => {
      await tx
        .delete(studentFriends)
        .where(
          and(
            eq(studentFriends.netId, netId),
            eq(studentFriends.friendNetId, friendNetId),
          ),
        );
      // Bidirectional deletion
      await tx
        .delete(studentFriends)
        .where(
          and(
            eq(studentFriends.netId, friendNetId),
            eq(studentFriends.friendNetId, netId),
          ),
        );
    });
  }
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

  await db.transaction(async (tx) => {
    const [friendUser] = await tx
      .selectDistinctOn([studentBluebookSettings.netId])
      .from(studentBluebookSettings)
      .where(eq(studentBluebookSettings.netId, friendNetId));

    if (!friendUser) {
      res.status(400).json({ error: 'FRIEND_NOT_FOUND' });
      return;
    }

    const [existingFriend] = await tx
      .selectDistinctOn([studentFriends.netId, studentFriends.friendNetId])
      .from(studentFriends)
      .where(
        and(
          eq(studentFriends.netId, netId),
          eq(studentFriends.friendNetId, friendNetId),
        ),
      );

    if (existingFriend) {
      res.status(400).json({ error: 'ALREADY_FRIENDS' });
      return;
    }

    const [existingOppositeRequest] = await findUniqueRequest(
      tx,
      netId,
      friendNetId,
    );

    if (existingOppositeRequest) {
      res.status(400).json({ error: 'ALREADY_RECEIVED_REQUEST' });
      return;
    }

    const [existingSameRequest] = await findUniqueRequest(
      tx,
      friendNetId,
      netId,
    );

    if (existingSameRequest) {
      res.status(400).json({ error: 'ALREADY_SENT_REQUEST' });
      return;
    }

    await tx.insert(studentFriendRequests).values({
      netId,
      friendNetId,
    });

    res.sendStatus(200);
  });
};

export const getRequestsForFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Sending friend request`);

  const { netId } = req.user!;

  const friendNames = await db.transaction(async (tx) => {
    const friendReqs = await tx
      .select({
        netId: studentFriendRequests.netId,
      })
      .from(studentFriendRequests)
      .where(eq(studentFriendRequests.friendNetId, netId));

    const reqFriends = friendReqs.map((friendReq) => friendReq.netId);

    return reqFriends.length > 0
      ? await tx
          .selectDistinctOn([studentBluebookSettings.netId], {
            name: sql<string>`${studentBluebookSettings.firstName} || ' ' || ${studentBluebookSettings.lastName}`,
            netId: studentBluebookSettings.netId,
          })
          .from(studentBluebookSettings)
          .where(inArray(studentBluebookSettings.netId, reqFriends))
      : [];
  });

  res.status(200).json({ requests: friendNames });
};

export const getFriendsWorksheets = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Fetching friends' worksheets`);

  const { netId } = req.user!;

  winston.info('Getting NetIDs of friends');

  const [friendInfos, friendWorksheetMap, friendNetIds] = await db.transaction(
    async (tx) => {
      const friendRecords = await tx
        .select({
          friendNetId: studentFriends.friendNetId,
        })
        .from(studentFriends)
        .where(eq(studentFriends.netId, netId));

      const friendNetIds = friendRecords.map(
        (friendRecord) => friendRecord.friendNetId,
      );

      if (friendNetIds.length === 0) {
        return [
          [],
          {} as {
            [netId: string]: {};
          },
          [],
        ];
      }

      winston.info('Getting worksheets of friends');
      const friendWorksheets = await tx
        .select({
          netId: worksheetCourses.netId,
          crn: worksheetCourses.crn,
          season: worksheetCourses.season,
          worksheetNumber: worksheetCourses.worksheetNumber,
          color: worksheetCourses.color,
        })
        .from(worksheetCourses)
        .where(inArray(worksheetCourses.netId, friendNetIds));

      const friendWorksheetMap = worksheetCoursesToWorksheets(friendWorksheets);

      winston.info('Getting info of friends');

      const friendInfos = await tx
        .selectDistinctOn([studentBluebookSettings.netId], {
          netId: studentBluebookSettings.netId,
          name: sql<string>`${studentBluebookSettings.firstName} || ' ' || ${studentBluebookSettings.lastName}`,
        })
        .from(studentBluebookSettings)
        .where(inArray(studentBluebookSettings.netId, friendNetIds));

      return [friendInfos, friendWorksheetMap, friendNetIds];
    },
  );

  const friendInfoMap = Object.fromEntries(
    friendInfos.map((friendInfo) => [
      friendInfo.netId,
      {
        name: friendInfo.name,
      },
    ]),
  );
  const aggregateInfo = Object.fromEntries(
    friendNetIds.map((friendNetId) => [
      friendNetId,
      {
        name: friendInfoMap[friendNetId]?.name ?? '[unknown]',
        worksheets: friendWorksheetMap[friendNetId] ?? {},
      },
    ]),
  );

  res.status(200).json({ friends: aggregateInfo });
};

export const getNames = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Fetching friends' names`);
  const names = await db
    .select({
      netId: studentBluebookSettings.netId,
      first: studentBluebookSettings.firstName,
      last: studentBluebookSettings.lastName,
      college: studentBluebookSettings.college,
    })
    .from(studentBluebookSettings);

  res.status(200).json({ names });
};
