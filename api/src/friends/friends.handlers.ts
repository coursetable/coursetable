import type express from 'express';
import { or, and, eq, inArray, sql } from 'drizzle-orm';
import { gql } from 'graphql-request';
import z from 'zod';
import {
  studentBluebookSettings,
  studentFriendRequests,
  studentFriends,
  worksheets,
} from '../../drizzle/schema.js';
import { db, graphqlClient } from '../config.js';
import { worksheetListToMap } from '../user/user.utils.js';

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
      // No existing friend; try deleting the friend request
      const [reqDeleteRes] = await tx
        .delete(studentFriendRequests)
        .where(
          and(
            eq(studentFriendRequests.netId, friendNetId),
            eq(studentFriendRequests.friendNetId, netId),
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

  const friendNames = await db.transaction(async (tx) => {
    const friendReqs = await tx.query.studentFriendRequests.findMany({
      where: eq(studentFriendRequests.friendNetId, netId),
      columns: { netId: true },
    });

    const reqFriends = friendReqs.map((friendReq) => friendReq.netId);

    if (reqFriends.length === 0) return [];
    return tx
      .select({
        netId: studentBluebookSettings.netId,
        name: sql<
          string | null
        >`${studentBluebookSettings.firstName} || ' ' || ${studentBluebookSettings.lastName}`,
      })
      .from(studentBluebookSettings)
      .where(inArray(studentBluebookSettings.netId, reqFriends));
  });

  res.status(200).json({ requests: friendNames });
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
          name: sql<
            string | null
          >`${studentBluebookSettings.firstName} || ' ' || ${studentBluebookSettings.lastName}`,
        })
        .from(studentBluebookSettings)
        .where(inArray(studentBluebookSettings.netId, friendNetIds));

      return [friendInfos, friendWorksheetMap, friendNetIds];
    },
  );

  // Collect all unique CRNs grouped by season
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

  // Fetch same_course_id for all CRNs using GraphQL
  const crnToSameCourseId = new Map<string, number>();
  for (const [seasonCode, crns] of seasonCrnMap.entries()) {
    if (crns.size === 0) continue;

    const query = gql`
      query CrnToSameCourseId($crns: [Int!]!, $season: String!) {
        listings(
          where: {
            crn: { _in: $crns }
            course: { season_code: { _eq: $season } }
          }
        ) {
          crn
          course {
            same_course_id
          }
        }
      }
    `;

    const data = await graphqlClient.request<{
      listings: { crn: number; course: { same_course_id: number } }[];
    }>(query, { crns: Array.from(crns), season: seasonCode });

    for (const listing of data.listings) {
      const key = `${seasonCode}${listing.crn}`;
      crnToSameCourseId.set(key, listing.course.same_course_id);
    }
  }

  // Get all unique same_course_id values
  const sameCourseIds = new Set<number>();
  for (const sameCourseId of crnToSameCourseId.values())
    sameCourseIds.add(sameCourseId);

  // Fetch ALL CRNs that have these same_course_id values
  const sameCourseIdToCrns = new Map<number, number[]>();
  for (const [seasonCode] of seasonCrnMap.entries()) {
    if (sameCourseIds.size === 0) continue;

    const query = gql`
      query AllCrnsForSameCourseIds($sameCourseIds: [Int!]!, $season: String!) {
        courses(
          where: {
            same_course_id: { _in: $sameCourseIds }
            season_code: { _eq: $season }
          }
        ) {
          same_course_id
          listings {
            crn
          }
        }
      }
    `;

    const data = await graphqlClient.request<{
      courses: { same_course_id: number; listings: { crn: number }[] }[];
    }>(query, { sameCourseIds: Array.from(sameCourseIds), season: seasonCode });

    for (const course of data.courses) {
      if (!sameCourseIdToCrns.has(course.same_course_id))
        sameCourseIdToCrns.set(course.same_course_id, []);
      for (const listing of course.listings)
        sameCourseIdToCrns.get(course.same_course_id)!.push(listing.crn);
    }
  }

  // Enrich worksheet data with same_course_id
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
          same_course_id:
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
        name: friendInfo.name,
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
  for (const [sameCourseId, crns] of sameCourseIdToCrns.entries())
    sameCourseIdToCrnsObj[String(sameCourseId)] = crns;

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
    },
    extras: {
      first: sql<string | null>`${studentBluebookSettings.firstName}`.as(
        'first',
      ),
      last: sql<string | null>`${studentBluebookSettings.lastName}`.as('last'),
    },
  });

  res.status(200).json({ names });
};
