import debounce from 'lodash.debounce';

import { API_ENDPOINT } from '../config';
import type { AppEvent } from '../types/events';

const SESSION_STORAGE_KEY = 'ct_analytics_session_id';
const FLUSH_MS = 5000;
const MAX_QUEUE = 50;

let sessionStarted = false;
const queue: AppEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

const lastCourseViewKey = { code: '', at: 0 };
const filterDebouncers = new Map<
  string,
  ReturnType<typeof debounce<(filter: string, value: unknown) => void>>
>();

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function clientKind(): string {
  if (typeof navigator === 'undefined') return 'web';
  return /mobi|android/iu.test(navigator.userAgent) ? 'mobile-web' : 'web';
}

function enqueue(event: AppEvent): void {
  queue.push(event);
  if (queue.length >= MAX_QUEUE) void flush();
}

function requeue(batch: AppEvent[]): void {
  queue.unshift(...batch);
}

function flushBody(batch: AppEvent[]): string {
  return JSON.stringify({
    session_id: getSessionId(),
    client: clientKind(),
    app_version: String(import.meta.env.VITE_APP_VERSION ?? 'unknown'),
    events: batch,
  });
}

async function postEventsBatch(batch: AppEvent[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_ENDPOINT}/api/events`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: flushBody(batch),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function flush(): Promise<void> {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  const ok = await postEventsBatch(batch);
  if (!ok) requeue(batch);
}

function flushBeacon(): void {
  if (queue.length === 0) return;
  const batch = queue.splice(0, queue.length);
  const body = flushBody(batch);
  if (typeof navigator.sendBeacon === 'function') {
    const ok = navigator.sendBeacon(
      `${API_ENDPOINT}/api/events`,
      new Blob([body], { type: 'application/json' }),
    );
    if (!ok) requeue(batch);
    return;
  }
  void postEventsBatch(batch).then((ok) => {
    if (!ok) requeue(batch);
  });
}

function maybeEmitSessionStart(): void {
  if (sessionStarted) return;
  sessionStarted = true;
  const referrer = (() => {
    try {
      return document.referrer || undefined;
    } catch {
      return undefined;
    }
  })();
  enqueue({ event_type: 'session_start', payload: { referrer } });
}

export function initTrack(): void {
  if (flushTimer !== null) return;
  flushTimer = setInterval(() => {
    if (queue.length > 0) void flush();
  }, FLUSH_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush();
  });
  window.addEventListener('beforeunload', flushBeacon);
}

export function track<E extends AppEvent>(
  eventType: E['event_type'],
  payload: E['payload'],
): void {
  if (eventType === 'course_view') {
    const p = payload as Extract<
      AppEvent,
      { event_type: 'course_view' }
    >['payload'];
    const now = Date.now();
    if (
      p.course_code === lastCourseViewKey.code &&
      now - lastCourseViewKey.at < 2000
    )
      return;
    lastCourseViewKey.code = p.course_code;
    lastCourseViewKey.at = now;
  }
  maybeEmitSessionStart();
  enqueue({ event_type: eventType, payload } as AppEvent);
}

export function trackFilterChange(filter: string, value: unknown): void {
  let debounced = filterDebouncers.get(filter);
  if (!debounced) {
    debounced = debounce((f: string, v: unknown) => {
      maybeEmitSessionStart();
      enqueue({
        event_type: 'filter_change',
        payload: { filter: f, value: v },
      });
    }, 500);
    filterDebouncers.set(filter, debounced);
  }
  debounced(filter, value);
}
