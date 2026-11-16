import type express from 'express';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { courseNotes } from '../../drizzle/schema.js';
import { db } from '../config.js';

// Numbers must stay numbers: form posts can only send strings, so this also
// stops cross-site forms from writing notes with a student's cookies.
const SameCourseIdSchema = z.number().int().positive();

const LookupCourseNoteSchema = z.object({
  sameCourseId: SameCourseIdSchema,
});

// Notes are Tiptap JSON, which spells out its formatting, so a full 5,000
// character note can be several times larger than its text. The cap leaves room
// for the quote escaping that embedding it in a JSON body adds, so a note this
// size still fits express.json()'s default 100 KB request limit.
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
  // The offering being viewed, kept so the note can be reattached later
  season: z
    .string()
    .regex(/^\d{6}$/u)
    .transform((val) => parseInt(val, 10)),
  crn: z.number().int().positive(),
  // An empty string deletes the note
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

  const { sameCourseId, season, crn, content } = bodyParseRes.data;

  if (content) {
    const updatedAt = Date.now();
    await db
      .insert(courseNotes)
      .values({ netId, sameCourseId, season, crn, content, updatedAt })
      .onConflictDoUpdate({
        target: [courseNotes.netId, courseNotes.sameCourseId],
        set: { season, crn, content, updatedAt },
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
