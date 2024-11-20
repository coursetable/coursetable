import type express from 'express';
import chroma from 'chroma-js';
import { and, count, eq, inArray } from 'drizzle-orm';
import z from 'zod';

import {
  getNextAvailableWsNumber,
  worksheetCoursesToWorksheets,
  wishlistCoursesToWishlist,
} from './user.utils.js';

import {
  studentBluebookSettings,
  worksheetCourses,
  worksheetMetadata,
  wishlistCourses,
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

  if (worksheetNumber > 0) {
    const [nameExists] = await db
      .selectDistinctOn([
        worksheetMetadata.netId,
        worksheetMetadata.season,
        worksheetMetadata.worksheetNumber,
      ])
      .from(worksheetMetadata)
      .where(
        and(
          eq(worksheetMetadata.netId, netId),
          eq(worksheetMetadata.season, season),
          eq(worksheetMetadata.worksheetNumber, worksheetNumber),
        ),
      );
    if (!nameExists) {
      await db.insert(worksheetMetadata).values({
        netId,
        season,
        worksheetNumber,
        worksheetName: `Worksheet ${worksheetNumber}`,
      });
    }
  }

  if (action === 'add') {
    winston.info(
      `Bookmarking course ${crn} in season ${season} for user ${netId} in worksheet ${worksheetNumber}`,
    );
    if (existing) return 'ALREADY_BOOKMARKED';
    await db.insert(worksheetCourses).values({
      netId,
      crn,
      season,
      worksheetNumber,
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
          eq(worksheetCourses.netId, netId),
          eq(worksheetCourses.crn, crn),
          eq(worksheetCourses.season, season),
          eq(worksheetCourses.worksheetNumber, worksheetNumber),
        ),
      );

    // Cannot delete main worksheet
    if (worksheetNumber > 0) {
      const courseCountRes = await db
        .select({ courseCount: count() })
        .from(worksheetCourses)
        .where(
          and(
            eq(worksheetCourses.netId, netId),
            eq(worksheetCourses.season, season),
            eq(worksheetCourses.worksheetNumber, worksheetNumber),
          ),
        );

      const numCoursesInCurWorksheet = courseCountRes[0]?.courseCount ?? 0;
      if (numCoursesInCurWorksheet === 0) {
        await db
          .delete(worksheetMetadata)
          .where(
            and(
              eq(worksheetMetadata.netId, netId),
              eq(worksheetMetadata.season, season),
              eq(worksheetMetadata.worksheetNumber, worksheetNumber),
            ),
          );
      }
    }
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
          eq(worksheetCourses.netId, netId),
          eq(worksheetCourses.crn, crn),
          eq(worksheetCourses.season, season),
          eq(worksheetCourses.worksheetNumber, worksheetNumber),
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

const AddWorksheetSchema = z.object({
  action: z.literal('add'),
  season: z.string().transform((val) => parseInt(val, 10)),
  worksheetName: z.string().max(64),
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
  worksheetName: z.string().max(64),
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

    const { worksheetName } = bodyParseRes.data;

    const worksheetNumbersRes = await db
      .select({ worksheetNumber: worksheetMetadata.worksheetNumber })
      .from(worksheetMetadata)
      .where(
        and(
          eq(worksheetMetadata.netId, netId),
          eq(worksheetMetadata.season, season),
        ),
      );

    const worksheetNumbers = worksheetNumbersRes.map(
      (row) => row.worksheetNumber,
    );

    const nextAvailableWsNumber = getNextAvailableWsNumber(worksheetNumbers);

    await db.insert(worksheetMetadata).values({
      netId,
      season,
      worksheetNumber: nextAvailableWsNumber,
      worksheetName,
    });
    res.json({
      worksheetNumber: nextAvailableWsNumber,
    });
  } else if (action === 'delete') {
    const { worksheetNumber } = bodyParseRes.data;

    winston.info(`Deleting worksheet ${worksheetNumber} for user ${netId}`);
    const deletedWorksheets = await db
      .delete(worksheetMetadata)
      .where(
        and(
          eq(worksheetMetadata.netId, netId),
          eq(worksheetMetadata.season, season),
          eq(worksheetMetadata.worksheetNumber, worksheetNumber),
        ),
      )
      .returning();

    if (deletedWorksheets.length === 0) {
      res.status(400).json({ error: 'WORKSHEET_NOT_FOUND' });
      return;
    }
  } else {
    const { worksheetNumber, worksheetName } = bodyParseRes.data;

    winston.info(
      `Renaming worksheet ${worksheetNumber} for user ${netId} to "${worksheetName}"`,
    );
    const renamedWorksheets = await db
      .update(worksheetMetadata)
      .set({ worksheetName })
      .where(
        and(
          eq(worksheetMetadata.netId, netId),
          eq(worksheetMetadata.season, season),
          eq(worksheetMetadata.worksheetNumber, worksheetNumber),
        ),
      )
      .returning();

    if (renamedWorksheets.length === 0) {
      res.status(400).json({ error: 'WORKSHEET_NOT_FOUND' });
      return;
    }
  }

  res.sendStatus(200);
};

export const getUserWorksheetMetadata = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  winston.info(`Fetching worksheet names for user`);

  const { netId } = req.user!;

  const allWorksheetMetadata = await db
    .select({
      season: worksheetMetadata.season,
      worksheetNumber: worksheetMetadata.worksheetNumber,
      worksheetName: worksheetMetadata.worksheetName,
    })
    .from(worksheetMetadata)
    .where(eq(worksheetMetadata.netId, netId));

  winston.info(
    `Retrieved ${allWorksheetMetadata.length} worksheets for user ${netId}`,
  );

  const worksheetMap: {
    [season: string]: { [worksheetNumber: number]: { worksheetName: string } };
  } = {};

  allWorksheetMetadata.forEach(({ season, worksheetNumber, worksheetName }) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    worksheetMap[season] ??= {};
    worksheetMap[season][worksheetNumber] ??= { worksheetName };
  });

  res.json({
    netId,
    worksheets: worksheetMap,
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
