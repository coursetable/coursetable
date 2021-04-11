// import './wdyr';
import 'react-app-polyfill/stable';
import 'core-js/features/promise/all-settled';
import 'core-js/es/promise/all-settled';

import React, { useEffect } from 'react';
import { Router, useLocation } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import {
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

import posthog from 'posthog-js';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import reportWebVitals from './reportWebVitals';
import WindowDimensionsProvider from './components/WindowDimensionsProvider';
import FerryProvider from './components/FerryProvider';
import { UserProvider } from './user';
import { SearchProvider } from './searchContext';
import { WorksheetProvider } from './worksheetContext';

import { isDev, API_ENDPOINT, POSTHOG_TOKEN, POSTHOG_OPTIONS } from './config';

import './index.css';

import { useDarkMode } from './components/UseDarkMode';
import { GlobalStyles } from './components/GlobalStyles';
import { lightTheme, darkTheme } from './components/Themes';
import ErrorPage from './components/ErrorPage';
import { Row } from 'react-bootstrap';

// @ts-ignore
window.posthog = posthog; // save posthog in window object
if (POSTHOG_TOKEN !== '') {
  posthog.init(POSTHOG_TOKEN, {
    ...POSTHOG_OPTIONS,
  });
} else {
  // Disable capturing.
  posthog.init('[disable]', {
    ...POSTHOG_OPTIONS,
    opt_out_capturing_by_default: true,
  });
}

const history = createBrowserHistory();

const release = isDev ? 'edge' : process.env.REACT_APP_SENTRY_RELEASE;
Sentry.init({
  dsn:
    'https://53e6511b51074b35a273d0d47d615927@o476134.ingest.sentry.io/5515218',
  integrations: [
    new Integrations.BrowserTracing({
      // Via https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
    // @ts-ignore
    new posthog.SentryIntegration(posthog, 'coursetable', 5515218),
  ],
  environment: process.env.NODE_ENV,

  // See https://docs.sentry.io/platforms/javascript/configuration/releases/.
  release,
  autoSessionTracking: true,

  // Note: this is fully enabled in development. We can revisit this if it becomes annoying.
  // We can also adjust the production sample rate depending on our quotas.
  tracesSampleRate: isDev ? 1.0 : 0.08,
});

const link = createHttpLink({
  uri: `${API_ENDPOINT}/ferry/v1/graphql`,
  credentials: 'include',
});

const client = new ApolloClient({
  // uri: `${API_ENDPOINT}/ferry/v1/graphql`,
  // default cache for now
  cache: new InMemoryCache(),
  link,
});

function SPAPageChangeListener() {
  const location = useLocation();
  useEffect(() => {
    posthog.capture('$pageview');
  }, [location]);
  return <></>;
}

function ErrorFallback() {
  return (
    <Row className="m-auto" style={{ height: '100vh' }}>
      <ErrorPage message="Internal Error" />
    </Row>
  );
}
const CustomErrorBoundary: React.FC = ({ children }) => {
  if (isDev) {
    // return <ErrorFallback />;
    return <>{children}</>;
  }
  return (
    <Sentry.ErrorBoundary fallback={ErrorFallback} showDialog>
      {children}
    </Sentry.ErrorBoundary>
  );
};

const Globals: React.FC = ({ children }) => {
  // website light/dark theme
  const [theme, themeToggler] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;
  return (
    <CustomErrorBoundary>
      {/* TODO: re-enable StrictMode later */}
      {/* <React.StrictMode> */}
      <ApolloProvider client={client}>
        <FerryProvider>
          {/* UserProvider must be inside the FerryProvider */}
          <UserProvider>
            <WindowDimensionsProvider>
              <SearchProvider>
                <WorksheetProvider>
                  <Router history={history}>
                    <SPAPageChangeListener />
                    <ThemeProvider theme={themeMode}>
                      <>
                        <GlobalStyles />
                        <div id="base" style={{ height: 'auto' }}>
                          {/* Clone child and give it the themeToggler prop */}
                          {React.Children.map(children, (child) => {
                            if (React.isValidElement(child)) {
                              return React.cloneElement(child, {
                                themeToggler,
                              });
                            }
                            return child;
                          })}
                        </div>
                      </>
                    </ThemeProvider>
                  </Router>
                </WorksheetProvider>
              </SearchProvider>
              {/* TODO: style toasts with bootstrap using https://fkhadra.github.io/react-toastify/how-to-style/ */}
              <ToastContainer toastClassName="rounded" />
            </WindowDimensionsProvider>
          </UserProvider>
        </FerryProvider>
      </ApolloProvider>
      {/* </React.StrictMode> */}
    </CustomErrorBoundary>
  );
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((metric) => {
  const { entries: _, ...reportableMetric } = metric;
  posthog.capture('web-vitals', { ...reportableMetric });
});

export default Globals;
