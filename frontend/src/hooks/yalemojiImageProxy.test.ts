import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  fetchYaleMojiImageBytes,
  yaleMojiImageUrl,
} from '../../../api/src/user/yalemoji-image.js';

afterEach(() => vi.unstubAllGlobals());
const asset =
  'https://storage.googleapis.com/yalemoji-avatars/avatars/abc123/2/avatar.png';

describe('public Yalemoji image proxy', () => {
  it('accepts only the public avatar bucket and versioned default image', () => {
    expect(yaleMojiImageUrl(asset)?.href).toBe(asset);
    expect(
      yaleMojiImageUrl(
        'https://www.yalemoji.com/assets/default-avatar.png?v=3',
      ),
    ).toBeInstanceOf(URL);
  });
  it.each([
    undefined,
    ['https://www.yalemoji.com/assets/default-avatar.png'],
    'http://localhost/private',
    'https://storage.googleapis.com/another-bucket/avatar.png',
    'https://storage.googleapis.com.evil.example/yalemoji-avatars/avatars/abc/2/avatar.png',
    asset.replace('https://', 'https://user:password@'),
    asset.replace('.com/', '.com:444/'),
    `${asset}?redirect=https://evil.example`,
    'https://www.yalemoji.com/api/v1/lookup',
    'https://www.yalemoji.com/assets/default-avatar.png?other=1',
    `${asset}#fragment`,
  ])('rejects arbitrary or malformed URLs: %s', (src) => {
    expect(yaleMojiImageUrl(src)).toBeUndefined();
  });
  it('does not forward cookies or the app key, and prohibits redirects', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3]), {
        headers: { 'Content-Type': 'image/png' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchYaleMojiImageBytes(new URL(asset))).toEqual(
      Buffer.from([1, 2, 3]),
    );
    const options = fetchMock.mock.calls[0]?.[1];
    expect(options?.redirect).toBe('error');
    expect(options?.signal).toBeInstanceOf(AbortSignal);
    expect(options?.headers).toBeUndefined();
    expect(options?.credentials).toBeUndefined();
  });
  it('rejects oversized streamed images even without a Content-Length header', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(new Uint8Array(2 * 1024 * 1024 + 1), {
          headers: { 'Content-Type': 'image/png' },
        }),
      ),
    );
    await expect(fetchYaleMojiImageBytes(new URL(asset))).rejects.toThrow(
      'Image too large',
    );
  });
  it.each([
    new Response('error', { status: 503 }),
    new Response('<html>error</html>', {
      headers: { 'Content-Type': 'text/html' },
    }),
  ])('rejects upstream failures or non-image responses', async (response) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    await expect(fetchYaleMojiImageBytes(new URL(asset))).rejects.toThrow(
      'Image unavailable',
    );
  });
});
