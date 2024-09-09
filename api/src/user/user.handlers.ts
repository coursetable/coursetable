import type express from 'express';
import { and, eq } from 'drizzle-orm';
import {
  ToggleBookmarkReqBodySchema,
  UpdateBookmarkBatchReqBodySchema,
} from './user.schemas.js';
import { worksheetCoursesToWorksheets } from './user.utils.js';
import {
  studentBluebookSettings,
  worksheetCourses,
} from '../../drizzle/schema.js';
import { db } from '../config.js';
import winston from '../logging/winston.js';

export const toggleBookmark = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info('Toggling course bookmark');

  const { netId } = req.user!;

  const bodyParseRes = ToggleBookmarkReqBodySchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { action, season, crn, worksheetNumber, color } = bodyParseRes.data;

  const [existing] = await db
    .selectDistinctOn([
      worksheetCourses.netId,
      worksheetCourses.crn,
      worksheetCourses.season,
      worksheetCourses.worksheetNumber,
    ])
    .from(worksheetCourses)
    .where(
      and(
        eq(worksheetCourses.netId, netId),
        eq(worksheetCourses.crn, crn),
        eq(worksheetCourses.season, season),
        eq(worksheetCourses.worksheetNumber, worksheetNumber),
      ),
    );

  if (action === 'add') {
    winston.info(
      `Bookmarking course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (existing) {
      res.status(400).json({ error: 'ALREADY_BOOKMARKED' });
      return;
    }
    await db.insert(worksheetCourses).values({
      netId,
      crn,
      season,
      worksheetNumber,
      color,
      hidden: false,
    });
  } else if (action === 'remove') {
    winston.info(
      `Removing bookmark for course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (!existing) {
      res.status(400).json({ error: 'NOT_BOOKMARKED' });
      return;
    }
    await db
      .delete(worksheetCourses)
      .where(
        and(
          eq(worksheetCourses.netId, netId),
          eq(worksheetCourses.crn, crn),
          eq(worksheetCourses.season, season),
          eq(worksheetCourses.worksheetNumber, worksheetNumber),
        ),
      );
  }

  res.sendStatus(200);
};

export const getUserWorksheet = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Fetching user's worksheets`);

  const { netId } = req.user!;

  winston.info(`Getting profile for user ${netId}`);
  const [studentProfile] = await db
    .selectDistinctOn([studentBluebookSettings.netId])
    .from(studentBluebookSettings)
    .where(eq(studentBluebookSettings.netId, netId));

  winston.info(`Getting worksheets for user ${netId}`);

  const worksheets = await db
    .select()
    .from(worksheetCourses)
    .where(eq(worksheetCourses.netId, netId));

  res.json({
    netId,
    evaluationsEnabled: studentProfile?.evaluationsEnabled ?? null,
    year: studentProfile?.year ?? null,
    school: studentProfile?.school ?? null,
    data: worksheetCoursesToWorksheets(worksheets)[netId] ?? {},
  });
};

export const updateBookmarkBatch = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info('Updating course bookmark');

  const { netId } = req.user!;

  const bodyParseRes = UpdateBookmarkBatchReqBodySchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    winston.info(bodyParseRes.error.issues);
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  bodyParseRes.data.forEach(async (update) => {
    const { action, season, crn, worksheetNumber, color, hidden } = update;

    const [existing] = await db
      .selectDistinctOn([
        worksheetCourses.netId,
        worksheetCourses.crn,
        worksheetCourses.season,
        worksheetCourses.worksheetNumber,
      ])
      .from(worksheetCourses)
      .where(
        and(
          eq(worksheetCourses.netId, netId),
          eq(worksheetCourses.crn, crn),
          eq(worksheetCourses.season, season),
          eq(worksheetCourses.worksheetNumber, worksheetNumber),
        ),
      );

    if (!existing) {
      res.status(400).json({ error: 'NOT_BOOKMARKED' });
      return;
    }

    winston.info(
      `Updating bookmark for course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );

    switch (action) {
      case 'color':
        // Update color of a course
        await db
          .update(worksheetCourses)
          .set({ color })
          .where(
            and(
              eq(worksheetCourses.netId, netId),
              eq(worksheetCourses.crn, crn),
              eq(worksheetCourses.season, season),
              eq(worksheetCourses.worksheetNumber, worksheetNumber),
            ),
          );
        break;
      case 'hidden':
        // Update hidden state of a course
        await db
          .update(worksheetCourses)
          .set({ hidden })
          .where(
            and(
              eq(worksheetCourses.netId, netId),
              eq(worksheetCourses.crn, crn),
              eq(worksheetCourses.season, season),
              eq(worksheetCourses.worksheetNumber, worksheetNumber),
            ),
          );
        break;
    }
  });

  res.sendStatus(200);
};
