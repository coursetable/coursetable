import { describe, expect, it } from 'vitest';

import { isCustomColor, mapColorsToTheme } from './colorTheme';
import { colorThemes } from './constants';

const [classic, sakura, ocean] = colorThemes;

describe('isCustomColor', () => {
  it('treats theme colors as non-custom, case-insensitively', () => {
    expect(isCustomColor(classic.colors[0])).toBe(false);
    expect(isCustomColor(sakura.colors[3].toUpperCase())).toBe(false);
  });

  it('treats anything else as custom', () => {
    expect(isCustomColor('#123456')).toBe(true);
  });
});

describe('mapColorsToTheme', () => {
  it('keeps theme colors in the same position', () => {
    const map = mapColorsToTheme(
      [classic.colors[3], classic.colors[7]],
      sakura.colors,
    );
    expect(map.get(classic.colors[3])).toBe(sakura.colors[3]);
    expect(map.get(classic.colors[7])).toBe(sakura.colors[7]);
  });

  it('is a no-op when reapplying the same theme', () => {
    const map = mapColorsToTheme(sakura.colors, sakura.colors);
    for (const color of sakura.colors) expect(map.get(color)).toBe(color);
  });

  it('maps duplicate and differently-cased colors once', () => {
    const map = mapColorsToTheme(
      [classic.colors[2], classic.colors[2].toUpperCase()],
      sakura.colors,
    );
    expect(map.size).toBe(1);
  });

  it('gives colliding and custom colors distinct unused slots', () => {
    const map = mapColorsToTheme(
      [classic.colors[0], ocean.colors[0], '#123456', '#abcdef'],
      sakura.colors,
    );
    const assigned = [...map.values()];
    expect(map.get(classic.colors[0])).toBe(sakura.colors[0]);
    expect(new Set(assigned).size).toBe(4);
    for (const color of assigned) expect(sakura.colors).toContain(color);
  });

  it('reuses theme colors when there are more colors than slots', () => {
    const custom = Array.from(
      { length: 12 },
      (_, i) => `#0000${i.toString(16).padStart(2, '0')}`,
    );
    const map = mapColorsToTheme(custom, sakura.colors);
    expect(map.size).toBe(12);
    for (const color of map.values()) expect(sakura.colors).toContain(color);
  });
});
