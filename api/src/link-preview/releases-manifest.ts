import { z } from 'zod';
import { FRONTEND_ENDPOINT } from '../config.js';
import winston from '../logging/winston.js';

const SITE_ORIGIN = new URL(FRONTEND_ENDPOINT).origin;

const pageBlock = z.object({
  title: z.string().max(500),
  description: z.string().max(4000),
  image: z.string().max(500).optional(),
});

const entrySchema = z.object({
  path: z.string().regex(/^\/releases\//u),
  title: z.string().max(500),
  listTitle: z.string().max(500).optional(),
  summary: z.string().max(4000),
  date: z.string().max(32),
  image: z.string().max(500).optional(),
});

const manifestSchema = z.object({
  version: z.number().optional(),
  index: pageBlock,
  entries: z.array(entrySchema),
});

export type ReleaseOgMetadata = {
  title: string;
  description: string;
  image: string;
};

function toAbsoluteImage(urlOrPath: string | undefined): string {
  if (!urlOrPath) return `${SITE_ORIGIN}/favicon.png`;
  try {
    const u = new URL(urlOrPath, SITE_ORIGIN);
    if (u.origin !== SITE_ORIGIN) return `${SITE_ORIGIN}/favicon.png`;
    return u.href;
  } catch {
    return `${SITE_ORIGIN}/favicon.png`;
  }
}

type ParsedManifest = {
  index: ReleaseOgMetadata;
  byPath: Map<string, ReleaseOgMetadata>;
};

function parseManifest(data: z.infer<typeof manifestSchema>): ParsedManifest {
  const index: ReleaseOgMetadata = {
    title: data.index.title,
    description: data.index.description,
    image: toAbsoluteImage(data.index.image),
  };
  const byPath = new Map<string, ReleaseOgMetadata>();
  for (const e of data.entries) {
    byPath.set(e.path, {
      title: e.title,
      description: e.summary,
      image: toAbsoluteImage(e.image),
    });
  }
  return { index, byPath };
}

const TTL_MS = 5 * 60 * 1000;
/** Avoid hanging link-preview requests if the frontend is unreachable. */
const MANIFEST_FETCH_TIMEOUT_MS = 8_000;
const RETRY_BACKOFF_MS = 60_000;

let cache: { parsed: ParsedManifest; fetchedAt: number } | null = null;
let nextRetryAt = 0;
/** One download shared by preview requests that arrive together. */
let inflight: Promise<ParsedManifest | null> | null = null;

function setCache(parsed: ParsedManifest, fetchedAt: number): void {
  cache = { parsed, fetchedAt };
  nextRetryAt = fetchedAt + TTL_MS;
}

function metadataForPath(
  parsed: ParsedManifest | null,
  path: string,
): ReleaseOgMetadata | null {
  if (!parsed) return null;
  if (path === '/releases') return parsed.index;
  return parsed.byPath.get(path) ?? null;
}

/** Wait before the next download, even when nothing has been cached yet. */
function rememberFailure(): ParsedManifest | null {
  nextRetryAt = Date.now() + RETRY_BACKOFF_MS;
  return cache?.parsed ?? null;
}

async function downloadManifest(): Promise<ParsedManifest | null> {
  const manifestUrl = new URL('/releases-meta.json', FRONTEND_ENDPOINT).href;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, MANIFEST_FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(manifestUrl, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) {
      winston.warn(
        `releases-meta.json HTTP ${String(res.status)} from ${manifestUrl}`,
      );
      return rememberFailure();
    }
    const json: unknown = await res.json();
    const parsed = manifestSchema.safeParse(json);
    if (!parsed.success) {
      winston.warn(
        `releases-meta.json failed validation: ${parsed.error.message}`,
      );
      return rememberFailure();
    }
    const normalized = parseManifest(parsed.data);
    setCache(normalized, Date.now());
    return normalized;
  } catch (err) {
    const isAbort =
      (err instanceof Error && err.name === 'AbortError') ||
      (typeof DOMException !== 'undefined' &&
        err instanceof DOMException &&
        err.name === 'AbortError');
    if (isAbort) {
      winston.warn(
        `releases-meta.json fetch timed out after ${String(MANIFEST_FETCH_TIMEOUT_MS)}ms (${manifestUrl})`,
      );
    } else {
      winston.warn(`releases-meta.json fetch error: ${String(err)}`);
    }
    return rememberFailure();
  } finally {
    clearTimeout(timeoutId);
  }
}

function loadManifest(): Promise<ParsedManifest | null> {
  inflight ??= downloadManifest().finally(() => {
    inflight = null;
  });
  return inflight;
}

export async function getReleaseOgMetadata(
  pathname: string,
): Promise<ReleaseOgMetadata | null> {
  const path =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;

  if (path !== '/releases' && !path.startsWith('/releases/')) return null;

  const now = Date.now();
  if (cache && now - cache.fetchedAt < TTL_MS)
    return metadataForPath(cache.parsed, path);
  if (now < nextRetryAt) return metadataForPath(cache?.parsed ?? null, path);

  return metadataForPath(await loadManifest(), path);
}
