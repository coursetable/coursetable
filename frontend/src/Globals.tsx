import 'react-app-polyfill/stable';
import 'core-js/features/promise/all-settled';
import 'core-js/es/promise/all-settled';

import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import {
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

import * as Sentry from '@sentry/react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { WindowDimensionsProvider } from './contexts/windowDimensionsContext';
import { FerryProvider } from './contexts/ferryContext';
import { UserProvider } from './contexts/userContext';
import { SearchProvider } from './contexts/searchContext';
import { WorksheetProvider } from './contexts/worksheetContext';

import { isDev, API_ENDPOINT } from './config';

import './index.css';

import { lightTheme, darkTheme } from './components/Themes';
import ErrorPage from './components/ErrorPage';
import { Row } from 'react-bootstrap';

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
  environment: import.meta.env.MODE,

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

function ErrorFallback() {
  return (
    <Row className="m-auto" style={{ height: '100vh' }}>
      <ErrorPage message="Internal Error" />
    </Row>
  );
}
function CustomErrorBoundary({ children }: { children: React.ReactNode }) {
  if (isDev) {
    // return <ErrorFallback />;
    return <>{children}</>;
  }
  return (
    <Sentry.ErrorBoundary fallback={ErrorFallback} showDialog>
      {children}
    </Sentry.ErrorBoundary>
  );
}

const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text[0]};
    transition: background-color ${({ theme }) => theme.trans_dur};
  }
  a {
    color: ${({ theme }) => theme.primary};  
    &:hover {
      color: ${({ theme }) => theme.primary_hover};  
    }
  }
  `;

type Theme = 'light' | 'dark';

function Globals({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const setMode = (mode: Theme) => {
    window.localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  const themeToggler = () => {
    if (theme === 'light') setMode('dark');
    else setMode('light');
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme') as Theme;
    if (localTheme) setTheme(localTheme);
  }, []);
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
                  <BrowserRouter>
                    <ThemeProvider theme={themeMode}>
                      <GlobalStyles />
                      <div id="base" style={{ height: 'auto' }}>
                        {/* Clone child and give it the themeToggler prop */}
                        {children &&
                          React.Children.map(
                            children as React.ReactElement<{
                              themeToggler: string | (() => void);
                            }>,
                            (child) => {
                              if (React.isValidElement(child)) {
                                return React.cloneElement(child, {
                                  themeToggler,
                                });
                              }
                              return child;
                            },
                          )}
                      </div>
                    </ThemeProvider>
                  </BrowserRouter>
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
}

export default Globals;
