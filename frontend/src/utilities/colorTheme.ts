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
 * Gives every course the theme's color for its slot. A custom color gets a
 * slot picked by CRN: arbitrary, but stable, so previews don't reshuffle on
 * every change. The API picks the same way.
 */
export function applyTheme<T extends CourseColor & { crn: Crn }>(
  courses: readonly T[],
  theme: ColorTheme,
): T[] {
  return courses.map((course) => {
    const colorIndex = course.colorIndex ?? course.crn % theme.colors.length;
    return { ...course, color: theme.colors[colorIndex]!, colorIndex };
  });
}

// Courses on the theme's colors take its new colors; custom colors stay
export function applyThemeEdit<T extends CourseColor>(
  courses: readonly T[],
  colors: readonly string[],
): T[] {
  return courses.map((course) =>
    course.colorIndex === null
      ? course
      : { ...course, color: colors[course.colorIndex]! },
  );
}

/**
 * Courses as the color picker would save them. Changing the theme recolors
 * every course; otherwise only the picked course changes, so a stored color is
 * never rewritten for no reason.
 */
export function applyColorDraft<T extends CourseColor & { crn: Crn }>(
  courses: readonly T[],
  crn: Crn,
  picked: CourseColor | undefined,
  theme: ColorTheme,
  themeChanged: boolean,
): T[] {
  const recolored = themeChanged ? applyTheme(courses, theme) : courses;
  return recolored.map((course) => {
    if (course.crn !== crn || !picked) return course;
    // A preset follows the theme; a custom color stays as picked
    const color =
      picked.colorIndex === null
        ? picked.color
        : theme.colors[picked.colorIndex]!;
    return { ...course, color, colorIndex: picked.colorIndex };
  });
}
