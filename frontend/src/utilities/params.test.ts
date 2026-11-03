import { describe, expect, it } from 'vitest';

import {
  buildCatalogSearchParams,
  getFilterFromParams,
  sanitizeSavedSearchQueryString,
} from './params';
import { defaultFilters, emptyFilters } from '../search/searchConstants';

describe('hideFull filter params', () => {
  it('parses true and false', () => {
    expect(getFilterFromParams('hideFull', 'true', false)).toBe(true);
    expect(getFilterFromParams('hideFull', 'false', true)).toBe(false);
  });

  it('falls back for empty or malformed values', () => {
    expect(getFilterFromParams('hideFull', '', true)).toBe(true);
    expect(getFilterFromParams('hideFull', 'yes', true)).toBe(true);
  });

  it('is off by default and when filters are reset to empty', () => {
    expect(defaultFilters.hideFull).toBe(false);
    expect(emptyFilters.hideFull).toBe(false);
  });

  it('serializes only when non-default', () => {
    const withFull = buildCatalogSearchParams(
      { ...defaultFilters, hideFull: true },
      defaultFilters,
      new URLSearchParams(),
    );
    expect(withFull.get('hideFull')).toBe('true');

    const withoutFull = buildCatalogSearchParams(
      defaultFilters,
      defaultFilters,
      new URLSearchParams(),
    );
    expect(withoutFull.has('hideFull')).toBe(false);
  });

  it('sanitizes saved search query strings', () => {
    expect(
      sanitizeSavedSearchQueryString('?hideFull=true', defaultFilters),
    ).toBe('?hideFull=true');
    expect(
      sanitizeSavedSearchQueryString('?hideFull=false', defaultFilters),
    ).toBe('');
  });
});
