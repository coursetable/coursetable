import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getYaleMojiAvatars } from '../../../api/src/user/yalemoji.js';

vi.mock('../../../api/src/config.js', () => ({
  isDev: true,
  YALEMOJI_API_KEY: 'test-server-only-key',
  YALEMOJI_API_URL: 'https://www.yalemoji.com',
}));

const avatar = {
  version: 1,
  png_url: 'https://assets.example/avatar.png',
  svg_url: 'https://assets.example/avatar.svg',
  background_url: 'https://assets.example/background.svg',
};
const fetchMock = vi.fn<typeof fetch>();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Yalemoji bulk API', () => {
  it('normalizes and deduplicates NetIDs in a single authenticated bulk request', async () => {
    fetchMock.mockResolvedValue(
      Response.json({ users: { aa1: avatar, bb2: null, extra: avatar } }),
    );
    expect(await getYaleMojiAvatars(['AA1', 'aa1', 'bb2'])).toEqual({
      aa1: avatar,
      bb2: null,
    });
    const [url, options] = fetchMock.mock.calls[0]!;
    expect(url).toEqual(new URL('https://www.yalemoji.com/api/v1/lookup'));
    expect(options?.method).toBe('POST');
    expect(new Headers(options?.headers).get('Authorization')).toBe(
      'Bearer test-server-only-key',
    );
    expect(options?.body).toBe(JSON.stringify({ netids: ['aa1', 'bb2'] }));
  });

  it('rejects oversized and invalid inputs without calling upstream', async () => {
    expect(
      await getYaleMojiAvatars(Array.from({ length: 101 }, (_, i) => `u${i}`)),
    ).toBeUndefined();
    expect(await getYaleMojiAvatars(['bad/id'])).toBeUndefined();
    expect(await getYaleMojiAvatars([])).toEqual({});
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    { users: {} },
    { users: { aa1: { ...avatar, version: 0 } } },
    {
      users: { aa1: { ...avatar, png_url: 'http://unsafe.example/image.png' } },
    },
    {
      users: {
        aa1: {
          ...avatar,
          png_url: 'https://user:password@assets.example/image.png',
        },
      },
    },
  ])('treats incomplete or unsafe responses as unavailable', async (body) => {
    fetchMock.mockResolvedValue(Response.json(body));
    expect(await getYaleMojiAvatars(['aa1'])).toBeUndefined();
  });

  it('does not mistake rate limiting or network outages for missing avatars', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 429 }))
      .mockRejectedValueOnce(new Error('offline'));
    expect(await getYaleMojiAvatars(['aa1'])).toBeUndefined();
    expect(await getYaleMojiAvatars(['aa1'])).toBeUndefined();
  });
});
