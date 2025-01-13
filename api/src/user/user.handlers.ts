import type express from 'express';
import chroma from 'chroma-js';
import { and, count, eq, inArray } from 'drizzle-orm';
import z from 'zod';

import { getNextAvailableWsNumber, worksheetListToMap } from './user.utils.js';

import {
  studentBluebookSettings,
  worksheetCourses,
  worksheets,
  wishlistCourses,
} from '../../drizzle/schema.js';
import { db } from '../config.js';

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
  // Only the main worksheet can be implicitly created
  if (!existingMeta && action === 'add' && worksheetNumber === 0) {
    [existingMeta] = await db
      .insert(worksheets)
      .values({
        netId,
        season,
        worksheetNumber,
        name: 'Main Worksheet',
      })
      .returning({ id: worksheets.id });
  }
  if (!existingMeta) return 'WORKSHEET_NOT_FOUND';
  const existing = await db.query.worksheetCourses.findFirst({
    where: and(
      eq(worksheetCourses.worksheetId, existingMeta.id),
      eq(worksheetCourses.crn, crn),
    ),
  });

  if (action === 'add') {
    if (existing) return 'ALREADY_BOOKMARKED';
    await db.insert(worksheetCourses).values({
      worksheetId: existingMeta.id,
      crn,
      color,
      hidden,
    });
  } else if (action === 'remove') {
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
    // Only implicitly delete the main worksheet if it's empty
    if (numCoursesInCurWorksheet === 0 && worksheetNumber === 0)
      await db.delete(worksheets).where(eq(worksheets.id, existingMeta.id));
  } else {
    if (!existing) return 'NOT_BOOKMARKED';
    await db
      .update(worksheetCourses)
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
  worksheetNumber: z.number().int().min(1),
});

const RenameWorksheetSchema = z.object({
  action: z.literal('rename'),
  season: z.string().transform((val) => parseInt(val, 10)),
  worksheetNumber: z.number().int().min(1),
  name: z.string().max(64),
});

const SetPrivateWorksheetSchema = z.object({
  action: z.literal('setPrivate'),
  season: z.string().transform((val) => parseInt(val, 10)),
  worksheetNumber: z.number().int().min(0),
  private: z.boolean(),
});

const UpdateWorksheetMetadataSchema = z.union([
  AddWorksheetSchema,
  DeleteWorksheetSchema,
  RenameWorksheetSchema,
  SetPrivateWorksheetSchema,
]);

export const updateWorksheetMetadata = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = UpdateWorksheetMetadataSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { action, season } = bodyParseRes.data;

  if (action === 'add') {
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
    res.sendStatus(200);
  } else if (action === 'rename') {
    const { worksheetNumber, name } = bodyParseRes.data;

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
    res.sendStatus(200);
  } else {
    const { worksheetNumber, private: isPrivate } = bodyParseRes.data;

    const updatedWorksheets = await db
      .update(worksheets)
      .set({ private: isPrivate })
      .where(
        and(
          eq(worksheets.netId, netId),
          eq(worksheets.season, season),
          eq(worksheets.worksheetNumber, worksheetNumber),
        ),
      )
      .returning({ worksheetNumber: worksheets.worksheetNumber });

    if (updatedWorksheets.length === 0) {
      res.status(400).json({ error: 'WORKSHEET_NOT_FOUND' });
      return;
    }
  }
};

const UpdateWishlistCourseReqBodySchema = z.object({
  action: z.union([z.literal('add'), z.literal('remove')]),
  season: z.string().transform((val) => parseInt(val, 10)),
  crn: z.number(),
});

export const updateWishlistCourses = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = UpdateWishlistCourseReqBodySchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { action, season, crn } = bodyParseRes.data;

  const [existing] = await db
    .selectDistinctOn([
      wishlistCourses.netId,
      wishlistCourses.season,
      wishlistCourses.crn,
    ])
    .from(wishlistCourses)
    .where(
      and(
        eq(wishlistCourses.netId, netId),
        eq(wishlistCourses.season, season),
        eq(wishlistCourses.crn, crn),
      ),
    );

  if (action === 'add') {
    if (existing) {
      res.status(400).json({ error: 'ALREADY_BOOKMARKED' });
      return;
    }
    await db.insert(wishlistCourses).values({
      netId,
      season,
      crn,
    });
  } else {
    if (!existing) {
      res.status(400).json({ error: 'NOT_BOOKMARKED' });
      return;
    }
    await db
      .delete(wishlistCourses)
      .where(
        and(
          eq(wishlistCourses.netId, netId),
          eq(wishlistCourses.season, season),
          eq(wishlistCourses.crn, crn),
        ),
      );
  }

  res.sendStatus(200);
};

export const getUserWishlist = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const data = await db
    .select({ season: wishlistCourses.season, crn: wishlistCourses.crn })
    .from(wishlistCourses)
    .where(eq(wishlistCourses.netId, netId));

  res.json({
    data: data.map(({ season, crn }) => ({ season: String(season), crn })),
  });
};
