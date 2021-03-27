/// <reference path="../auth/user.d.ts" />

import express from 'express';

import axios from 'axios';

import { FACEBOOK_API_ENDPOINT } from '../config';

import winston from '../logging/winston';

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const toggleBookmark = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info('Toggling course bookmark');

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  const { action, season, ociId } = req.body;

  // Add a bookmarked course
  if (action === 'add') {
    await prisma.worksheetCourses.create({
      data: {
        net_id: netId,
        oci_id: parseInt(ociId),
        season: parseInt(season),
      },
    });
  }
  // Remove a bookmarked course
  else if (action === 'remove') {
    await prisma.worksheetCourses.deleteMany({
      where: {
        net_id: netId,
        oci_id: parseInt(ociId),
        season: parseInt(season),
      },
    });
  }

  return res.json({ success: true });
};

export const getUserWorksheet = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response> => {
  winston.info(`Fetching user's worksheets`);

  if (!req.user) {
    return res.status(401).json();
  }

  const { netId } = req.user;

  // Get user info
  winston.info("Getting user's profile");
  const studentProfile = await prisma.studentBluebookSettings.findUnique({
    where: {
      netId,
    },
  });

  // Get worksheets
  winston.info("Getting user's worksheets");
  const worksheets = await prisma.worksheetCourses.findMany({
    where: {
      net_id: netId,
    },
  });

  return res.json({
    success: true,
    netId,
    evaluationsEnabled: studentProfile?.evaluationsEnabled,
    data: worksheets.map((course) => [
      String(course.season),
      String(course.oci_id),
    ]),
  });
};
