/**
 * @file Handlers for working with user accounts.
 */

import express from 'express';

import winston from '../logging/winston';

import { POSTHOG_CLIENT, prisma } from '../config';
import { WorksheetCourses, SavedCourses } from '@prisma/client';

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
        worksheet_number
      },
    });
  }

  return res.json({ success: true });
};

export const saveClassForFutureToggle = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info('Adding class to save for later');

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  const { action, season, ociId, course_code } = req.body;

  POSTHOG_CLIENT.capture({
    distinctId: netId,
    event: 'save-for-later',
    properties: {
      action,
      season,
      ociId,
    },
  });

  // Add a bookmarked course
  if (action === 'add') {
    winston.info(
      `Saving course ${ociId} in season ${season} for user ${netId}`
    );
    await prisma.savedCourses.create({
      data: {
        net_id: netId,
        oci_id: parseInt(ociId, 10),
        season: parseInt(season, 10),
        course_code,
      },
    });
  }
  // Remove a bookmarked course
  else if (action === 'remove') {
    winston.info(
      `Unsaving course ${ociId} in season ${season} for user ${netId}`
    );
    await prisma.savedCourses.deleteMany({
      where: {
        net_id: netId,
        oci_id: parseInt(ociId, 10),
        season: parseInt(season, 10),
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

// get saved courses
export const getSavedCourses = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info(`Fetching user's saved courses`);

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  POSTHOG_CLIENT.capture({
    distinctId: netId,
    event: 'fetch-saved-courses',
  });

  // Get user info
  winston.info(`Getting profile for user ${netId}`);
  const studentProfile = await prisma.studentBluebookSettings.findUnique({
    where: {
      netId,
    },
  });

  // Get saved courses
  winston.info(`Getting saved courses for user ${netId}`);
  const savedCourses = await prisma.savedCourses.findMany({
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
    data: savedCourses.map((course: SavedCourses) => [
      String(course.season),
      String(course.oci_id),
    ]),
  });
};
