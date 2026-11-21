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
    expect(
      applyTheme([{ color: '#aaaaaa', colorIndex: 3 }], colors, false),
    ).toEqual([{ color: colors[3], colorIndex: 3 }]);
  });

  it('leaves custom colors alone unless overriding', () => {
    const course = { color: '#123456', colorIndex: null };
    expect(applyTheme([course], colors, false)).toEqual([course]);
  });

  it('spreads custom colors across unused slots', () => {
    const result = applyTheme(
      [
        { color: '#aaaaaa', colorIndex: 0 },
        { color: '#123456', colorIndex: null },
        { color: '#654321', colorIndex: null },
      ],
      colors,
      true,
    );
    const slots = result.map((c) => c.colorIndex);
    expect(slots[0]).toBe(0);
    expect(new Set(slots).size).toBe(3);
  });

  it('keeps courses that shared a custom color matched', () => {
    const [a, b] = applyTheme(
      [
        { color: '#123456', colorIndex: null },
        { color: '#123456'.toUpperCase(), colorIndex: null },
      ],
      colors,
      true,
    );
    expect(a).toEqual(b);
  });

  it('reuses slots when every slot is taken', () => {
    const full = colors.map((_, i) => ({ color: '#aaaaaa', colorIndex: i }));
    const [custom] = applyTheme(
      [{ color: '#123456', colorIndex: null }, ...full],
      colors,
      true,
    );
    expect(custom!.colorIndex).not.toBeNull();
  });
});
