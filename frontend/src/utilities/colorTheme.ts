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

type CourseColor = { color: string; colorIndex: number | null };

// Courses keep their slot, so switching themes round-trips. Custom colors
// aren't part of any theme and are left alone.
export function applyTheme(
  courses: readonly CourseColor[],
  colors: readonly string[],
): CourseColor[] {
  return courses.map((course) =>
    course.colorIndex === null
      ? course
      : { color: colors[course.colorIndex]!, colorIndex: course.colorIndex },
  );
}
