import { getYaleMojiAvatars, type YaleMojiAvatar } from '../queries/api';

type Listener = (avatar: YaleMojiAvatar | null) => void;
type Entry = {
  avatar: YaleMojiAvatar | null;
  expires: number;
  pending: boolean;
  listeners: Set<Listener>;
};
const entries = new Map<string, Entry>();
const queued = new Set<string>();
let timer: ReturnType<typeof setTimeout> | undefined = undefined;
const CACHE_MS = 5 * 60 * 1000;

async function flush() {
  timer = undefined;
  const ids = [...queued];
  queued.clear();
  for (let offset = 0; offset < ids.length; offset += 100) {
    const batch = ids.slice(offset, offset + 100);
    const users = await getYaleMojiAvatars(batch);
    for (const id of batch) {
      const entry = entries.get(id)!;
      entry.pending = false;
      // Outages preserve the last good avatar and retry on a later mount.
      if (!users || !Object.hasOwn(users, id)) continue;
      entry.avatar = users[id] ?? null;
      entry.expires = Date.now() + CACHE_MS;
      entry.listeners.forEach((listener) => listener(entry.avatar));
    }
  }
}

// All rows mounted in a render share a lookup, including across both dropdowns.
export function subscribePeopleYaleMoji(netId: string, listener: Listener) {
  const id = netId.toLowerCase();
  let entry = entries.get(id);
  if (!entry) {
    entry = { avatar: null, expires: 0, pending: false, listeners: new Set() };
    entries.set(id, entry);
  }
  entry.listeners.add(listener);
  listener(entry.avatar);
  if (entry.expires <= Date.now() && !entry.pending) {
    entry.pending = true;
    queued.add(id);
    timer ??= setTimeout(() => {
      void flush();
    }, 0);
  }
  const { listeners } = entry;
  return () => {
    listeners.delete(listener);
  };
}
