import { timingSafeEqual } from 'node:crypto';

import type express from 'express';
import { and, eq, inArray } from 'drizzle-orm';
import z from 'zod';

import { sendCourseUpdateEmail } from './email.js';
import {
  fetchListingsForAlerts,
  type ListingAlertRow,
} from './hasuraListings.js';
import {
  courseAlertSubscriptions,
  studentBluebookSettings,
} from '../../drizzle/schema.js';
import {
  COURSE_ALERT_CRON_SECRET,
  RESEND_API_KEY,
  db,
  isDev,
} from '../config.js';
import winston from '../logging/winston.js';

function parseCatalogTimestampMs(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) {
    const t = value.getTime();
    return Number.isFinite(t) ? t : null;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : null;
  }
  return null;
}

function effectiveListingUpdatedMs(row: ListingAlertRow): number | null {
  const a = parseCatalogTimestampMs(row.course.last_updated);
  const b = parseCatalogTimestampMs(row.last_updated);
  if (a === null && b === null) return null;
  if (a === null) return b;
  if (b === null) return a;
  return Math.max(a, b);
}

const SubscribeSchema = z.object({
  listingId: z.number().int().positive(),
});

const UnsubscribeSchema = z.object({
  id: z.number().int().positive(),
});

const StatusSchema = z.object({
  listingId: z.coerce.number().int().positive(),
});

function cronAuthorized(req: express.Request): boolean {
  if (!COURSE_ALERT_CRON_SECRET) {
    if (isDev) {
      winston.warn(
        'courseAlerts: COURSE_ALERT_CRON_SECRET unset; allowing dispatch in dev only',
      );
      return isDev;
    }
    winston.error('courseAlerts: COURSE_ALERT_CRON_SECRET unset in production');
    return false;
  }
  const got = req.headers['x-coursetable-course-alert-cron'];
  const a = Buffer.from(String(got ?? ''), 'utf8');
  const b = Buffer.from(COURSE_ALERT_CRON_SECRET, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const getCourseAlertStatus = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;
  const parsed = StatusSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }
  const { listingId } = parsed.data;
  const row = await db.query.courseAlertSubscriptions.findFirst({
    where: and(
      eq(courseAlertSubscriptions.netId, netId),
      eq(courseAlertSubscriptions.listingId, listingId),
    ),
    columns: { id: true },
  });
  res.json({
    subscribed: Boolean(row),
    subscriptionId: row ? row.id : null,
  });
};

export const listCourseAlerts = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const rows = await db.query.courseAlertSubscriptions.findMany({
    where: eq(courseAlertSubscriptions.netId, netId),
    columns: {
      id: true,
      listingId: true,
      createdAt: true,
    },
  });

  const ids = rows.map((r) => r.listingId);
  const listings = await fetchListingsForAlerts(ids);
  const byId = new Map(listings.map((l) => [l.listing_id, l]));

  res.json({
    subscriptions: rows.map((r) => {
      const L = byId.get(r.listingId);
      return {
        id: r.id,
        listingId: r.listingId,
        createdAt: r.createdAt,
        seasonCode: L ? L.season_code : null,
        crn: L ? L.crn : null,
        courseCode: L ? L.course_code : null,
        title: L ? L.course.title : null,
      };
    }),
  });
};

export const subscribeCourseAlert = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;
  const parsed = SubscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }
  const { listingId } = parsed.data;

  const [listing] = await fetchListingsForAlerts([listingId]);
  if (!listing) {
    res.status(404).json({ error: 'LISTING_NOT_FOUND' });
    return;
  }

  const watermark = effectiveListingUpdatedMs(listing);

  const [inserted] = await db
    .insert(courseAlertSubscriptions)
    .values({
      netId,
      listingId,
      watermarkLastUpdatedMs: watermark ?? null,
      createdAt: Date.now(),
    })
    .onConflictDoUpdate({
      target: [
        courseAlertSubscriptions.netId,
        courseAlertSubscriptions.listingId,
      ],
      set: {
        watermarkLastUpdatedMs: watermark ?? null,
      },
    })
    .returning({
      id: courseAlertSubscriptions.id,
      listingId: courseAlertSubscriptions.listingId,
      createdAt: courseAlertSubscriptions.createdAt,
    });

  if (!inserted) {
    res.status(500).json({ error: 'INTERNAL' });
    return;
  }
  winston.info(
    `courseAlerts: subscribe netId=${netId} listingId=${String(listingId)} id=${String(inserted.id)}`,
  );
  res.json(inserted);
};

export const unsubscribeCourseAlert = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;
  const parsed = UnsubscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }
  const { id } = parsed.data;

  const [deleted] = await db
    .delete(courseAlertSubscriptions)
    .where(
      and(
        eq(courseAlertSubscriptions.id, id),
        eq(courseAlertSubscriptions.netId, netId),
      ),
    )
    .returning({ id: courseAlertSubscriptions.id });

  if (!deleted) {
    res.status(404).json({ error: 'SUBSCRIPTION_NOT_FOUND' });
    return;
  }
  res.sendStatus(200);
};

const BATCH = 80;

export const dispatchCourseAlerts = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  if (!cronAuthorized(req)) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }

  const subs = await db.query.courseAlertSubscriptions.findMany({
    columns: {
      id: true,
      netId: true,
      listingId: true,
      watermarkLastUpdatedMs: true,
    },
  });

  if (subs.length === 0) {
    res.json({ processed: 0, emailsSent: 0, baselinesSet: 0 });
    return;
  }

  const listingIds = [...new Set(subs.map((s) => s.listingId))];
  const listingMap = new Map<number, ListingAlertRow>();

  for (let i = 0; i < listingIds.length; i += BATCH) {
    const chunk = listingIds.slice(i, i + BATCH);
    const rows = await fetchListingsForAlerts(chunk);
    for (const row of rows) listingMap.set(row.listing_id, row);
  }

  const allNetIds = [...new Set(subs.map((s) => s.netId))];
  const profiles =
    allNetIds.length === 0
      ? []
      : await db.query.studentBluebookSettings.findMany({
          where: inArray(studentBluebookSettings.netId, allNetIds),
          columns: { netId: true, email: true },
        });
  const emailByNet = new Map(
    profiles
      .filter((p): p is { netId: string; email: string } => Boolean(p.email))
      .map((p) => [p.netId, p.email]),
  );

  let emailsSent = 0;
  let baselinesSet = 0;

  for (const sub of subs) {
    const listing = listingMap.get(sub.listingId);
    if (!listing) {
      await db
        .delete(courseAlertSubscriptions)
        .where(eq(courseAlertSubscriptions.id, sub.id));
      winston.info(
        `courseAlerts: removed stale subscription id=${String(sub.id)} listingId=${String(sub.listingId)}`,
      );
      continue;
    }

    const catalogMs = effectiveListingUpdatedMs(listing);
    if (catalogMs === null) continue;

    if (typeof sub.watermarkLastUpdatedMs !== 'number') {
      await db
        .update(courseAlertSubscriptions)
        .set({ watermarkLastUpdatedMs: catalogMs })
        .where(eq(courseAlertSubscriptions.id, sub.id));
      baselinesSet += 1;
      continue;
    }

    if (catalogMs <= sub.watermarkLastUpdatedMs) continue;

    const to = emailByNet.get(sub.netId);
    if (!to) {
      winston.warn(
        `courseAlerts: no email for netId=${sub.netId}; advancing watermark only sub id=${String(sub.id)}`,
      );
      await db
        .update(courseAlertSubscriptions)
        .set({ watermarkLastUpdatedMs: catalogMs })
        .where(eq(courseAlertSubscriptions.id, sub.id));
      continue;
    }

    const ok = await sendCourseUpdateEmail({
      to,
      courseTitle: listing.course.title,
      courseCode: listing.course_code,
      seasonCode: listing.season_code,
      crn: listing.crn,
    });
    if (ok) emailsSent += 1;
    if (ok || !RESEND_API_KEY) {
      await db
        .update(courseAlertSubscriptions)
        .set({ watermarkLastUpdatedMs: catalogMs })
        .where(eq(courseAlertSubscriptions.id, sub.id));
    }
  }

  winston.info(
    `courseAlerts: dispatch subs=${String(subs.length)} emailsSent=${String(emailsSent)} baselinesSet=${String(baselinesSet)}`,
  );
  res.json({
    processed: subs.length,
    emailsSent,
    baselinesSet,
  });
};
