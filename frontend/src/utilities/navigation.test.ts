import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { createCatalogLink, saveCatalogSearch } from './navigation';

beforeEach(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
});

afterEach(() => vi.unstubAllGlobals());

it('saves catalog filters without removing the modal from the live query', () => {
  const params = new URLSearchParams(
    'course-modal=202603-12345&searchText=art+history',
  );

  saveCatalogSearch(params);

  expect(sessionStorage.getItem('lastCatalogSearch')).toBe(
    '?searchText=art+history',
  );
  expect(params.get('course-modal')).toBe('202603-12345');
});

it('ignores modal parameters in an existing saved catalog search', () => {
  sessionStorage.setItem(
    'lastCatalogSearch',
    '?course-modal=202603-12345&prof-modal=42&searchText=art+history',
  );

  expect(createCatalogLink()).toBe('/catalog?searchText=art+history');
});

it('links to the plain catalog when the saved query only contains a modal', () => {
  sessionStorage.setItem('lastCatalogSearch', '?prof-modal=42');

  expect(createCatalogLink()).toBe('/catalog');
});
