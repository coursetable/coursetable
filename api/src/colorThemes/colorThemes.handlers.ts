import type express from 'express';
import { and, asc, count, eq, inArray } from 'drizzle-orm';
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
  const [updated] = await db
    .update(colorThemes)
    .set({ name, colors })
    .where(editableTheme(id, netId))
    .returning(themeColumns);

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

  const { id } = bodyParseRes.data;
  const theme = await db.query.colorThemes.findFirst({
    where: editableTheme(id, netId),
    columns: { id: true },
  });
  if (!theme) {
    res.status(404).json({ error: 'THEME_NOT_FOUND' });
    return;
  }

  await db.transaction(async (tx) => {
    // Courses keep their colors but no longer follow a theme. This has to
    // happen first: deleting the theme clears worksheets' colorThemeId
    // (falling back to the default theme), after which we can't find them.
    await tx
      .update(worksheetCourses)
      .set({ colorIndex: null })
      .where(
        inArray(
          worksheetCourses.worksheetId,
          tx
            .select({ id: worksheets.id })
            .from(worksheets)
            .where(
              and(eq(worksheets.netId, netId), eq(worksheets.colorThemeId, id)),
            ),
        ),
      );
    await tx.delete(colorThemes).where(eq(colorThemes.id, id));
  });
  res.sendStatus(200);
};
