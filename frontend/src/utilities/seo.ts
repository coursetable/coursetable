/** Non-production hosts that must not appear in search indexes. */
const STAGING_HOSTNAMES = new Set(['staging.coursetable.com']);

/**
 * True when this deployment should not be indexed (staging, previews, etc.).
 * Set `VITE_BLOCK_INDEXING=true` in the frontend build env (e.g. Cloudflare
 * Pages / CI) for any host that isn’t production.
 */
export function shouldBlockSearchIndexing(hostname: string): boolean {
  if (import.meta.env.VITE_BLOCK_INDEXING === 'true') return true;
  return STAGING_HOSTNAMES.has(hostname);
}

/**
 * Preferred URL for catalog/worksheet: path + only `course-modal` or
 * `prof-modal` (no filters, search text, or duplicate keys).
 *
 * If both modal params exist, `course-modal` wins (see ModalHistoryBridge).
 */
export function getCatalogWorksheetCanonicalHref(
  origin: string,
  pathname: string,
  searchParams: URLSearchParams,
): string | null {
  if (pathname !== '/catalog' && pathname !== '/worksheet') return null;

  const courseModal = searchParams.get('course-modal');
  const profModal = searchParams.get('prof-modal');

  if (courseModal)
    return `${origin}${pathname}?course-modal=${encodeURIComponent(courseModal)}`;
  if (profModal)
    return `${origin}${pathname}?prof-modal=${encodeURIComponent(profModal)}`;

  return `${origin}${pathname}`;
}
