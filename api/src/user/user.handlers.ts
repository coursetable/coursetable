import type express from 'express';
import chroma from 'chroma-js';
import { and, eq, inArray } from 'drizzle-orm';
import z from 'zod';

import {
  worksheetCoursesToWorksheets,
  wishlistCoursesToWishlist,
} from './user.utils.js';

import {
  studentBluebookSettings,
  wishlistCourses,
  worksheetCourses,
} from '../../drizzle/schema.js';
import { db } from '../config.js';
import winston from '../logging/winston.js';

const ToggleBookmarkReqBodySchema = z.object({
  action: z.union([z.literal('add'), z.literal('remove'), z.literal('update')]),
  season: z.string().transform((val) => parseInt(val, 10)),
  crn: z.number(),
  worksheetNumber: z.number(),
  color: z.string().refine((val) => chroma.valid(val)),
});

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
  } else {
    // Update data of a bookmarked course
    winston.info(
      `Updating bookmark for course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (!existing) {
      res.status(400).json({ error: 'NOT_BOOKMARKED' });
      return;
    }
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

const ToggleWishReqBodySchema = z.object({
  action: z.union([z.literal('add'), z.literal('remove')]),
  // We must pass all course codes to check for any match with the wishlist.
  allCourseCodes: z.array(z.string()),
});

export const toggleWish = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info('Toggling wishlist bookmark');

  const { netId } = req.user!;

  const bodyParseRes = ToggleWishReqBodySchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { action, allCourseCodes } = bodyParseRes.data;

  if (allCourseCodes.length === 0) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const [existing] = await db
    .selectDistinctOn([wishlistCourses.netId, wishlistCourses.courseCode])
    .from(wishlistCourses)
    .where(
      and(
        eq(wishlistCourses.netId, netId),
        inArray(wishlistCourses.courseCode, allCourseCodes),
      ),
    );

  if (action === 'add') {
    const defaultCourseCode = allCourseCodes.find((code) => code !== '')!;
    winston.info(`Wishlisting course ${defaultCourseCode} for user ${netId}`);
    if (existing) {
      res.status(400).json({ error: 'ALREADY_WISHLISTED' });
      return;
    }
    await db.insert(wishlistCourses).values({
      netId,
      courseCode: defaultCourseCode,
    });
  } else {
    if (!existing) {
      res.status(400).json({ error: 'NOT_WISHLISTED' });
      return;
    }
    winston.info(
      `Removing wish for course ${existing.courseCode} for user ${netId}`,
    );
    await db
      .delete(wishlistCourses)
      .where(
        and(
          eq(wishlistCourses.netId, netId),
          eq(wishlistCourses.courseCode, existing.courseCode),
        ),
      );
  }

  res.sendStatus(200);
};

export const getUserWishlist = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Fetching user's wishlist`);

  const { netId } = req.user!;

  winston.info(`Getting profile for user ${netId}`);
  const [studentProfile] = await db
    .selectDistinctOn([studentBluebookSettings.netId])
    .from(studentBluebookSettings)
    .where(eq(studentBluebookSettings.netId, netId));

  winston.info(`Getting wishlist for user ${netId}`);

  const wishlist = await db
    .select()
    .from(wishlistCourses)
    .where(eq(wishlistCourses.netId, netId));

  res.json({
    netId,
    evaluationsEnabled: studentProfile?.evaluationsEnabled ?? null,
    year: studentProfile?.year ?? null,
    school: studentProfile?.school ?? null,
    data: wishlistCoursesToWishlist(wishlist)[netId] ?? [],
  });
};
