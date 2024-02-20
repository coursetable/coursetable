/**
 * @file Handlers for working with user accounts.
 */

import type express from 'express';
import z from 'zod';
import chroma from 'chroma-js';

import { worksheetCoursesToWorksheets } from './user.utils';
import winston from '../logging/winston';

import { prisma } from '../config';

const ToggleBookmarkReqBodySchema = z.object({
  action: z.union([z.literal('add'), z.literal('remove')]),
  season: z.string().transform((val) => parseInt(val, 10)),
  crn: z.number(),
  worksheetNumber: z.number(),
  color: z.string().refine((val) => chroma.valid(val)),
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
    // Add a bookmarked course
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
  } else {
    // Remove a bookmarked course
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
    data: worksheetCoursesToWorksheets(worksheets)[netId] ?? {},
  });
};
