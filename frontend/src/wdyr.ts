/* eslint-disable */
import React from 'react';

if (import.meta.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies,global-require
  const whyDidYouRender =
    require('@welldone-software/why-did-you-render').default;
  whyDidYouRender(React, {
    trackAllPureComponents: false,
  });
}
