import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { getCanonicalHref, shouldBlockSearchIndexing } from '../utilities/seo';

/**
 * Staging: noindex. Modal params → canonical `/catalog?…`; every other route
 * uses origin + pathname so tracking/search junk in the query is dropped.
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
      getCanonicalHref(
        window.location.origin,
        pathname,
        new URLSearchParams(qs),
      ),
    [pathname, qs],
  );

  return (
    <Helmet>
      {blockIndexing && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalHref} />
    </Helmet>
  );
}
