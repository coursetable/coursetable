import { afterEach, describe, expect, it, vi } from 'vitest';
import { croppedYaleMojiImage, opaqueBounds } from './yalemojiImage';
import { fetchYaleMojiImage } from '../queries/api';

vi.mock('../queries/api', () => ({ fetchYaleMojiImage: vi.fn() }));

describe('Yalemoji transparent padding', () => {
  it('finds asymmetric bounds without cutting off opaque hair or chin pixels', () => {
    const pixels = new Uint8ClampedArray(10 * 12 * 4);
    pixels[(2 * 10 + 1) * 4 + 3] = 255;
    pixels[(10 * 10 + 7) * 4 + 3] = 255;
    // Ignore almost transparent anti-aliasing outside the actual artwork.
    pixels[3] = 2;
    expect(opaqueBounds(pixels, 10, 12)).toEqual({
      left: 1,
      top: 2,
      width: 7,
      height: 9,
    });
  });
  it('handles fully transparent images and artwork touching the canvas edges', () => {
    expect(opaqueBounds(new Uint8ClampedArray(16), 2, 2)).toBeNull();
    const pixels = new Uint8ClampedArray(16).fill(255);
    expect(opaqueBounds(pixels, 2, 2)).toEqual({
      left: 0,
      top: 0,
      width: 2,
      height: 2,
    });
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function setupCanvas() {
  const bitmap = { width: 4, height: 6, close: vi.fn() };
  const pixels = new Uint8ClampedArray(4 * 6 * 4);
  pixels[(2 * 4 + 1) * 4 + 3] = 255;
  pixels[(4 * 4 + 2) * 4 + 3] = 255;
  const context = {
    drawImage: vi.fn(),
    getImageData: () => ({ data: pixels }),
  };
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => context,
    toDataURL: () => 'data:image/png;base64,cropped',
  };
  vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap));
  vi.stubGlobal('document', { createElement: () => canvas });
  vi.mocked(fetchYaleMojiImage).mockResolvedValue(new Blob());
  return { bitmap, context, canvas };
}

describe('Yalemoji crop pipeline', () => {
  it('crops to the measured bounds, closes the bitmap and shares cached images', async () => {
    const { bitmap, canvas, context } = setupCanvas();
    expect(
      await croppedYaleMojiImage('https://assets.example/test-crop.png'),
    ).toBe('data:image/png;base64,cropped');
    expect(canvas.width).toBe(2);
    expect(canvas.height).toBe(3);
    expect(context.drawImage).toHaveBeenLastCalledWith(
      bitmap,
      1,
      2,
      2,
      3,
      0,
      0,
      2,
      3,
    );
    expect(bitmap.close).toHaveBeenCalledOnce();
    await croppedYaleMojiImage('https://assets.example/test-crop.png');
    expect(fetchYaleMojiImage).toHaveBeenCalledOnce();
  });
  it('allows retrying after an outage instead of caching a failed crop', async () => {
    setupCanvas();
    vi.mocked(fetchYaleMojiImage).mockRejectedValueOnce(new Error('offline'));
    await expect(
      croppedYaleMojiImage('https://assets.example/retry.png'),
    ).rejects.toThrow('offline');
    await expect(
      croppedYaleMojiImage('https://assets.example/retry.png'),
    ).resolves.toBe('data:image/png;base64,cropped');
  });
  it('rejects oversized images and still releases the decoded bitmap', async () => {
    const { bitmap } = setupCanvas();
    bitmap.width = 4096;
    await expect(
      croppedYaleMojiImage('https://assets.example/oversized.png'),
    ).rejects.toThrow('Oversized Yalemoji image');
    expect(bitmap.close).toHaveBeenCalledOnce();
  });
});
