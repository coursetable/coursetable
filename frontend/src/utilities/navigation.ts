export function createCatalogLink(path = '/catalog'): string {
  const lastSearch = sessionStorage.getItem('lastCatalogSearch');
  return `${path}${lastSearch || ''}`;
}
