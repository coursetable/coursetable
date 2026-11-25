import type express from 'express';
import {
  and,
  asc,
  count,
  eq,
  inArray,
  isNotNull,
  isNull,
  sql,
} from 'drizzle-orm';
import z from 'zod';

import { ensureColorThemesSeeded } from './colorThemes.utils.js';
import {
  colorThemes,
  worksheetCourses,
  worksheets,
} from '../../drizzle/schema.js';
import { db } from '../config.js';

const MAX_THEMES_PER_USER = 32;

const ThemeBodySchema = z.object({
  name: z.string().trim().min(1).max(32),
  colors: z
    .array(z.string().regex(/^#[\da-f]{6}$/iu))
    .length(10)
    .transform((colors) => colors.map((c) => c.toLowerCase())),
});

const UpdateThemeSchema = ThemeBodySchema.extend({
  id: z.number().int().positive(),
});

const DeleteThemeSchema = z.object({
  id: z.number().int().positive(),
  // Whether worksheets using the theme keep their courses' current colors,
  // instead of switching them all to the default theme's
  keepColors: z.boolean(),
});

const themeColumns = {
  id: colorThemes.id,
  name: colorThemes.name,
  colors: colorThemes.colors,
  isDefault: colorThemes.isDefault,
};

// The default theme can't be changed, so it's treated as not found
const editableTheme = (id: number, netId: string) =>
  and(
    eq(colorThemes.id, id),
    eq(colorThemes.netId, netId),
    eq(colorThemes.isDefault, false),
  );

export const getColorThemes = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  await ensureColorThemesSeeded(netId);
  const themes = await db
    .select(themeColumns)
    .from(colorThemes)
    .where(eq(colorThemes.netId, netId))
    .orderBy(asc(colorThemes.id));

  res.json({ data: themes });
};

export const createColorTheme = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = ThemeBodySchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const [existing] = await db
    .select({ total: count() })
    .from(colorThemes)
    .where(eq(colorThemes.netId, netId));
  if (existing && existing.total >= MAX_THEMES_PER_USER) {
    res.status(400).json({ error: 'TOO_MANY_THEMES' });
    return;
  }

  const { name, colors } = bodyParseRes.data;
  const [created] = await db
    .insert(colorThemes)
    .values({ netId, name, colors })
    .returning(themeColumns);
  res.json(created);
};

export const updateColorTheme = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = UpdateThemeSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { id, name, colors } = bodyParseRes.data;
  const updated = await db.transaction(async (tx) => {
    const [theme] = await tx
      .update(colorThemes)
      .set({ name, colors })
      .where(editableTheme(id, netId))
      .returning(themeColumns);
    if (!theme) return undefined;
    // Courses on the theme's colors follow the edit; custom colors stay.
    // Postgres arrays are 1-based.
    const newColors = sql`ARRAY[${sql.join(
      colors.map((c) => sql`${c}`),
      sql`, `,
    )}]::text[]`;
    await tx
      .update(worksheetCourses)
      .set({ color: sql`(${newColors})[${worksheetCourses.colorIndex} + 1]` })
      .where(
        and(
          isNotNull(worksheetCourses.colorIndex),
          inArray(
            worksheetCourses.worksheetId,
            tx
              .select({ id: worksheets.id })
              .from(worksheets)
              .where(
                and(
                  eq(worksheets.netId, netId),
                  eq(worksheets.colorThemeId, id),
                ),
              ),
          ),
        ),
      );
    return theme;
  });

  if (!updated) {
    res.status(404).json({ error: 'THEME_NOT_FOUND' });
    return;
  }
  res.json(updated);
};

export const deleteColorTheme = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = DeleteThemeSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { id, keepColors } = bodyParseRes.data;
  const theme = await db.query.colorThemes.findFirst({
    where: editableTheme(id, netId),
    columns: { id: true },
  });
  if (!theme) {
    res.status(404).json({ error: 'THEME_NOT_FOUND' });
    return;
  }

  await db.transaction(async (tx) => {
    // Recolor first: deleting the theme clears worksheets' colorThemeId
    // (falling back to the default theme), after which we can't find them.
    const inAffectedWorksheet = inArray(
      worksheetCourses.worksheetId,
      tx
        .select({ id: worksheets.id })
        .from(worksheets)
        .where(
          and(eq(worksheets.netId, netId), eq(worksheets.colorThemeId, id)),
        ),
    );
    if (keepColors) {
      // Same colors, but no longer following a theme
      await tx
        .update(worksheetCourses)
        .set({ colorIndex: null })
        .where(inAffectedWorksheet);
    } else {
      // Every course takes a default theme color. Custom colors first get a
      // slot, picked by CRN like the frontend does so previews match.
      await tx
        .update(worksheetCourses)
        .set({ colorIndex: sql`${worksheetCourses.crn} % 10` })
        .where(and(inAffectedWorksheet, isNull(worksheetCourses.colorIndex)));
      const fallback = await tx.query.colorThemes.findFirst({
        where: and(
          eq(colorThemes.netId, netId),
          eq(colorThemes.isDefault, true),
        ),
        columns: { colors: true },
      });
      await Promise.all(
        (fallback?.colors ?? []).map((color, slot) =>
          tx
            .update(worksheetCourses)
            .set({ color })
            .where(
              and(inAffectedWorksheet, eq(worksheetCourses.colorIndex, slot)),
            ),
        ),
      );
    }
    await tx.delete(colorThemes).where(eq(colorThemes.id, id));
  });
  res.sendStatus(200);
};
