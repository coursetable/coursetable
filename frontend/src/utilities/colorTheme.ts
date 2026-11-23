import { classicColors } from './constants';
import type { ColorTheme } from '../queries/api';
import type { Crn } from '../queries/graphql-types';

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

export type CourseColor = { color: string; colorIndex: number | null };

/**
 * Courses as the color picker would save them: the picked course gets its new
 * color, and courses using a theme color take the theme's color for their
 * slot. Only the picked course follows the theme unless it changed, so a
 * stored color is never rewritten for no reason. Custom colors are left alone.
 */
export function applyColorDraft<T extends CourseColor & { crn: Crn }>(
  courses: readonly T[],
  crn: Crn,
  picked: CourseColor | undefined,
  theme: ColorTheme,
  themeChanged: boolean,
): T[] {
  return courses.map((course) => {
    const isPicked = course.crn === crn && picked !== undefined;
    const next = isPicked ? { ...course, ...picked } : course;
    if (next.colorIndex === null || !(isPicked || themeChanged)) return next;
    return { ...next, color: theme.colors[next.colorIndex]! };
  });
}
