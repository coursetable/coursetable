const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function yaleMojiImageUrl(src: unknown): URL | undefined {
  if (typeof src !== 'string') return undefined;
  try {
    const url = new URL(src);
    const asset =
      url.hostname === 'storage.googleapis.com' &&
      /^\/yalemoji-avatars\/avatars\/[a-f\d]+\/\d+\/avatar\.png$/u.test(
        url.pathname,
      ) &&
      !url.search;
    const fallback =
      url.hostname === 'www.yalemoji.com' &&
      url.pathname === '/assets/default-avatar.png' &&
      (!url.search || /^\?v=\d+$/u.test(url.search));
    if (
      url.protocol !== 'https:' ||
      url.port ||
      url.username ||
      url.password ||
      url.hash ||
      (!asset && !fallback)
    )
      return undefined;
    return url;
  } catch {
    return undefined;
  }
}

export async function fetchYaleMojiImageBytes(url: URL): Promise<Buffer> {
  const response = await fetch(url, {
    redirect: 'error',
    signal: AbortSignal.timeout(5000),
  });
  if (
    !response.ok ||
    !response.headers.get('content-type')?.startsWith('image/png') ||
    !response.body
  ) {
    await response.body?.cancel();
    throw new Error('Image unavailable');
  }
  const chunks: Uint8Array[] = [];
  let size = 0;
  // Exiting for-await also cancels the stream when the limit is exceeded.
  for await (const value of response.body as AsyncIterable<Uint8Array>) {
    size += value.byteLength;
    if (size > MAX_IMAGE_BYTES) throw new Error('Image too large');
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
