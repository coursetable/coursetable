/**
 * @file Handlers for working with user accounts.
 */

import express from 'express';

import winston from '../logging/winston';

import { POSTHOG_CLIENT, prisma } from '../config';
import { WorksheetCourses } from '@prisma/client';

/**
 * Toggle a bookmarked course in a worksheet.
 *
 * @param req - express request object
 * @param res - express response object
 */
export const toggleBookmark = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info('Toggling course bookmark');

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  const { action, season, ociId, worksheet_number } = req.body;

  POSTHOG_CLIENT.capture({
    distinctId: netId,
    event: 'toggle-bookmark',
    properties: {
      action,
      season,
      ociId,
      worksheet_number,
    },
  });

  // Add a bookmarked course
  if (action === 'add') {
    winston.info(
      `Bookmarking course ${ociId} in season ${season} for user ${netId} in worksheet ${worksheet_number}`
    );
    await prisma.worksheetCourses.create({
      data: {
        net_id: netId,
        oci_id: parseInt(ociId, 10),
        season: parseInt(season, 10),
        worksheet_number,
      },
    });
  }
  // Remove a bookmarked course
  else if (action === 'remove') {
    winston.info(
      `Removing bookmark for course ${ociId} in season ${season} for user ${netId} in worksheet ${worksheet_number}`
    );
    await prisma.worksheetCourses.deleteMany({
      where: {
        net_id: netId,
        oci_id: parseInt(ociId, 10),
        season: parseInt(season, 10),
        worksheet_number,
      },
    });
  }

  return res.json({ success: true });
};

/**
 * Get a user's personal worksheet.
 *
 * @param req - express request object
 * @param res - express response object
 */
export const getUserWorksheet = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info(`Fetching user's worksheets`);

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  POSTHOG_CLIENT.capture({
    distinctId: netId,
    event: 'fetch-worksheets',
  });

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
      net_id: netId,
    },
  });

  return res.json({
    success: true,
    netId,
    evaluationsEnabled: studentProfile?.evaluationsEnabled,
    year: studentProfile?.year,
    school: studentProfile?.school,
    data: worksheets.map((course: WorksheetCourses) => [
      String(course.season),
      String(course.oci_id),
      String(course.worksheet_number),
    ]),
  });
};
