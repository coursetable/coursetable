import { describe, expect, it } from 'vitest';

import { applyTheme, fallbackTheme, getWorksheetTheme } from './colorTheme';
import type { ColorTheme } from '../queries/api';

const theme = (id: number, isDefault = false): ColorTheme => ({
  id,
  name: `Theme ${id}`,
  colors: Array.from({ length: 10 }, (_, i) => `#00000${i}`),
  isDefault,
});
const themes = [theme(1, true), theme(2)];
const colors = Array.from({ length: 10 }, (_, i) => `#ffff0${i}`);

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

describe('applyTheme', () => {
  it('keeps each course in its slot', () => {
    expect(applyTheme([{ color: '#aaaaaa', colorIndex: 3 }], colors)).toEqual([
      { color: colors[3], colorIndex: 3 },
    ]);
  });

  it('leaves custom colors alone', () => {
    const course = { color: '#123456', colorIndex: null };
    expect(applyTheme([course], colors)).toEqual([course]);
  });
});
