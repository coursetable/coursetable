import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';
import * as Sentry from '@sentry/react';

// Globals has to be imported first, because it contains all the base CSS!
// eslint-disable-next-line import/order
import Globals from './Globals';
import App from './App';
import { isDev } from './config';
import { TutorialProvider } from './contexts/tutorialContext';

const release = isDev ? 'edge' : import.meta.env.VITE_SENTRY_RELEASE;

Sentry.init({
  enabled: !isDev,
  dsn: 'https://53e6511b51074b35a273d0d47d615927@o476134.ingest.sentry.io/5515218',
  integrations: [
    // See https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  // Unfortunately this is also going to mask some legit errors like CORS, but
  // the vast majority are network problems
  ignoreErrors: [
    'TypeError: Failed to fetch',
    'TypeError: Load failed',
    'TypeError: Importing a module script failed.',
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

  tracesSampleRate: 0.08,
});

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);

root.render(
  <Globals>
    <BrowserRouter>
      {/* Tutorial provider has to be inside the router. Plus it doesn't need
      SSR */}
      <TutorialProvider>
        <App />
      </TutorialProvider>
    </BrowserRouter>
  </Globals>,
);
