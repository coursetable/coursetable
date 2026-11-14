import {
  getYaleMojiAvatar,
  yaleMojiAvatarSchema,
  type YaleMojiAvatar,
} from '../queries/api';
import type { NetId } from '../queries/graphql-types';

const STORAGE_KEY = 'coursetable-yalemoji';
const RETURN_KEY = 'coursetable-yalemoji-return';
const REFRESH_DELAY_MS = 5000;
type Listener = (avatar: YaleMojiAvatar | null) => void;
type Entry = {
  avatar: YaleMojiAvatar | null;
  confirmed: boolean;
  listeners: Set<Listener>;
  inflight?: Promise<void>;
  cancelDelay?: () => void;
};

// This cache lives for the document, so route changes and multiple profile
// buttons share both the avatar and the initial refresh.
const entries = new Map<NetId, Entry>();
let returningFromYaleMoji = false;
let listeningForReturn = false;

function readCachedAvatar(netid: NetId): YaleMojiAvatar | null {
  try {
    const cached = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || 'null',
    ) as { netid?: unknown; avatar?: unknown } | null;
    if (cached?.netid !== netid) return null;
    const result = yaleMojiAvatarSchema.safeParse(cached.avatar);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function refresh(netid: NetId, entry: Entry): Promise<void> {
  entry.cancelDelay?.();
  if (entry.inflight) return entry.inflight;
  entry.inflight = (async () => {
    try {
      const avatar = await getYaleMojiAvatar(netid);
      if (entries.get(netid) !== entry || avatar === undefined) return;
      entry.avatar = avatar;
      entry.confirmed = true;
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ netid, avatar: entry.avatar }),
        );
      } catch {
        /* Keep the in-memory cache when storage is unavailable. */
      }
      entry.listeners.forEach((listener) => listener(entry.avatar));
    } catch {
      /* Keep the last avatar on network failures. */
    } finally {
      entry.inflight = undefined;
    }
  })();
  return entry.inflight;
}

function refreshOnReturn() {
  if (document.visibilityState === 'hidden') return;
  const activeEntries = Array.from(entries).filter(
    ([, entry]) => entry.listeners.size > 0,
  );
  if (!activeEntries.length) return;
  try {
    returningFromYaleMoji ||=
      window.sessionStorage.getItem(RETURN_KEY) === 'true';
  } catch {
    /* The in-memory flag still works without storage. */
  }
  if (!returningFromYaleMoji) return;
  returningFromYaleMoji = false;
  try {
    window.sessionStorage.removeItem(RETURN_KEY);
  } catch {
    /* Storage may be disabled. */
  }
  activeEntries.forEach(([netid, entry]) => {
    void refresh(netid, entry);
  });
}

export function markYaleMojiVisit() {
  returningFromYaleMoji = true;
  entries.forEach((entry) => {
    // A visit invalidates the previous missing-avatar result. Only a new
    // successful API response can make the banner eligible again.
    entry.confirmed = false;
    entry.listeners.forEach((listener) => listener(entry.avatar));
  });
  try {
    window.sessionStorage.setItem(RETURN_KEY, 'true');
  } catch {
    /* The in-memory flag covers new-tab visits. */
  }
}

export function clearYaleMojiCache() {
  entries.forEach((entry) => entry.cancelDelay?.());
  entries.clear();
  returningFromYaleMoji = false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(RETURN_KEY);
  } catch {
    /* Storage may be disabled. */
  }
}

export function subscribeYaleMoji(
  netid: NetId,
  listener: Listener,
): () => void {
  if (!listeningForReturn) {
    window.addEventListener('focus', refreshOnReturn);
    window.addEventListener('pageshow', refreshOnReturn);
    document.addEventListener('visibilitychange', refreshOnReturn);
    listeningForReturn = true;
  }
  let entry = entries.get(netid);
  const isNew = !entry;
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
  refreshOnReturn();
  if (isNew && !current.inflight) {
    if (current.avatar) {
      let timer: ReturnType<typeof setTimeout> | undefined = undefined;
      const schedule = () => {
        const navigation = performance.getEntriesByType('navigation')[0] as
          | PerformanceNavigationTiming
          | undefined;
        const elapsed = navigation?.loadEventEnd
          ? performance.now() - navigation.loadEventEnd
          : 0;
        timer = setTimeout(
          () => {
            void refresh(netid, current);
          },
          Math.max(0, REFRESH_DELAY_MS - elapsed),
        );
      };
      current.cancelDelay = () => {
        clearTimeout(timer);
        window.removeEventListener('load', schedule);
      };
      if (document.readyState === 'complete') schedule();
      else window.addEventListener('load', schedule, { once: true });
    } else {
      void refresh(netid, current);
    }
  }
  // Delayed refreshes survive unmounts during navigation.
  return () => {
    current.listeners.delete(listener);
  };
}

export function subscribeYaleMojiBanner(
  netid: NetId,
  listener: (visible: boolean) => void,
): () => void {
  const notify = () => {
    const entry = entries.get(netid);
    listener(Boolean(entry?.confirmed) && entry?.avatar === null);
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      const avatar = readCachedAvatar(netid);
      const entry = entries.get(netid);
      if (avatar && entry) {
        entry.avatar = avatar;
        entry.listeners.forEach((subscriber) => subscriber(avatar));
      }
    }
  };
  window.addEventListener('storage', onStorage);
  const unsubscribe = subscribeYaleMoji(netid, notify);
  return () => {
    unsubscribe();
    window.removeEventListener('storage', onStorage);
  };
}
