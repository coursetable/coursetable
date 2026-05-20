import type express from 'express';
import asyncHandler from 'express-async-handler';

import { bodySchema } from './events.schemas.js';
import {
  isCourseTableScraperHeader,
  userAgentLooksLikeBot,
} from './eventsBotFilter.js';
import { events } from '../../drizzle/schema.js';
import { db } from '../config.js';
import winston from '../logging/winston.js';

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
      res.status(400).json({
        error: 'INVALID_REQUEST',
        details: parsed.error.flatten(),
      });
      return;
    }
    const {
      session_id: sessionId,
      client,
      app_version: appVersion,
      events: incoming,
    } = parsed.data;
    const userId = req.isAuthenticated() ? req.user.netId : `anon:${sessionId}`;

    const rows = incoming.map((ev) => ({
      userId,
      sessionId,
      eventType: ev.event_type,
      client,
      appVersion: appVersion ?? null,
      payload: ev.payload,
    }));

    try {
      await db.insert(events).values(rows);
    } catch (e) {
      winston.error('events insert failed', e);
      res.status(500).end();
      return;
    }

    res.status(204).end();
  },
);
