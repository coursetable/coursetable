import { isDev, YALEMOJI_API_KEY, YALEMOJI_API_URL } from '../config.js';

type YaleMojiAvatar = {
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

// Adapted from Yalies. Only the backend sends the app key; the browser gets
// public, opaque asset URLs. Missing avatars and outages fall back to initials.
export async function getYaleMojiAvatar(
  netId: string,
): Promise<YaleMojiAvatar | null | undefined> {
  // Only null confirms a missing avatar; outages must not trigger the banner.
  if (!YALEMOJI_API_KEY || !/^[a-z][a-z\d]*$/iu.test(netId)) return undefined;
  try {
    const origin = new URL(YALEMOJI_API_URL);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname);
    if (
      origin.username ||
      origin.password ||
      (origin.protocol !== 'https:' &&
        !(origin.protocol === 'http:' && local && isDev))
    )
      throw new Error('Invalid YaleMoji API URL');

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
    if (
      !avatar ||
      typeof avatar.version !== 'number' ||
      !Number.isSafeInteger(avatar.version) ||
      avatar.version < 1 ||
      !isAssetUrl(avatar.png_url) ||
      !isAssetUrl(avatar.svg_url) ||
      !isAssetUrl(avatar.background_url)
    )
      throw new Error('Invalid YaleMoji avatar response');

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
