import type express from 'express';

import { and, count, eq, inArray, isNull, or } from 'drizzle-orm';
import z from 'zod';

import { worksheetCourses, worksheets } from '../../drizzle/schema.js';
import { db, graphqlClient } from '../config.js';
import { getSdk } from '../user/user.queries.js';

const GetWorksheetDemandSchema = z.object({
  crn: z.coerce.number().int().positive(),
  season: z.coerce.number().int().positive(),
});

export const getWorksheetDemand = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const queryParseRes = GetWorksheetDemandSchema.safeParse(req.query);
  if (!queryParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { crn, season } = queryParseRes.data;

  const seasonStr = String(season);
  const sdk = getSdk(graphqlClient);

  const crnData = await sdk.CrnToSameCourseId({
    crns: [crn],
    season: seasonStr,
  });
  const sameCourseId = crnData.listings[0]?.course.sameCourseId;

  let crns = [crn];
  if (sameCourseId !== undefined) {
    const allCrnsData = await sdk.AllCrnsForSameCourseIds({
      sameCourseIds: [sameCourseId],
      season: seasonStr,
    });
    const resolved = allCrnsData.courses.flatMap((c) =>
      c.listings.map((l) => l.crn),
    );
    if (resolved.length > 0) crns = resolved;
  }

  const [result] = await db
    .select({ demand: count() })
    .from(worksheetCourses)
    .innerJoin(worksheets, eq(worksheetCourses.worksheetId, worksheets.id))
    .where(
      and(
        inArray(worksheetCourses.crn, crns),
        eq(worksheets.season, season),
        eq(worksheets.worksheetNumber, 0),
        or(eq(worksheetCourses.hidden, false), isNull(worksheetCourses.hidden)),
      ),
    );

  res.json({ demand: result!.demand });
};
