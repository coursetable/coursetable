export function createCatalogLink(path = '/catalog'): string {
  const lastSearch = sessionStorage.getItem('lastCatalogSearch');
  // Reject corrupt or default-only URLs (e.g. [object Object], empty params)
  if (!lastSearch || lastSearch === '?' || lastSearch.includes('object+Object'))
    return path;

  return `${path}${lastSearch}`;
}
