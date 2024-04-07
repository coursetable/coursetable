import type express from 'express';
import z from 'zod';
import { and, eq, inArray } from 'drizzle-orm';
import { worksheetCoursesToWorksheets } from '../user/user.utils.js';

import { db } from '../config.js';
import winston from '../logging/winston.js';
import {
  studentBluebookSettings,
  studentFriendRequests,
  studentFriends,
  worksheetCourses,
} from '../../drizzle/schema.js';

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
    const [existingRequest] = await db
      .selectDistinctOn([
        studentFriendRequests.netId,
        studentFriendRequests.friendNetId,
      ])
      .from(studentFriendRequests)
      .where(
        and(
          eq(studentFriendRequests.netId, friendNetId),
          eq(studentFriendRequests.friendNetId, netId),
        ),
      );

    if (!existingRequest) {
      res.status(400).json({ error: 'NO_FRIEND_REQUEST' });
      tx.rollback();
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
      .onConflictDoNothing({
        target: [studentFriends.netId, studentFriends.friendNetId],
      });
    // Bidirectional addition
    await tx
      .insert(studentFriends)
      .values({
        netId: friendNetId,
        friendNetId: netId,
      })
      .onConflictDoNothing({
        target: [studentFriends.netId, studentFriends.friendNetId],
      });
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
    .from(studentFriendRequests)
    .where(
      and(
        eq(studentFriends.netId, netId),
        eq(studentFriends.friendNetId, friendNetId),
      ),
    );

  if (!friend) {
    await db.transaction(async (tx) => {
      const [friendRequest] = await tx
        .selectDistinctOn([
          studentFriendRequests.netId,
          studentFriendRequests.friendNetId,
        ])
        .from(studentFriendRequests)
        .where(
          and(
            eq(studentFriendRequests.netId, friendNetId),
            eq(studentFriendRequests.friendNetId, netId),
          ),
        );

      if (!friendRequest) {
        res.status(400).json({ error: 'NO_FRIEND' });
        tx.rollback();
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
      tx.rollback();
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
      tx.rollback();
      return;
    }

    const [existingOppositeRequest] = await tx
      .selectDistinctOn([
        studentFriendRequests.netId,
        studentFriendRequests.friendNetId,
      ])
      .from(studentFriendRequests)
      .where(
        and(
          eq(studentFriendRequests.netId, friendNetId),
          eq(studentFriendRequests.friendNetId, netId),
        ),
      );

    if (existingOppositeRequest) {
      res.status(400).json({ error: 'ALREADY_RECEIVED_REQUEST' });
      tx.rollback();
      return;
    }

    const [existingSameRequest] = await tx
      .selectDistinctOn([
        studentFriendRequests.netId,
        studentFriendRequests.friendNetId,
      ])
      .from(studentFriendRequests)
      .where(
        and(
          eq(studentFriendRequests.netId, netId),
          eq(studentFriendRequests.friendNetId, friendNetId),
        ),
      );

    if (existingSameRequest) {
      res.status(400).json({ error: 'ALREADY_SENT_REQUEST' });
      tx.rollback();
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

  const friendInfos = await db.transaction(async (tx) => {
    const friendReqs = await tx
      .select()
      .from(studentFriendRequests)
      .where(eq(studentFriendRequests.friendNetId, netId));

    const reqFriends = friendReqs.map((friendReq) => friendReq.netId);

    return reqFriends.length > 0
      ? await tx
          .selectDistinctOn([studentBluebookSettings.netId])
          .from(studentBluebookSettings)
          .where(inArray(studentBluebookSettings.netId, reqFriends))
      : [];
  });

  const friendNames = friendInfos.map((friendInfo) => ({
    netId: friendInfo.netId,
    name: `${friendInfo.firstName ?? '[unknown]'} ${
      friendInfo.lastName ?? '[unknown]'
    }`,
  }));

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
        .select()
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
        .select()
        .from(worksheetCourses)
        .where(inArray(worksheetCourses.netId, friendNetIds));

      const friendWorksheetMap = worksheetCoursesToWorksheets(friendWorksheets);

      winston.info('Getting info of friends');

      const friendInfos = await tx
        .selectDistinctOn([studentBluebookSettings.netId])
        .from(studentBluebookSettings)
        .where(inArray(studentBluebookSettings.netId, friendNetIds));

      return [friendInfos, friendWorksheetMap, friendNetIds];
    },
  );

  const friendInfoMap = Object.fromEntries(
    friendInfos.map((friendInfo) => [
      friendInfo.netId,
      {
        name: `${friendInfo.firstName ?? '[unknown]'} ${
          friendInfo.lastName ?? '[unknown]'
        }`,
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
  const allNameRecords = await db.select().from(studentBluebookSettings);

  const names = allNameRecords.map((nameRecord) => ({
    netId: nameRecord.netId,
    first: nameRecord.firstName,
    last: nameRecord.lastName,
    college: nameRecord.college,
  }));
  res.status(200).json({ names });
};
