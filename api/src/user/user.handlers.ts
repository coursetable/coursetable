/**
 * @file Handlers for working with user accounts.
 */

import express from 'express';

import winston from '../logging/winston';

import { prisma } from '../config';
import { WorksheetCourses, WorksheetNames } from '@prisma/client';

/**
 * Toggle a bookmarked course in a worksheet.
 *
 * @param req - express request object
 * @param res - express response object
 */
export const toggleBookmark = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  winston.info('Toggling course bookmark');

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  const { action, season, ociId, worksheet_number } = req.body;

  // Add a bookmarked course
  if (action === 'add') {
    winston.info(
      `Bookmarking course ${ociId} in season ${season} for user ${netId} in worksheet ${worksheet_number}`,
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
      `Removing bookmark for course ${ociId} in season ${season} for user ${netId} in worksheet ${worksheet_number}`,
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
  res: express.Response,
): Promise<express.Response> => {
  winston.info(`Fetching user's worksheets`);

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

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

  winston.info(`Getting worksheet names for user ${netId}`);
  const worksheet_names = await prisma.worksheetNames.findMany({
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
    worksheetNames: worksheet_names.reduce(
      (map: { [key: string]: string }, worksheet: WorksheetNames) => {
        map[worksheet.worksheet_number.toString()] = worksheet.name;
        return map;
      },
      {},
    ),
  });
};

export const changeWorksheetName = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {

  if (!req.user) {
    return res.status(401).json({ success: false });
  }

  if (
    !req.query ||
    typeof req.query.number !== 'string' ||
    typeof req.query.name !== 'string'
  ) {
    return res.status(401).json({ success: false });
  }

  const { netId } = req.user;
  const { number, name } = req.query;

  try {
    await prisma.$transaction([
      prisma.worksheetNames.upsert({
        where: {
          net_id_worksheet_number: {
            net_id: netId,
            worksheet_number: parseInt(number, 10),
          },
        },
        update: {
          name: name,
        },
        create: {
          net_id: netId,
          worksheet_number: parseInt(number, 10),
          name: name,
        }
      })
    ]);
    
    return res.json({ success: true });
  } catch(err) {
    winston.error(`Error with updating worksheet name: ${err}`);
    return res.status(500).json({ success: false });
  }
};

export const addWorksheet = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  if (!req.user) {
    return res.status(401).json({ success: false });
  }

  if (
    !req.query ||
    typeof req.query.number !== 'string' ||
    typeof req.query.name !== 'string'
  ) {
    return res.status(401).json({ success: false });
  }

  const { netId } = req.user;
  const { number, name } = req.query;

  try {
    await prisma.worksheetNames.create({
      data: {
        net_id: netId,
        worksheet_number: parseInt(number, 10),
        name: name,
      }
    });

    return res.json({ success: true });
  } catch(err) {
    winston.error(`Error with adding new worksheet: ${err}`);
    return res.status(500).json({ success: false });
  }
};

export const deleteWorksheet = async (
  req: express.Request,
  res: express.Response,
): Promise<express.Response> => {
  if (!req.user) {
    return res.status(401).json({ success: false });
  }

  if (
    !req.query ||
    typeof req.query.number !== 'string'
  ) {
    return res.status(401).json({ success: false });
  }

  const { netId } = req.user;
  const { number } = req.query;

  try {
    await prisma.worksheetNames.delete({
      where: {
        net_id_worksheet_number: {
          net_id: netId,
          worksheet_number: parseInt(number, 10),
        },
      }
    });

    return res.json({ success: true });
  } catch(err) {
    winston.error(`Error with deleting worksheet: ${err}`);
    return res.status(500).json({ success: false });
  }
};
