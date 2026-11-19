import { colorThemes } from './constants';

// Unknown ids (e.g. a theme that was renamed or removed) fall back to Classic
export function getColorTheme(
  id: string | null | undefined,
): (typeof colorThemes)[number] {
  return colorThemes.find((theme) => theme.id === id) ?? colorThemes[0];
}

export function randomThemeColor(id: string | null | undefined): string {
  const { colors } = getColorTheme(id);
  return colors[Math.floor(Math.random() * colors.length)]!;
}

// Position of the color within whichever theme contains it, or -1 if custom
function themeIndexOf(color: string): number {
  const lower = color.toLowerCase();
  for (const theme of colorThemes) {
    const index = theme.colors.findIndex((c) => c.toLowerCase() === lower);
    if (index !== -1) return index;
  }
  return -1;
}

export function isCustomColor(color: string): boolean {
  return themeIndexOf(color) === -1;
}

// Picks `count` items spread evenly through `pool`, cycling if it runs out
function spread<T>(pool: readonly T[], count: number): T[] {
  return Array.from(
    { length: count },
    (_, i) =>
      pool[
        count <= pool.length
          ? Math.floor((i * pool.length) / count)
          : i % pool.length
      ]!,
  );
}

/**
 * Maps each current color (keyed lowercase) to one of `colors`. Mapping by
 * color rather than by course keeps courses that shared a color matched.
 * Theme colors keep their position (Classic's 4th color becomes the new
 * theme's 4th), so switching themes round-trips and reapplying is a no-op.
 * Custom colors, and theme colors whose position is already taken, are spread
 * across the remaining slots.
 */
export function mapColorsToTheme(
  currentColors: readonly string[],
  colors: readonly string[],
): Map<string, string> {
  const result = new Map<string, string>();
  const usedIndices = new Set<number>();
  const pending: string[] = [];
  for (const color of new Set(currentColors.map((c) => c.toLowerCase()))) {
    const index = themeIndexOf(color);
    if (index !== -1 && index < colors.length && !usedIndices.has(index)) {
      usedIndices.add(index);
      result.set(color, colors[index]!);
    } else {
      pending.push(color);
    }
  }
  const freeIndices = colors.flatMap((_, i) => (usedIndices.has(i) ? [] : i));
  const pool = freeIndices.length > 0 ? freeIndices : colors.map((_, i) => i);
  spread(pool, pending.length).forEach((index, i) => {
    result.set(pending[i]!, colors[index]!);
  });
  return result;
}
