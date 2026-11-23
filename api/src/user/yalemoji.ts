import { isDev, YALEMOJI_API_KEY, YALEMOJI_API_URL } from '../config.js';

export type YaleMojiAvatar = {
  version: number;
  png_url: string;
  svg_url: string;
  background_url: string;
};

function isAssetUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isAvatar(
  avatar: Partial<YaleMojiAvatar> | null | undefined,
): avatar is YaleMojiAvatar {
  return Boolean(
    avatar &&
    Number.isSafeInteger(avatar.version) &&
    avatar.version! >= 1 &&
    isAssetUrl(avatar.png_url) &&
    isAssetUrl(avatar.svg_url) &&
    isAssetUrl(avatar.background_url),
  );
}

function apiOrigin() {
  const origin = new URL(YALEMOJI_API_URL);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname);
  if (
    origin.username ||
    origin.password ||
    (origin.protocol !== 'https:' &&
      !(origin.protocol === 'http:' && local && isDev))
  )
    throw new Error('Invalid YaleMoji API URL');
  return origin;
}

export async function getYaleMojiAvatar(
  netId: string,
): Promise<YaleMojiAvatar | null | undefined> {
  if (!YALEMOJI_API_KEY || !/^[a-z][a-z\d]*$/iu.test(netId)) return undefined;
  try {
    const origin = apiOrigin();

    const response = await fetch(
      new URL(
        `/api/v1/users/${encodeURIComponent(netId.toLowerCase())}`,
        origin,
      ),
      {
        headers: { Authorization: `Bearer ${YALEMOJI_API_KEY}` },
        signal: AbortSignal.timeout(3000),
        redirect: 'error',
      },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`YaleMoji status ${response.status}`);
    const { avatar } = (await response.json()) as {
      avatar?: Partial<YaleMojiAvatar>;
    };
    if (!isAvatar(avatar)) throw new Error('Invalid YaleMoji avatar response');

    return {
      version: avatar.version,
      png_url: avatar.png_url,
      svg_url: avatar.svg_url,
      background_url: avatar.background_url,
    };
  } catch {
    console.warn(
      '[YaleMoji] Avatar lookup unavailable; using profile initials.',
    );
    return undefined;
  }
}

export async function getYaleMojiAvatars(
  netids: string[],
): Promise<{ [key: string]: YaleMojiAvatar | null } | undefined> {
  if (
    !YALEMOJI_API_KEY ||
    netids.length > 100 ||
    netids.some((id) => !/^[a-z][a-z\d]*$/iu.test(id))
  )
    return undefined;
  const ids = [...new Set(netids.map((id) => id.toLowerCase()))];
  if (!ids.length) return {};
  try {
    const response = await fetch(new URL('/api/v1/lookup', apiOrigin()), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${YALEMOJI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ netids: ids }),
      signal: AbortSignal.timeout(3000),
      redirect: 'error',
    });
    if (!response.ok) throw new Error(`YaleMoji status ${response.status}`);
    const { users } = (await response.json()) as {
      users?: { [key: string]: Partial<YaleMojiAvatar> | null };
    };
    if (!users || ids.some((id) => users[id] !== null && !isAvatar(users[id])))
      throw new Error('Invalid YaleMoji batch response');
    return Object.fromEntries(
      ids.map((id) => [id, users[id] as YaleMojiAvatar | null]),
    );
  } catch {
    console.warn(
      '[YaleMoji] Batch lookup unavailable; using the default avatar.',
    );
    return undefined;
  }
}
