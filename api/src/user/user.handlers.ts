/**
 * @file Handlers for working with user accounts.
 */

import type express from 'express';
import z from 'zod';

import winston from '../logging/winston';

import { prisma } from '../config';

const ToggleBookmarkReqBodySchema = z.object({
  action: z.union([z.literal('add'), z.literal('remove')]),
  season: z.string(),
  ociId: z.number(),
  worksheetNumber: z.number(),
});

/**
 * Toggle a bookmarked course in a worksheet.
 *
 * @param req - express request object
 * @param res - express response object
 */
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

  const { action, season, ociId, worksheetNumber } = bodyParseRes.data;

  if (action === 'add') {
    // Add a bookmarked course
    winston.info(
      `Bookmarking course ${ociId} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    await prisma.worksheetCourses.create({
      data: {
        netId,
        ociId,
        season: parseInt(season, 10),
        worksheetNumber,
      },
    });
  } else {
    // Remove a bookmarked course
    winston.info(
      `Removing bookmark for course ${ociId} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    await prisma.worksheetCourses.deleteMany({
      where: {
        netId,
        ociId,
        season: parseInt(season, 10),
        worksheetNumber,
      },
    });
  }

  res.sendStatus(200);
};

/**
 * Get a user's personal worksheet.
 *
 * @param req - express request object
 * @param res - express response object
 */
export const getUserWorksheet = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Fetching user's worksheets`);

  const { netId } = req.user!;

  // Get user info
  winston.info(`Getting profile for user ${netId}`);
  const studentProfile = await prisma.studentBluebookSettings.findUnique({
    where: {
      netId,
    },
  });

  // Get worksheets
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
    data: worksheets.map((course) => [
      String(course.season),
      String(course.ociId),
      String(course.worksheetNumber),
    ]),
  });
};
