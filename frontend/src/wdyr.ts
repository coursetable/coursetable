import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
    .default;
  whyDidYouRender(React, {
    trackAllPureComponents: false,
  });
}
