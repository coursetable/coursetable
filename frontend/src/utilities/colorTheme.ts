import { classicColors } from './constants';
import type { ColorTheme } from '../queries/api';

// Stands in for the user's Classic until their themes load, and for worksheets
// that aren't theirs (e.g. imported ones)
export const fallbackTheme: ColorTheme = {
  id: 0,
  name: 'Classic',
  colors: classicColors,
  isDefault: true,
};

// A worksheet without a theme (or whose theme was deleted) uses the default
export function getWorksheetTheme(
  themes: readonly ColorTheme[] | undefined,
  colorThemeId: number | null | undefined,
): ColorTheme {
  return (
    themes?.find((theme) => theme.id === colorThemeId) ??
    themes?.find((theme) => theme.isDefault) ??
    fallbackTheme
  );
}

export function randomThemeColor(theme: ColorTheme) {
  const colorIndex = Math.floor(Math.random() * theme.colors.length);
  return { color: theme.colors[colorIndex]!, colorIndex };
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

type CourseColor = { color: string; colorIndex: number | null };

/**
 * Recolors courses with a theme's colors. Courses keep their slot, so
 * switching themes round-trips. With `overrideCustom`, custom colors are
 * spread across the slots no other course uses, and courses that shared a
 * custom color stay matched.
 */
export function applyTheme(
  courses: readonly CourseColor[],
  colors: readonly string[],
  overrideCustom: boolean,
): CourseColor[] {
  const usedSlots = new Set(
    courses.flatMap((c) => (c.colorIndex === null ? [] : c.colorIndex)),
  );
  const freeSlots = colors.flatMap((_, i) => (usedSlots.has(i) ? [] : i));
  const pool = freeSlots.length > 0 ? freeSlots : colors.map((_, i) => i);
  const customColors = [
    ...new Set(
      courses.flatMap((c) =>
        c.colorIndex === null ? c.color.toLowerCase() : [],
      ),
    ),
  ];
  const customSlots = new Map(
    spread(pool, customColors.length).map((slot, i) => [
      customColors[i]!,
      slot,
    ]),
  );

  return courses.map((course) => {
    const slot =
      course.colorIndex ??
      (overrideCustom ? customSlots.get(course.color.toLowerCase())! : null);
    return slot === null ? course : { color: colors[slot]!, colorIndex: slot };
  });
}
