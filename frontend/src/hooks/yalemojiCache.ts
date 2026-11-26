import {
  getYaleMojiAvatar,
  yaleMojiAvatarSchema,
  type YaleMojiAvatar,
} from '../queries/api';
import type { NetId } from '../queries/graphql-types';

const STORAGE_KEY = 'coursetable-yalemoji';
const RETURN_KEY = 'coursetable-yalemoji-return';

type Listener = (avatar: YaleMojiAvatar | null) => void;
type Entry = {
  avatar: YaleMojiAvatar | null;
  confirmed: boolean;
  listeners: Set<Listener>;
  inflight?: Promise<void>;
};

const entries = new Map<NetId, Entry>();
let listeningForReturn = false;

function read(key: string, session = false): string | null {
  try {
    return (session ? sessionStorage : localStorage).getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null, session = false) {
  try {
    const store = session ? sessionStorage : localStorage;
    if (value === null) store.removeItem(key);
    else store.setItem(key, value);
  } catch {}
}

function readCachedAvatar(netid: NetId): YaleMojiAvatar | null {
  try {
    const cached = JSON.parse(read(STORAGE_KEY) || 'null') as {
      netid?: unknown;
      avatar?: unknown;
    } | null;
    if (cached?.netid !== netid) return null;
    const result = yaleMojiAvatarSchema.safeParse(cached.avatar);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function refresh(netid: NetId, entry: Entry): Promise<void> {
  if (entry.inflight) return entry.inflight;
  entry.inflight = (async () => {
    const avatar = await getYaleMojiAvatar(netid).catch(() => undefined);
    entry.inflight = undefined;
    if (entries.get(netid) !== entry || avatar === undefined) return;
    entry.avatar = avatar;
    entry.confirmed = true;
    write(STORAGE_KEY, JSON.stringify({ netid, avatar }));
    entry.listeners.forEach((listener) => listener(avatar));
  })();
  return entry.inflight;
}

function refreshOnReturn() {
  if (read(RETURN_KEY, true) !== 'true') return;
  write(RETURN_KEY, null, true);
  entries.forEach((entry, netid) => {
    if (entry.listeners.size > 0) void refresh(netid, entry);
  });
}

export function markYaleMojiVisit() {
  write(RETURN_KEY, 'true', true);
  entries.forEach((entry) => {
    entry.confirmed = false;
    entry.listeners.forEach((listener) => listener(entry.avatar));
  });
}

export function clearYaleMojiCache() {
  entries.clear();
  write(STORAGE_KEY, null);
  write(RETURN_KEY, null, true);
}

export function subscribeYaleMoji(
  netid: NetId,
  listener: Listener,
): () => void {
  if (!listeningForReturn) {
    window.addEventListener('focus', refreshOnReturn);
    listeningForReturn = true;
  }
  let entry = entries.get(netid);
  if (!entry) {
    entry = {
      avatar: readCachedAvatar(netid),
      confirmed: false,
      listeners: new Set(),
    };
    entries.set(netid, entry);
  }
  const current = entry;
  current.listeners.add(listener);
  listener(current.avatar);
  if (!current.confirmed) void refresh(netid, current);
  return () => {
    current.listeners.delete(listener);
  };
}

export function subscribeYaleMojiBanner(
  netid: NetId,
  listener: (visible: boolean) => void,
): () => void {
  return subscribeYaleMoji(netid, () => {
    const entry = entries.get(netid);
    listener(Boolean(entry?.confirmed) && entry?.avatar === null);
  });
}
