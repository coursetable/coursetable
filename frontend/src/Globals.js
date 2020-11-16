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
import reportWebVitals from './reportWebVitals';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { ThemeProvider } from 'styled-components';
import { useDarkMode } from './components/UseDarkMode';
import { GlobalStyles } from './components/GlobalStyles';
import { lightTheme, darkTheme } from './components/Themes';

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

const isDev = process.env.NODE_ENV === 'development';
Sentry.init({
  dsn:
    'https://53e6511b51074b35a273d0d47d615927@o476134.ingest.sentry.io/5515218',
  integrations: [new Integrations.BrowserTracing()],
  environment: process.env.NODE_ENV,

  // Note: this is currently enabled in development. We can revisit this if it becomes annoying.
  // We can also adjust the production sample rate depending on our quotas.
  tracesSampleRate: isDev ? 1.0 : 0.2,
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
  // website light/dark theme
  const [theme, themeToggler] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;
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
                <ThemeProvider theme={themeMode}>
                  <>
                    <GlobalStyles />
                    <div id="base" style={{ height: 'auto' }}>
                      {/* Clone child and give it the themeToggler prop */}
                      {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                          return React.cloneElement(child, {
                            themeToggler: themeToggler,
                          });
                        }
                        return child;
                      })}
                    </div>
                  </>
                </ThemeProvider>
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((metric) => {
  console.log('web-vitals', metric);
  const { entries: _, ...reportableMetric } = metric;
  posthog.capture('web-vitals', { ...reportableMetric });
});

export default Globals;
