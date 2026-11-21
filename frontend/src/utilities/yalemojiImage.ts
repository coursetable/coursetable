import { fetchYaleMojiImage } from '../queries/api';

export function opaqueBounds(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
) {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3]! <= 2) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  return right < left
    ? null
    : { left, top, width: right - left + 1, height: bottom - top + 1 };
}

const images = new Map<string, Promise<string>>();

// Measure each immutable image URL once, shared by both menus. No guessed
// zoom factor: hairstyles and the default image have different bounds.
export function croppedYaleMojiImage(src: string): Promise<string> {
  const cached = images.get(src);
  if (cached) return cached;
  const pending = (async () => {
    const bitmap = await createImageBitmap(await fetchYaleMojiImage(src));
    try {
      if (bitmap.width > 2048 || bitmap.height > 2048)
        throw new Error('Oversized Yalemoji image');
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) throw new Error('Canvas unavailable');
      context.drawImage(bitmap, 0, 0);
      const bounds = opaqueBounds(
        context.getImageData(0, 0, bitmap.width, bitmap.height).data,
        bitmap.width,
        bitmap.height,
      );
      if (!bounds) throw new Error('Empty Yalemoji image');
      canvas.width = bounds.width;
      canvas.height = bounds.height;
      context.drawImage(
        bitmap,
        bounds.left,
        bounds.top,
        bounds.width,
        bounds.height,
        0,
        0,
        bounds.width,
        bounds.height,
      );
      return canvas.toDataURL('image/png');
    } finally {
      bitmap.close();
    }
  })().catch((error: unknown) => {
    images.delete(src);
    throw error;
  });
  // Bound decoded-image retention during long directory-search sessions.
  if (images.size >= 200) images.delete(images.keys().next().value!);
  images.set(src, pending);
  return pending;
}
