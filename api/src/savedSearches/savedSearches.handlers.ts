import type express from 'express';
import { and, eq, desc } from 'drizzle-orm';
import z from 'zod';

import { savedSearches } from '../../drizzle/schema.js';
import { db } from '../config.js';
import winston from '../logging/winston.js';

/** PostgreSQL error code for unique_violation */
const PG_UNIQUE_VIOLATION = '23505';

function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; cause?: { code?: string } };
  return (
    e.code === PG_UNIQUE_VIOLATION || e.cause?.code === PG_UNIQUE_VIOLATION
  );
}

const CreateSavedSearchSchema = z.object({
  name: z.string().min(1).max(64),
  queryString: z.string().max(2048),
});

const UpdateSavedSearchSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(64),
});

const DeleteSavedSearchSchema = z.object({
  id: z.number(),
});

export const getSavedSearches = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const netId = req.user?.netId;
  if (!netId) {
    winston.warn('getSavedSearches: no user/netId on request');
    res.status(401).json({ error: 'USER_NOT_FOUND' });
    return;
  }

  const searches = await db.query.savedSearches.findMany({
    where: eq(savedSearches.netId, netId),
    columns: {
      id: true,
      name: true,
      queryString: true,
      createdAt: true,
    },
    orderBy: [desc(savedSearches.createdAt)],
  });

  winston.info(
    `getSavedSearches: netId=${netId} returning ${searches.length} searches`,
  );
  res.json({ data: searches });
};

export const createSavedSearch = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = CreateSavedSearchSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { name, queryString } = bodyParseRes.data;

  // Optimistic duplicate check; DB unique constraint enforces atomically
  const existing = await db.query.savedSearches.findFirst({
    where: and(eq(savedSearches.netId, netId), eq(savedSearches.name, name)),
  });

  if (existing) {
    res.status(400).json({ error: 'DUPLICATE_NAME' });
    return;
  }

  try {
    const [created] = await db
      .insert(savedSearches)
      .values({
        netId,
        name,
        queryString,
        createdAt: Date.now(),
      })
      .returning({
        id: savedSearches.id,
        name: savedSearches.name,
        queryString: savedSearches.queryString,
        createdAt: savedSearches.createdAt,
      });

    res.json(created);
  } catch (err) {
    if (isUniqueViolation(err)) {
      res.status(400).json({ error: 'DUPLICATE_NAME' });
      return;
    }
    throw err;
  }
};

export const updateSavedSearch = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = UpdateSavedSearchSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { id, name } = bodyParseRes.data;

  // Verify ownership
  const existing = await db.query.savedSearches.findFirst({
    where: and(eq(savedSearches.id, id), eq(savedSearches.netId, netId)),
  });

  if (!existing) {
    res.status(404).json({ error: 'SEARCH_NOT_FOUND' });
    return;
  }

  try {
    await db
      .update(savedSearches)
      .set({ name })
      .where(and(eq(savedSearches.id, id), eq(savedSearches.netId, netId)));

    res.sendStatus(200);
  } catch (err) {
    if (isUniqueViolation(err)) {
      res.status(400).json({ error: 'DUPLICATE_NAME' });
      return;
    }
    throw err;
  }
};

export const deleteSavedSearch = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParseRes = DeleteSavedSearchSchema.safeParse(req.body);
  if (!bodyParseRes.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { id } = bodyParseRes.data;

  // Verify ownership before deleting
  const existing = await db.query.savedSearches.findFirst({
    where: and(eq(savedSearches.id, id), eq(savedSearches.netId, netId)),
  });

  if (!existing) {
    res.status(404).json({ error: 'SEARCH_NOT_FOUND' });
    return;
  }

  await db
    .delete(savedSearches)
    .where(and(eq(savedSearches.id, id), eq(savedSearches.netId, netId)));

  res.sendStatus(200);
};
