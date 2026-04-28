import type express from 'express';
import { or, and, eq, inArray } from 'drizzle-orm';
import z from 'zod';
import { getSdk } from './friends.queries.js';
import {
  studentBluebookSettings,
  studentFriendRequests,
  studentFriends,
  worksheets,
} from '../../drizzle/schema.js';
import { db, graphqlClient } from '../config.js';
import {
  canViewerSee,
  getSelfDisplayNames,
  getVisibleDisplayName,
  normalizeVisibility,
} from '../profile/profile.utils.js';
import {
  worksheetListToMap,
  fetchSameCourseIdMappings,
} from '../user/user.utils.js';

const FriendsOpRequestSchema = z.object({
  friendNetId: z.string(),
});

export const addFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
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
    const [deleteRes] = await tx
      .delete(studentFriendRequests)
      .where(
        and(
          eq(studentFriendRequests.netId, friendNetId),
          eq(studentFriendRequests.friendNetId, netId),
        ),
      )
      .returning();
    if (!deleteRes) {
      res.status(400).json({ error: 'NO_FRIEND_REQUEST' });
      return;
    }
    // Update (do not create a new friend) when one already matches the
    // netId
    await tx
      .insert(studentFriends)
      // Bidirectional addition
      .values([
        { netId, friendNetId },
        { netId: friendNetId, friendNetId: netId },
      ])
      .onConflictDoNothing();
    res.sendStatus(200);
  });
};

export const removeFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
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
    const [friendDeleteRes] = await tx
      .delete(studentFriends)
      .where(
        // Bidirectional deletion
        or(
          and(
            eq(studentFriends.netId, netId),
            eq(studentFriends.friendNetId, friendNetId),
          ),
          and(
            eq(studentFriends.netId, friendNetId),
            eq(studentFriends.friendNetId, netId),
          ),
        ),
      )
      .returning();
    if (!friendDeleteRes) {
      // No existing friend; try deleting the friend request (incoming or outgoing)
      const [reqDeleteRes] = await tx
        .delete(studentFriendRequests)
        .where(
          or(
            and(
              eq(studentFriendRequests.netId, friendNetId),
              eq(studentFriendRequests.friendNetId, netId),
            ),
            and(
              eq(studentFriendRequests.netId, netId),
              eq(studentFriendRequests.friendNetId, friendNetId),
            ),
          ),
        )
        .returning();
      if (!reqDeleteRes) {
        res.status(400).json({ error: 'NO_FRIEND' });
        return;
      }
    }
    res.sendStatus(200);
  });
};

export const requestAddFriend = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
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
    const friendUser = await tx.query.studentBluebookSettings.findFirst({
      where: eq(studentBluebookSettings.netId, friendNetId),
    });

    if (!friendUser) {
      res.status(400).json({ error: 'FRIEND_NOT_FOUND' });
      return;
    }

    const existingFriend = await tx.query.studentFriends.findFirst({
      where: and(
        eq(studentFriends.netId, netId),
        eq(studentFriends.friendNetId, friendNetId),
      ),
    });

    if (existingFriend) {
      res.status(400).json({ error: 'ALREADY_FRIENDS' });
      return;
    }

    const existingRequest = await tx.query.studentFriendRequests.findFirst({
      where: or(
        and(
          eq(studentFriendRequests.netId, netId),
          eq(studentFriendRequests.friendNetId, friendNetId),
        ),
        and(
          eq(studentFriendRequests.netId, friendNetId),
          eq(studentFriendRequests.friendNetId, netId),
        ),
      ),
    });

    if (existingRequest) {
      if (existingRequest.netId === netId)
        res.status(400).json({ error: 'ALREADY_SENT_REQUEST' });
      else res.status(400).json({ error: 'ALREADY_RECEIVED_REQUEST' });
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
  const { netId } = req.user!;

  const friendRequestProfiles = await db.transaction(async (tx) => {
    const friendReqs = await tx.query.studentFriendRequests.findMany({
      where: eq(studentFriendRequests.friendNetId, netId),
      columns: { netId: true },
    });

    const reqFriends = friendReqs.map((friendReq) => friendReq.netId);

    if (reqFriends.length === 0) return [];
    return tx
      .select({
        netId: studentBluebookSettings.netId,
        firstName: studentBluebookSettings.firstName,
        lastName: studentBluebookSettings.lastName,
        preferredFirstName: studentBluebookSettings.preferredFirstName,
        preferredLastName: studentBluebookSettings.preferredLastName,
        nameVisibility: studentBluebookSettings.nameVisibility,
      })
      .from(studentBluebookSettings)
      .where(inArray(studentBluebookSettings.netId, reqFriends));
  });

  const requests = friendRequestProfiles.map((profile) => ({
    netId: profile.netId,
    name: getVisibleDisplayName(
      profile,
      'stranger',
      normalizeVisibility(profile.nameVisibility, 'public'),
    ),
  }));

  res.status(200).json({ requests });
};

export const getOutgoingRequests = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const outgoingRequestProfiles = await db.transaction(async (tx) => {
    const outgoingReqs = await tx.query.studentFriendRequests.findMany({
      where: eq(studentFriendRequests.netId, netId),
      columns: { friendNetId: true },
    });

    const pendingNetIds = outgoingReqs.map((r) => r.friendNetId);

    if (pendingNetIds.length === 0) return [];
    return tx
      .select({
        netId: studentBluebookSettings.netId,
        firstName: studentBluebookSettings.firstName,
        lastName: studentBluebookSettings.lastName,
        preferredFirstName: studentBluebookSettings.preferredFirstName,
        preferredLastName: studentBluebookSettings.preferredLastName,
        nameVisibility: studentBluebookSettings.nameVisibility,
      })
      .from(studentBluebookSettings)
      .where(inArray(studentBluebookSettings.netId, pendingNetIds));
  });

  const requests = outgoingRequestProfiles.map((profile) => ({
    netId: profile.netId,
    name: getVisibleDisplayName(
      profile,
      'stranger',
      normalizeVisibility(profile.nameVisibility, 'public'),
    ),
  }));

  res.status(200).json({ requests });
};

export const getFriendsWorksheets = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const [friendInfos, friendWorksheetMap, friendNetIds] = await db.transaction(
    async (tx) => {
      const friendRecords = await tx.query.studentFriends.findMany({
        where: eq(studentFriends.netId, netId),
        columns: { friendNetId: true },
      });

      const friendNetIds = friendRecords.map(
        (friendRecord) => friendRecord.friendNetId,
      );

      if (friendNetIds.length === 0)
        return [[], {} as ReturnType<typeof worksheetListToMap>, []];

      const friendWorksheets = await tx.query.worksheets.findMany({
        where: and(
          inArray(worksheets.netId, friendNetIds),
          eq(worksheets.private, false),
        ),
        columns: {
          netId: true,
          season: true,
          worksheetNumber: true,
          name: true,
        },
        with: {
          courses: {
            columns: {
              crn: true,
              color: true,
              hidden: true,
            },
          },
        },
      });

      const friendWorksheetMap = worksheetListToMap(friendWorksheets);

      const friendInfos = await tx
        .select({
          netId: studentBluebookSettings.netId,
          firstName: studentBluebookSettings.firstName,
          lastName: studentBluebookSettings.lastName,
          preferredFirstName: studentBluebookSettings.preferredFirstName,
          preferredLastName: studentBluebookSettings.preferredLastName,
          nameVisibility: studentBluebookSettings.nameVisibility,
        })
        .from(studentBluebookSettings)
        .where(inArray(studentBluebookSettings.netId, friendNetIds));

      return [friendInfos, friendWorksheetMap, friendNetIds];
    },
  );

  const seasonCrnMap = new Map<string, Set<number>>();
  for (const friendNetId of friendNetIds) {
    const friendWorksheets = friendWorksheetMap[friendNetId];
    if (!friendWorksheets) continue;

    for (const [seasonStr, worksheetsByNum] of Object.entries(
      friendWorksheets,
    )) {
      const seasonCode = String(seasonStr);
      if (!seasonCrnMap.has(seasonCode))
        seasonCrnMap.set(seasonCode, new Set());

      for (const worksheet of Object.values(worksheetsByNum)) {
        for (const course of worksheet.courses as {
          crn: number;
          color: string;
          hidden: boolean | null;
        }[])
          seasonCrnMap.get(seasonCode)!.add(course.crn);
      }
    }
  }

  // Fetch sameCourseId mappings
  const { crnToSameCourseId, sameCourseIdToCrns } =
    await fetchSameCourseIdMappings(seasonCrnMap, graphqlClient, getSdk);

  // Enrich worksheet data with sameCourseId
  const enrichedWorksheetMap: typeof friendWorksheetMap = {};
  for (const friendNetId of friendNetIds) {
    const friendWorksheets = friendWorksheetMap[friendNetId];
    if (!friendWorksheets) continue;

    enrichedWorksheetMap[friendNetId] = {};
    for (const [seasonStr, worksheetsByNum] of Object.entries(
      friendWorksheets,
    )) {
      const seasonCode = String(seasonStr);
      enrichedWorksheetMap[friendNetId][seasonCode] = {};

      for (const [worksheetNum, worksheet] of Object.entries(worksheetsByNum)) {
        const enrichedCourses = (
          worksheet.courses as {
            crn: number;
            color: string;
            hidden: boolean | null;
          }[]
        ).map((course) => ({
          ...course,
          sameCourseId:
            crnToSameCourseId.get(`${seasonCode}${course.crn}`) ?? null,
        }));

        enrichedWorksheetMap[friendNetId][seasonCode][Number(worksheetNum)] = {
          ...worksheet,
          courses: enrichedCourses,
        };
      }
    }
  }

  const friendInfoMap = Object.fromEntries(
    friendInfos.map((friendInfo) => [
      friendInfo.netId,
      {
        name: getVisibleDisplayName(
          friendInfo,
          'friend',
          normalizeVisibility(friendInfo.nameVisibility, 'public'),
        ),
      },
    ]),
  );
  const aggregateInfo = Object.fromEntries(
    friendNetIds.map((friendNetId) => [
      friendNetId,
      {
        name: friendInfoMap[friendNetId]?.name ?? null,
        worksheets: enrichedWorksheetMap[friendNetId] ?? {},
      },
    ]),
  );

  // Include the sameCourseIdToCrns map in the response
  const sameCourseIdToCrnsObj: { [key: string]: number[] } = {};
  for (const [key, crns] of sameCourseIdToCrns.entries())
    sameCourseIdToCrnsObj[key] = crns;

  res.status(200).json({
    friends: aggregateInfo,
    sameCourseIdToCrns: sameCourseIdToCrnsObj,
  });
};

export const getNames = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const names = await db.query.studentBluebookSettings.findMany({
    columns: {
      netId: true,
      college: true,
      firstName: true,
      lastName: true,
      preferredFirstName: true,
      preferredLastName: true,
      nameVisibility: true,
    },
  });

  res.status(200).json({
    names: names.map((name) => {
      const displayNames = getSelfDisplayNames(name);
      const canSeeName = canViewerSee(
        normalizeVisibility(name.nameVisibility, 'public'),
        'stranger',
      );
      return {
        netId: name.netId,
        college: name.college,
        first: canSeeName ? displayNames.displayFirstName : null,
        last: canSeeName ? displayNames.displayLastName : null,
      };
    }),
  });
};
