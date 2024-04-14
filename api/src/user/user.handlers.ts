import type express from 'express';
import z from 'zod';
import chroma from 'chroma-js';

import {
  wishlistCoursesToWishlist,
  worksheetCoursesToWorksheets,
} from './user.utils.js';
import winston from '../logging/winston.js';

import { prisma } from '../config.js';

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

  const existing = await prisma.worksheetCourses.findUnique({
    where: {
      netId_crn_season_worksheetNumber: {
        netId,
        crn,
        season,
        worksheetNumber,
      },
    },
  });

  if (action === 'add') {
    winston.info(
      `Bookmarking course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (existing) {
      res.status(400).json({ error: 'ALREADY_BOOKMARKED' });
      return;
    }
    await prisma.worksheetCourses.create({
      data: { netId, crn, season, worksheetNumber, color },
    });
  } else if (action === 'remove') {
    winston.info(
      `Removing bookmark for course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (!existing) {
      res.status(400).json({ error: 'NOT_BOOKMARKED' });
      return;
    }
    await prisma.worksheetCourses.delete({
      where: {
        netId_crn_season_worksheetNumber: {
          netId,
          crn,
          season,
          worksheetNumber,
        },
      },
    });
  } else {
    // Update data of a bookmarked course
    winston.info(
      `Updating bookmark for course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (!existing) {
      res.status(400).json({ error: 'NOT_BOOKMARKED' });
      return;
    }
    await prisma.worksheetCourses.update({
      where: {
        netId_crn_season_worksheetNumber: {
          netId,
          crn,
          season,
          worksheetNumber,
        },
      },
      data: { color },
    });
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
  const studentProfile = await prisma.studentBluebookSettings.findUnique({
    where: {
      netId,
    },
  });

  winston.info(`Getting worksheets for user ${netId}`);
  const worksheets = await prisma.worksheetCourses.findMany({
    where: {
      netId,
    },
  });

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
  courseCode: z.string(),
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

  const { action, courseCode } = bodyParseRes.data;

  const existing = await prisma.wishlistCourses.findUnique({
    where: {
      netId_courseCode: {
        netId,
        courseCode,
      },
    },
  });

  if (action === 'add') {
    winston.info(`Wishlisting course ${courseCode} for user ${netId}`);
    if (existing) {
      res.status(400).json({ error: 'ALREADY_WISHLISTED' });
      return;
    }
    await prisma.wishlistCourses.create({
      data: { netId, courseCode },
    });
  } else {
    winston.info(`Removing wish for course ${courseCode} for user ${netId}`);
    if (!existing) {
      res.status(400).json({ error: 'NOT_WISHLISTED' });
      return;
    }
    await prisma.wishlistCourses.delete({
      where: {
        netId_courseCode: {
          netId,
          courseCode,
        },
      },
    });
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
  const studentProfile = await prisma.studentBluebookSettings.findUnique({
    where: {
      netId,
    },
  });

  winston.info(`Getting wishlist for user ${netId}`);
  const wishlist = await prisma.wishlistCourses.findMany({
    where: {
      netId,
    },
  });

  res.json({
    netId,
    evaluationsEnabled: studentProfile?.evaluationsEnabled ?? null,
    year: studentProfile?.year ?? null,
    school: studentProfile?.school ?? null,
    data: wishlistCoursesToWishlist(wishlist)[netId] ?? {},
  });
};
