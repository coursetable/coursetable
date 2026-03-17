import type express from 'express';
import { and, eq, desc } from 'drizzle-orm';
import z from 'zod';

import { savedSearches } from '../../drizzle/schema.js';
import { db } from '../config.js';
import winston from '../logging/winston.js';

const CreateSavedSearchSchema = z.object({
  name: z.string().min(1).max(64),
  queryString: z.string().max(2048),
});

const DeleteSavedSearchSchema = z.object({
  id: z.number().int().positive(),
});

export const getSavedSearches = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

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

  const [created] = await db
    .insert(savedSearches)
    .values({
      netId,
      name,
      queryString,
      createdAt: Date.now(),
    })
    .onConflictDoNothing({ target: [savedSearches.netId, savedSearches.name] })
    .returning({
      id: savedSearches.id,
      name: savedSearches.name,
      queryString: savedSearches.queryString,
      createdAt: savedSearches.createdAt,
    });

  if (!created) {
    res.status(400).json({ error: 'DUPLICATE_NAME' });
    return;
  }
  res.json(created);
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

  const where = and(eq(savedSearches.id, id), eq(savedSearches.netId, netId));

  const [deleted] = await db
    .delete(savedSearches)
    .where(where)
    .returning({ id: savedSearches.id });

  if (!deleted) {
    res.status(404).json({ error: 'SEARCH_NOT_FOUND' });
    return;
  }
  res.sendStatus(200);
};
