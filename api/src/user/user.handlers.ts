import type express from 'express';
import chroma from 'chroma-js';
import { and, count, eq, inArray } from 'drizzle-orm';
import z from 'zod';

import { getSdk } from './user.queries.js';
import {
  getNextAvailableWsNumber,
  worksheetListToMap,
  fetchSameCourseIdMappings,
} from './user.utils.js';

import {
  colorThemes,
  studentBluebookSettings,
  worksheetCourses,
  worksheets,
  wishlistCourses,
} from '../../drizzle/schema.js';
import { ensureColorThemesSeeded } from '../colorThemes/colorThemes.utils.js';
import { db, graphqlClient } from '../config.js';

// Position in the worksheet's theme; null for a custom color
const ColorIndexSchema = z.number().int().min(0).max(9).nullable();

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
      colorIndex: ColorIndexSchema.optional(),
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
      colorIndex: ColorIndexSchema.optional(),
      hidden: z.boolean().optional(),
    }),
  ]),
);

const UpdateWorksheetCoursesReqBodySchema = z.union([
  UpdateWorksheetCourseReqItemSchema,
  z.array(UpdateWorksheetCourseReqItemSchema),
]);

async function updateWorksheetCourse(
  body: z.infer<typeof UpdateWorksheetCourseReqItemSchema>,
  netId: string,
): Promise<string | undefined> {
  const { action, season, crn, worksheetNumber, color, hidden } = body;
  // A color sent without a position (e.g. from an older client) is custom
  const colorIndex =
    'colorIndex' in body && body.colorIndex !== undefined
      ? body.colorIndex
      : color === undefined
        ? undefined
        : null;
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
    // Concurrent double-adds can both pass the existence check above; treat
    // unique conflicts as the same already-bookmarked outcome.
    const [created] = await db
      .insert(worksheetCourses)
      .values({
        worksheetId: existingMeta.id,
        crn,
        color,
        colorIndex,
        hidden,
      })
      .onConflictDoNothing({
        target: [worksheetCourses.worksheetId, worksheetCourses.crn],
      })
      .returning({ id: worksheetCourses.id });
    if (!created) return 'ALREADY_BOOKMARKED';
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
      .set({ color, colorIndex, hidden })
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
      preferredFirstName: true,
      preferredLastName: true,
      email: true,
      evaluationsEnabled: true,
      evaluationsRevoked: true,
      year: true,
      school: true,
      major: true,
    },
  });

  res.json({
    netId,
    firstName:
      studentProfile?.preferredFirstName ?? studentProfile?.firstName ?? null,
    lastName:
      studentProfile?.preferredLastName ?? studentProfile?.lastName ?? null,
    email: studentProfile?.email ?? null,
    hasEvals:
      Boolean(studentProfile?.evaluationsEnabled) &&
      !studentProfile?.evaluationsRevoked,
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

  await ensureColorThemesSeeded(netId);
  const userWorksheets = await db.query.worksheets.findMany({
    where: eq(worksheets.netId, netId),
    columns: {
      netId: true,
      season: true,
      worksheetNumber: true,
      name: true,
      private: true,
      lockCustomColors: true,
      colorThemeId: true,
    },
    with: {
      courses: {
        columns: {
          crn: true,
          color: true,
          colorIndex: true,
          hidden: true,
        },
      },
    },
  });

  const allWorksheets = worksheetListToMap(userWorksheets);

  // Collect all unique CRNs grouped by season
  const seasonCrnMap = new Map<string, Set<number>>();
  for (const worksheetsBySeason of Object.values(allWorksheets)) {
    for (const [seasonCode, worksheetsByNum] of Object.entries(
      worksheetsBySeason,
    )) {
      if (!seasonCrnMap.has(seasonCode))
        seasonCrnMap.set(seasonCode, new Set());

      for (const worksheet of Object.values(worksheetsByNum)) {
        for (const course of worksheet.courses)
          seasonCrnMap.get(seasonCode)!.add(course.crn);
      }
    }
  }

  // Fetch sameCourseId mappings
  const { sameCourseIdToCrns } = await fetchSameCourseIdMappings(
    seasonCrnMap,
    graphqlClient,
    getSdk,
  );

  // Build worksheet data without sameCourseId on individual courses
  const worksheetData = allWorksheets[netId] ?? {};

  // Convert sameCourseIdToCrns Map to plain object
  const sameCourseIdToCrnsObj: { [key: string]: number[] } = {};
  for (const [sameCourseId, crns] of sameCourseIdToCrns.entries())
    sameCourseIdToCrnsObj[String(sameCourseId)] = crns;

  res.json({
    data: worksheetData,
    sameCourseIdToCrns: sameCourseIdToCrnsObj,
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

const SetLockCustomColorsWorksheetSchema = z.object({
  action: z.literal('setLockCustomColors'),
  season: z.string().transform((val) => parseInt(val, 10)),
  worksheetNumber: z.number().int().min(0),
  lockCustomColors: z.boolean(),
});

const SetColorThemeWorksheetSchema = z.object({
  action: z.literal('setColorTheme'),
  season: z.string().transform((val) => parseInt(val, 10)),
  worksheetNumber: z.number().int().min(0),
  colorThemeId: z.number().int().positive(),
  // Courses recolored for the new theme, saved together with it
  courses: z.array(
    z.object({
      crn: z.number(),
      color: z.string().refine((val) => chroma.valid(val)),
      colorIndex: ColorIndexSchema,
    }),
  ),
});

const UpdateWorksheetMetadataSchema = z.union([
  AddWorksheetSchema,
  DeleteWorksheetSchema,
  RenameWorksheetSchema,
  SetPrivateWorksheetSchema,
  SetLockCustomColorsWorksheetSchema,
  SetColorThemeWorksheetSchema,
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
  } else if (action === 'setColorTheme') {
    const { worksheetNumber, colorThemeId, courses } = bodyParseRes.data;

    const theme = await db.query.colorThemes.findFirst({
      where: and(
        eq(colorThemes.id, colorThemeId),
        eq(colorThemes.netId, netId),
      ),
      columns: { id: true },
    });
    if (!theme) {
      res.status(400).json({ error: 'THEME_NOT_FOUND' });
      return;
    }

    // One transaction, so the worksheet never ends up with the new theme but
    // the old colors (or the reverse)
    const updated = await db.transaction(async (tx) => {
      const [worksheet] = await tx
        .update(worksheets)
        .set({ colorThemeId })
        .where(
          and(
            eq(worksheets.netId, netId),
            eq(worksheets.season, season),
            eq(worksheets.worksheetNumber, worksheetNumber),
          ),
        )
        .returning({ id: worksheets.id });
      if (!worksheet) return false;
      // A course that's no longer in the worksheet just matches nothing
      await Promise.all(
        courses.map(({ crn, color, colorIndex }) =>
          tx
            .update(worksheetCourses)
            .set({ color, colorIndex })
            .where(
              and(
                eq(worksheetCourses.worksheetId, worksheet.id),
                eq(worksheetCourses.crn, crn),
              ),
            ),
        ),
      );
      return true;
    });

    if (!updated) {
      res.status(400).json({ error: 'WORKSHEET_NOT_FOUND' });
      return;
    }
    res.sendStatus(200);
  } else if (action === 'setLockCustomColors') {
    const { worksheetNumber, lockCustomColors } = bodyParseRes.data;

    const updatedWorksheets = await db
      .update(worksheets)
      .set({ lockCustomColors })
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
    res.sendStatus(200);
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
