import { createLocalStorageSlot } from './browserStorage';

export const CATALOG_CACHE_BUST_KEY = 'catalogCacheBust';

const catalogCacheBustStorage = createLocalStorageSlot<string>(
  CATALOG_CACHE_BUST_KEY,
);

const catalogEndpointPrefixes = [
  '/catalog/public',
  '/catalog/evals',
  '/catalog/metadata',
];

export const isCatalogEndpoint = (endpointSuffix: string) =>
  catalogEndpointPrefixes.some((prefix) => endpointSuffix.startsWith(prefix));

export const getCatalogCacheBustToken = () => catalogCacheBustStorage.get();

export const bumpCatalogCacheBustToken = () => {
  const token = Date.now().toString(36);
  catalogCacheBustStorage.set(token);
  return token;
};
