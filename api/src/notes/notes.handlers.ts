import type express from 'express';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { courseNotes } from '../../drizzle/schema.js';
import { db } from '../config.js';

const SameCourseIdSchema = z.number().int().positive();

const LookupCourseNoteSchema = z.object({
  sameCourseId: SameCourseIdSchema,
});

const MAX_NOTE_BYTES = 60_000;

function isTiptapDoc(content: string) {
  try {
    const doc: unknown = JSON.parse(content);
    return (
      typeof doc === 'object' &&
      doc !== null &&
      (doc as { type?: unknown }).type === 'doc' &&
      Array.isArray((doc as { content?: unknown }).content)
    );
  } catch {
    return false;
  }
}

const SaveCourseNoteSchema = z.object({
  sameCourseId: SameCourseIdSchema,
  content: z
    .string()
    .refine((content) => Buffer.byteLength(content, 'utf8') <= MAX_NOTE_BYTES)
    .refine((content) => content === '' || isTiptapDoc(content)),
});

export const lookupCourseNote = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = LookupCourseNoteSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const [note] = await db
    .select({ content: courseNotes.content })
    .from(courseNotes)
    .where(
      and(
        eq(courseNotes.netId, netId),
        eq(courseNotes.sameCourseId, bodyParseRes.data.sameCourseId),
      ),
    );

  res.set('Cache-Control', 'no-store');
  res.json({ content: note?.content ?? '' });
};

export const listCourseNotes = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const notes = await db
    .select({
      sameCourseId: courseNotes.sameCourseId,
      content: courseNotes.content,
      updatedAt: courseNotes.updatedAt,
    })
    .from(courseNotes)
    .where(eq(courseNotes.netId, netId));

  res.set('Cache-Control', 'no-store');
  res.json({ notes });
};

export const saveCourseNote = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = SaveCourseNoteSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { sameCourseId, content } = bodyParseRes.data;

  if (content) {
    const updatedAt = Date.now();
    await db
      .insert(courseNotes)
      .values({ netId, sameCourseId, content, updatedAt })
      .onConflictDoUpdate({
        target: [courseNotes.netId, courseNotes.sameCourseId],
        set: { content, updatedAt },
      });
  } else {
    await db
      .delete(courseNotes)
      .where(
        and(
          eq(courseNotes.netId, netId),
          eq(courseNotes.sameCourseId, sameCourseId),
        ),
      );
  }

  res.sendStatus(200);
};
