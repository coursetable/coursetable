import type express from 'express';
import { and, eq, or } from 'drizzle-orm';
import z from 'zod';

import { courseNotes } from '../../drizzle/schema.js';
import { db } from '../config.js';

// Crn must stay a number: form posts can only send strings, so this also stops
// cross-site forms from writing notes with a student's cookies.
const OfferingSchema = z.object({
  season: z
    .string()
    .regex(/^\d{6}$/u)
    .transform((val) => parseInt(val, 10)),
  crn: z.number().int().positive(),
});

const LookupCourseNotesSchema = z.object({
  offerings: z.array(OfferingSchema).min(1).max(100),
});

const SaveCourseNoteSchema = OfferingSchema.extend({
  // Larger than the editor's limit because Markdown syntax adds characters
  content: z.string().max(20000),
});

export const lookupCourseNotes = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = LookupCourseNotesSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const notes = await db
    .select({
      season: courseNotes.season,
      crn: courseNotes.crn,
      content: courseNotes.content,
    })
    .from(courseNotes)
    .where(
      and(
        eq(courseNotes.netId, netId),
        or(
          ...bodyParseRes.data.offerings.map(({ season, crn }) =>
            and(eq(courseNotes.season, season), eq(courseNotes.crn, crn)),
          ),
        ),
      ),
    );

  res.set('Cache-Control', 'no-store');
  res.json({
    data: notes.map((note) => ({ ...note, season: String(note.season) })),
  });
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

  const { season, crn, content } = bodyParseRes.data;

  if (content) {
    const updatedAt = Date.now();
    await db
      .insert(courseNotes)
      .values({ netId, season, crn, content, updatedAt })
      .onConflictDoUpdate({
        target: [courseNotes.netId, courseNotes.season, courseNotes.crn],
        set: { content, updatedAt },
      });
  } else {
    await db
      .delete(courseNotes)
      .where(
        and(
          eq(courseNotes.netId, netId),
          eq(courseNotes.season, season),
          eq(courseNotes.crn, crn),
        ),
      );
  }

  res.sendStatus(200);
};
