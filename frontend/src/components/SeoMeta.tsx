import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {
  getCatalogWorksheetCanonicalHref,
  shouldBlockSearchIndexing,
} from '../utilities/seo';

/**
 * Staging: noindex. Catalog/worksheet: rel=canonical for query variants.
 */
export default function SeoMeta() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const qs = searchParams.toString();

  const blockIndexing = useMemo(
    () => shouldBlockSearchIndexing(window.location.hostname),
    [],
  );

  const canonicalHref = useMemo(
    () =>
      getCatalogWorksheetCanonicalHref(
        window.location.origin,
        pathname,
        new URLSearchParams(qs),
      ),
    [pathname, qs],
  );

  if (!blockIndexing && !canonicalHref) return null;

  return (
    <Helmet>
      {blockIndexing && <meta name="robots" content="noindex, nofollow" />}
      {canonicalHref && <link rel="canonical" href={canonicalHref} />}
    </Helmet>
  );
}
