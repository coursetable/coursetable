import { describe, expect, it } from 'vitest';

import {
  applyColorDraft,
  applyTheme,
  applyThemeEdit,
  fallbackTheme,
  getWorksheetTheme,
  randomSlots,
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

describe('applyTheme', () => {
  it('recolors every course, giving custom colors a stable slot', () => {
    const courses = [
      { crn: crn(1), color: '#000004', colorIndex: 4 },
      { crn: crn(27), color: '#123456', colorIndex: null },
    ];
    expect(applyTheme(courses, next)).toEqual([
      { crn: crn(1), color: next.colors[4], colorIndex: 4 },
      { crn: crn(27), color: next.colors[7], colorIndex: 7 },
    ]);
    expect(applyTheme(courses, next)).toEqual(applyTheme(courses, next));
  });
});

describe('applyColorDraft', () => {
  const courses = [
    { crn: crn(1), color: '#000003', colorIndex: 3 },
    { crn: crn(2), color: '#123456', colorIndex: null },
  ];

  it('recolors every course when the theme changes', () => {
    expect(applyColorDraft(courses, crn(1), undefined, next, true)).toEqual([
      { crn: crn(1), color: next.colors[3], colorIndex: 3 },
      { crn: crn(2), color: next.colors[2], colorIndex: 2 },
    ]);
  });

  it('only changes the picked course when the theme is unchanged', () => {
    expect(
      applyColorDraft(
        courses,
        crn(1),
        { color: '#ffff01', colorIndex: 1 },
        next,
        false,
      ),
    ).toEqual([
      { crn: crn(1), color: next.colors[1], colorIndex: 1 },
      courses[1],
    ]);
  });

  it('keeps a custom color picked after switching themes', () => {
    const picked = { color: '#abcdef', colorIndex: null };
    expect(applyColorDraft(courses, crn(1), picked, next, true)[0]).toEqual({
      crn: crn(1),
      ...picked,
    });
  });
});

describe('applyThemeEdit', () => {
  it('moves theme colors to the edit and leaves custom colors', () => {
    const custom = { color: '#123456', colorIndex: null };
    expect(
      applyThemeEdit(
        [{ color: '#000002', colorIndex: 2 }, custom],
        next.colors,
      ),
    ).toEqual([{ color: next.colors[2], colorIndex: 2 }, custom]);
  });
});

describe('randomSlots', () => {
  it("doesn't repeat a slot until every one is used", () => {
    const slots = randomSlots(
      Array.from({ length: 10 }, (_, i) => crn(i)),
      10,
    );
    expect(new Set(slots.values()).size).toBe(10);
  });

  it('cycles through slots for more courses than colors', () => {
    const slots = randomSlots(
      Array.from({ length: 12 }, (_, i) => crn(i)),
      10,
    );
    expect(slots.size).toBe(12);
    expect(new Set(slots.values()).size).toBe(10);
  });
});

describe('applyColorDraft randomized', () => {
  it('recolors every course, custom ones included', () => {
    const randomized = new Map([
      [crn(1), 8],
      [crn(2), 0],
    ]);
    expect(
      applyColorDraft(
        [
          { crn: crn(1), color: '#000003', colorIndex: 3 },
          { crn: crn(2), color: '#123456', colorIndex: null },
        ],
        crn(1),
        undefined,
        next,
        false,
        randomized,
      ),
    ).toEqual([
      { crn: crn(1), color: next.colors[8], colorIndex: 8 },
      { crn: crn(2), color: next.colors[0], colorIndex: 0 },
    ]);
  });
});
