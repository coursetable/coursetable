function catalogSearchSuffix(search: string | URLSearchParams): string {
  const params = new URLSearchParams(search);
  params.delete('course-modal');
  params.delete('prof-modal');
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function saveCatalogSearch(searchParams: URLSearchParams): void {
  sessionStorage.setItem(
    'lastCatalogSearch',
    catalogSearchSuffix(searchParams),
  );
}

export function createCatalogLink(path = '/catalog'): string {
  const lastSearch = sessionStorage.getItem('lastCatalogSearch');
  // Reject corrupt or default-only URLs (e.g. [object Object], empty params)
  if (!lastSearch || lastSearch === '?' || lastSearch.includes('object+Object'))
    return path;

  return `${path}${catalogSearchSuffix(lastSearch)}`;
}
