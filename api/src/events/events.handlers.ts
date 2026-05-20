import type express from 'express';
import asyncHandler from 'express-async-handler';
import z from 'zod';

import {
  isCourseTableScraperHeader,
  userAgentLooksLikeBot,
} from './eventsBotFilter.js';
import { events } from '../../drizzle/schema.js';
import { db } from '../config.js';
import winston from '../logging/winston.js';

const incomingEventSchema = z.object({
  event_type: z.string().min(1).max(128),
  payload: z.unknown().optional(),
});

const bodySchema = z.object({
  session_id: z.string().min(8).max(200),
  client: z.string().min(1).max(64),
  app_version: z.string().max(64).optional().nullable(),
  events: z.array(incomingEventSchema).min(1).max(100),
});

export const postEvents = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    if (isCourseTableScraperHeader(req.headers['x-coursetable-bot'])) {
      res.status(403).end();
      return;
    }
    if (userAgentLooksLikeBot(req.headers['user-agent'])) {
      res.status(403).end();
      return;
    }

    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'INVALID_REQUEST' });
      return;
    }
    const {
      session_id: sessionId,
      client,
      app_version: appVersion,
      events: incoming,
    } = parsed.data;
    const userId = req.isAuthenticated() ? req.user.netId : `anon:${sessionId}`;

    const rows = incoming.map((ev) => {
      const payload =
        ev.payload !== undefined &&
        ev.payload !== null &&
        typeof ev.payload === 'object'
          ? ev.payload
          : {};
      return {
        userId,
        sessionId,
        eventType: ev.event_type,
        client,
        appVersion: appVersion ?? null,
        payload,
      };
    });

    if (rows.length > 0) {
      try {
        await db.insert(events).values(rows);
      } catch (e) {
        winston.error('events insert failed', e);
        res.status(500).end();
        return;
      }
    }

    res.status(204).end();
  },
);
