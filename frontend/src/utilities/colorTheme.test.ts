import { describe, expect, it } from 'vitest';

import {
  applyColorDraft,
  fallbackTheme,
  getWorksheetTheme,
} from './colorTheme';
import type { ColorTheme } from '../queries/api';
import type { Crn } from '../queries/graphql-types';

const theme = (id: number, isDefault = false): ColorTheme => ({
  id,
  name: `Theme ${id}`,
  colors: Array.from({ length: 10 }, (_, i) => `#00000${i}`),
  isDefault,
});
const themes = [theme(1, true), theme(2)];
const next = {
  ...theme(3),
  colors: Array.from({ length: 10 }, (_, i) => `#ffff0${i}`),
};
const crn = (n: number) => n as Crn;

describe('getWorksheetTheme', () => {
  it('finds the worksheet theme by id', () => {
    expect(getWorksheetTheme(themes, 2).id).toBe(2);
  });

  it('uses the default theme when unset or deleted', () => {
    expect(getWorksheetTheme(themes, null).id).toBe(1);
    expect(getWorksheetTheme(themes, 99).id).toBe(1);
  });

  it('uses the fallback before themes load', () => {
    expect(getWorksheetTheme(undefined, 2)).toBe(fallbackTheme);
  });
});

describe('applyColorDraft', () => {
  const courses = [
    { crn: crn(1), color: '#000003', colorIndex: 3 },
    { crn: crn(2), color: '#123456', colorIndex: null },
  ];

  it('moves theme colors to the new theme, keeping their slot', () => {
    expect(applyColorDraft(courses, crn(1), undefined, next, true)).toEqual([
      { crn: crn(1), color: next.colors[3], colorIndex: 3 },
      courses[1],
    ]);
  });

  it('leaves other courses alone when the theme is unchanged', () => {
    const [picked, other] = applyColorDraft(
      [courses[0]!, { crn: crn(3), color: '#000005', colorIndex: 5 }],
      crn(1),
      { color: '#ffff01', colorIndex: 1 },
      next,
      false,
    );
    expect(picked).toEqual({
      crn: crn(1),
      color: next.colors[1],
      colorIndex: 1,
    });
    expect(other!.color).toBe('#000005');
  });

  it('keeps a picked custom color', () => {
    const picked = { color: '#abcdef', colorIndex: null };
    expect(applyColorDraft(courses, crn(1), picked, next, true)[0]).toEqual({
      crn: crn(1),
      ...picked,
    });
  });
});
