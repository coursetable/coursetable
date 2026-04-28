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
 * Canonical URL for SPA routes:
 *
 * - **`course-modal` on any path:** `/catalog?course-modal=…`
 * - **`prof-modal` on any path** (no `course-modal`): `/catalog?prof-modal=…`
 * - **`/catalog` or `/worksheet` with neither param:** bare path (drop filters,
 *   search text, extra keys).
 *
 * If both modal params exist, `course-modal` wins (see ModalHistoryBridge).
 */
export function getCatalogWorksheetCanonicalHref(
  origin: string,
  pathname: string,
  searchParams: URLSearchParams,
): string | null {
  const courseModal = searchParams.get('course-modal');
  if (courseModal)
    return `${origin}/catalog?course-modal=${encodeURIComponent(courseModal)}`;

  const profModal = searchParams.get('prof-modal');
  if (profModal)
    return `${origin}/catalog?prof-modal=${encodeURIComponent(profModal)}`;

  if (pathname !== '/catalog' && pathname !== '/worksheet') return null;

  return `${origin}${pathname}`;
}
