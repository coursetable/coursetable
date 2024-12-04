import type express from 'express';
import chroma from 'chroma-js';
import { and, count, eq, inArray } from 'drizzle-orm';
import z from 'zod';

import { getNextAvailableWsNumber, worksheetListToMap } from './user.utils.js';

import {
  studentBluebookSettings,
  worksheetCourses,
  worksheets,
} from '../../drizzle/schema.js';
import { db } from '../config.js';
import winston from '../logging/winston.js';

const UpdateWorksheetCourseReqItemSchema = z.intersection(
  z.object({
    season: z.string().transform((val) => parseInt(val, 10)),
    worksheetNumber: z.number(),
    crn: z.number(),
  }),
  z.union([
    z.object({
      action: z.literal('add'),
      color: z.string().refine((val) => chroma.valid(val)),
      hidden: z.boolean(),
    }),
    z.object({
      action: z.literal('remove'),
      // We still allow these because the frontend sends them (it just sends
      // everything about the course for both add and remove)
      color: z
        .string()
        .refine((val) => chroma.valid(val))
        .optional(), // Ignored
      hidden: z.boolean().optional(), // Ignored
    }),
    z.object({
      action: z.literal('update'),
      color: z
        .string()
        .refine((val) => chroma.valid(val))
        .optional(),
      hidden: z.boolean().optional(),
    }),
  ]),
);

const UpdateWorksheetCoursesReqBodySchema = z.union([
  UpdateWorksheetCourseReqItemSchema,
  z.array(UpdateWorksheetCourseReqItemSchema),
]);

async function updateWorksheetCourse(
  {
    action,
    season,
    crn,
    worksheetNumber,
    color,
    hidden,
  }: z.infer<typeof UpdateWorksheetCourseReqItemSchema>,
  netId: string,
): Promise<string | undefined> {
  let existingMeta = await db.query.worksheets.findFirst({
    where: and(
      eq(worksheets.netId, netId),
      eq(worksheets.season, season),
      eq(worksheets.worksheetNumber, worksheetNumber),
    ),
    columns: { id: true },
  });
  // To be removed once add/remove/rename worksheets is pushed.
  if (!existingMeta) {
    [existingMeta] = await db
      .insert(worksheets)
      .values({
        netId,
        season,
        worksheetNumber,
        name:
          worksheetNumber === 0
            ? 'Main Worksheet'
            : `Worksheet ${worksheetNumber}`,
      })
      .returning({ id: worksheets.id });
  }
  if (!existingMeta) throw new Error('Failed to create worksheet');
  const existing = await db.query.worksheetCourses.findFirst({
    where: and(
      eq(worksheetCourses.worksheetId, existingMeta.id),
      eq(worksheetCourses.crn, crn),
    ),
  });

  if (action === 'add') {
    winston.info(
      `Bookmarking course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (existing) return 'ALREADY_BOOKMARKED';
    await db.insert(worksheetCourses).values({
      worksheetId: existingMeta.id,
      crn,
      color,
      hidden,
    });
  } else if (action === 'remove') {
    winston.info(
      `Removing bookmark for course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (!existing) return 'NOT_BOOKMARKED';
    await db
      .delete(worksheetCourses)
      .where(
        and(
          eq(worksheetCourses.worksheetId, existingMeta.id),
          eq(worksheetCourses.crn, crn),
        ),
      );

    const courseCountRes = await db
      .select({ courseCount: count() })
      .from(worksheetCourses)
      .where(eq(worksheetCourses.worksheetId, existingMeta.id));

    const numCoursesInCurWorksheet = courseCountRes[0]?.courseCount ?? 0;
    if (numCoursesInCurWorksheet === 0)
      await db.delete(worksheets).where(eq(worksheets.id, existingMeta.id));
  } else {
    // Update data of a bookmarked course
    winston.info(
      `Updating bookmark for course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (!existing) return 'NOT_BOOKMARKED';
    await db
      .update(worksheetCourses)
      // Currently the frontend is not capable of actually syncing the hidden
      // state so we keep it as null. This allows it to be properly synced in
      // the future
      .set({ color, hidden })
      .where(
        and(
          eq(worksheetCourses.worksheetId, existingMeta.id),
          eq(worksheetCourses.crn, crn),
        ),
      );
  }
  return undefined;
}

export const updateWorksheetCourses = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info('Toggling course bookmark');

  const { netId } = req.user!;

  const bodyParseRes = UpdateWorksheetCoursesReqBodySchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }
  if (!Array.isArray(bodyParseRes.data)) {
    const result = await updateWorksheetCourse(bodyParseRes.data, netId);
    if (result) {
      res.status(400).json({ error: result });
      return;
    }
  } else {
    const results = await Promise.all(
      bodyParseRes.data.map((item) => updateWorksheetCourse(item, netId)),
    );
    if (results.some((r) => r !== undefined)) {
      res.status(400).json({
        error: Object.fromEntries(
          [...results.entries()].filter((x) => x[1] !== undefined),
        ),
      });
      return;
    }
  }
  res.sendStatus(200);
};

export const getUserInfo = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const studentProfile = await db.query.studentBluebookSettings.findFirst({
    where: eq(studentBluebookSettings.netId, netId),
    columns: {
      netId: true,
      firstName: true,
      lastName: true,
      email: true,
      evaluationsEnabled: true,
      year: true,
      school: true,
      major: true,
    },
  });

  res.json({
    netId,
    firstName: studentProfile?.firstName ?? null,
    lastName: studentProfile?.lastName ?? null,
    email: studentProfile?.email ?? null,
    hasEvals: studentProfile?.evaluationsEnabled ?? false,
    year: studentProfile?.year ?? null,
    school: studentProfile?.school ?? null,
    major: studentProfile?.major ?? null,
  });
};

export const getUserWorksheet = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  winston.info(`Getting worksheets for user ${netId}`);

  const userWorksheets = await db.query.worksheets.findMany({
    where: eq(worksheets.netId, netId),
    columns: {
      netId: true,
      season: true,
      worksheetNumber: true,
      name: true,
    },
    with: {
      courses: {
        columns: {
          crn: true,
          color: true,
          hidden: true,
        },
      },
    },
  });

  const allWorksheets = worksheetListToMap(userWorksheets);
  res.json({
    data: allWorksheets[netId] ?? {},
  });
};

const AddWorksheetSchema = z.object({
  action: z.literal('add'),
  season: z.string().transform((val) => parseInt(val, 10)),
  name: z.string().max(64),
});

const DeleteWorksheetSchema = z.object({
  action: z.literal('delete'),
  season: z.string().transform((val) => parseInt(val, 10)),
  worksheetNumber: z.number(),
});

const RenameWorksheetSchema = z.object({
  action: z.literal('rename'),
  season: z.string().transform((val) => parseInt(val, 10)),
  worksheetNumber: z.number(),
  name: z.string().max(64),
});

const UpdateWorksheetMetadataSchema = z.union([
  AddWorksheetSchema,
  DeleteWorksheetSchema,
  RenameWorksheetSchema,
]);

export const updateWorksheetMetadata = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info('Updating worksheets metadata');

  const { netId } = req.user!;

  const bodyParseRes = UpdateWorksheetMetadataSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { action, season } = bodyParseRes.data;

  if (action === 'add') {
    winston.info(`Adding worksheet for user ${netId}`);

    const { name } = bodyParseRes.data;

    const worksheetNumbersRes = await db.query.worksheets.findMany({
      where: and(eq(worksheets.netId, netId), eq(worksheets.season, season)),
      columns: { worksheetNumber: true },
    });

    const worksheetNumbers = worksheetNumbersRes.map(
      (row) => row.worksheetNumber,
    );

    const nextAvailableWsNumber = getNextAvailableWsNumber(worksheetNumbers);

    await db.insert(worksheets).values({
      netId,
      season,
      worksheetNumber: nextAvailableWsNumber,
      name,
    });
    res.json({
      worksheetNumber: nextAvailableWsNumber,
    });
  } else if (action === 'delete') {
    const { worksheetNumber } = bodyParseRes.data;

    winston.info(
      `Deleting worksheet courses from worksheet ${worksheetNumber} for user ${netId}`,
    );

    await db.delete(worksheetCourses).where(
      inArray(
        worksheetCourses.worksheetId,
        db
          .select({ id: worksheets.id })
          .from(worksheets)
          .where(
            and(
              eq(worksheets.netId, netId),
              eq(worksheets.season, season),
              eq(worksheets.worksheetNumber, worksheetNumber),
            ),
          ),
      ),
    );

    winston.info(`Deleting worksheet ${worksheetNumber} for user ${netId}`);
    const deletedWorksheets = await db
      .delete(worksheets)
      .where(
        and(
          eq(worksheets.netId, netId),
          eq(worksheets.season, season),
          eq(worksheets.worksheetNumber, worksheetNumber),
        ),
      )
      .returning({ worksheetNumber: worksheets.worksheetNumber });

    if (deletedWorksheets.length === 0) {
      res.status(400).json({ error: 'WORKSHEET_NOT_FOUND' });
      return;
    }
  } else {
    const { worksheetNumber, name } = bodyParseRes.data;

    winston.info(
      `Renaming worksheet ${worksheetNumber} for user ${netId} to "${name}"`,
    );
    const renamedWorksheets = await db
      .update(worksheets)
      .set({ name })
      .where(
        and(
          eq(worksheets.netId, netId),
          eq(worksheets.season, season),
          eq(worksheets.worksheetNumber, worksheetNumber),
        ),
      )
      .returning({ worksheetNumber: worksheets.worksheetNumber });

    if (renamedWorksheets.length === 0) {
      res.status(400).json({ error: 'WORKSHEET_NOT_FOUND' });
      return;
    }
  }

  res.sendStatus(200);
};
