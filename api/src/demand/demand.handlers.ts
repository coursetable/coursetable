import type express from 'express';
import { and, count, eq, isNull, or } from 'drizzle-orm';
import z from 'zod';

import { worksheetCourses, worksheets } from '../../drizzle/schema.js';
import { db } from '../config.js';
import winston from '../logging/winston.js';

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

  const [result] = await db
    .select({ demand: count() })
    .from(worksheetCourses)
    .innerJoin(worksheets, eq(worksheetCourses.worksheetId, worksheets.id))
    .where(
      and(
        eq(worksheetCourses.crn, crn),
        eq(worksheets.season, season),
        eq(worksheets.worksheetNumber, 0),
        or(eq(worksheetCourses.hidden, false), isNull(worksheetCourses.hidden)),
      ),
    );

  winston.info(
    `getWorksheetDemand: crn=${crn} season=${season} demand=${result!.demand}`,
  );
  res.json({ demand: result!.demand });
};
