import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import WindowDimensionsProvider from './components/WindowDimensionsProvider';
import FerryProvider from './components/FerryProvider';

import { UserProvider } from './user';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { InMemoryCache, ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';

import posthog from 'posthog-js';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const POSTHOG_TOKEN =
  process.env.REACT_APP_POSTHOG_TOKEN ||
  console.error('posthog token not set') /* always false */ ||
  'dummy';
// /* testing posthog in development only */ const POSTHOG_TOKEN = 'KP78eJ-P-nRNQcVeL9pgBPGFt_KXOlCnT7ZwoJ9UDUo';
const posthog_options = {
  api_host: 'https://hog.coursetable.com',
  capture_pageview: false,
};
window.posthog = posthog; // save posthog in window object
if (POSTHOG_TOKEN !== '') {
  posthog.init(POSTHOG_TOKEN, {
    ...posthog_options,
  });
} else {
  // Disable capturing.
  posthog.init('[disable]', {
    ...posthog_options,
    opt_out_capturing_by_default: true,
  });
}

// Note: this is currently enabled in development as well. We can revisit this
// if it becomes annoying.
Sentry.init({
  dsn:
    'https://53e6511b51074b35a273d0d47d615927@o476134.ingest.sentry.io/5515218',
  integrations: [new Integrations.BrowserTracing()],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const client = new ApolloClient({
  uri: '/ferry/v1/graphql',
  // default cache for now
  cache: new InMemoryCache(),
});

function SPAPageChangeListener({ callback }) {
  const location = useLocation();
  useEffect(() => {
    posthog.capture('$pageview');
  }, [location]);
  return <></>;
}

function Globals({ children }) {
  return (
    <>
      {/* TODO: reenable StrictMode later */}
      {/* <React.StrictMode> */}
      <ApolloProvider client={client}>
        <FerryProvider>
          {/* UserProvider must be inside the FerryProvider */}
          <UserProvider>
            <WindowDimensionsProvider>
              <Router>
                <SPAPageChangeListener />
                <div id="base" style={{ height: 'auto' }}>
                  {children}
                </div>
              </Router>
              {/* TODO: style toasts with bootstrap using https://fkhadra.github.io/react-toastify/how-to-style/ */}
              <ToastContainer />
            </WindowDimensionsProvider>
          </UserProvider>
        </FerryProvider>
      </ApolloProvider>
      {/* </React.StrictMode> */}
    </>
  );
}

export default Globals;
