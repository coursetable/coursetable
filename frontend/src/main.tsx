import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';
import * as Sentry from '@sentry/react';

import Globals from './Globals';
import App from './App';
import { isDev } from './config';

const release = isDev ? 'edge' : import.meta.env.VITE_SENTRY_RELEASE;

Sentry.init({
  dsn: 'https://53e6511b51074b35a273d0d47d615927@o476134.ingest.sentry.io/5515218',
  integrations: [
    // See https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      ),
    }),
  ],
  // Unfortunately this is also going to mask some legit errors like CORS, but
  // the vast majority are network problems
  ignoreErrors: [
    'TypeError: Failed to fetch',
    'TypeError: Load failed',
    'TypeError: cancelled',
    'TypeError: NetworkError when attempting to fetch resource.',
    'TypeError: The network connection was lost.',

    // These occur with incomplete data
    'SyntaxError: The string did not match the expected pattern.',
    /SyntaxError: .*JSON.*/u,
    'Syntax Error: Unexpected <EOF>.',
  ],
  environment: import.meta.env.MODE,

  // See https://docs.sentry.io/platforms/javascript/configuration/releases/.
  release,
  autoSessionTracking: true,

  // Note: this is fully enabled in development. We can revisit this if it
  // becomes annoying. We can also adjust the production sample rate depending
  // on our quotas.
  tracesSampleRate: isDev ? 1.0 : 0.08,
});

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
  <Globals>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Globals>,
);
