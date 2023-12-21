import React, { useEffect } from 'react';
import {
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
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
import { ThemeProvider } from './contexts/themeContext';
import { GapiProvider } from './contexts/gapiContext';

import { isDev, API_ENDPOINT } from './config';

import './index.css';

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

  // Note: this is fully enabled in development. We can revisit this if it
  // becomes annoying. We can also adjust the production sample rate depending
  // on our quotas.
  tracesSampleRate: isDev ? 1.0 : 0.08,
});

const link = createHttpLink({
  uri: `${API_ENDPOINT}/ferry/v1/graphql`,
  credentials: 'include',
});

const client = new ApolloClient({
  // Default cache for now
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
function CustomErrorBoundary({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  if (isDev) return <>{children}</>;

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
    transition: background-color ${({ theme }) => theme.transDur};
  }
  a {
    color: ${({ theme }) => theme.primary};  
    &:hover {
      color: ${({ theme }) => theme.primaryHover};  
    }
  }
  `;

function Globals({ children }: { readonly children: React.ReactNode }) {
  return (
    <CustomErrorBoundary>
      {/* TODO: re-enable StrictMode later */}
      {/* <React.StrictMode> */}
      <GapiProvider>
        <ApolloProvider client={client}>
          <FerryProvider>
            {/* UserProvider must be inside the FerryProvider */}
            <UserProvider>
              <WindowDimensionsProvider>
                <SearchProvider>
                  <WorksheetProvider>
                    <ThemeProvider>
                      <BrowserRouter>
                        <GlobalStyles />
                        <div id="base" style={{ height: 'auto' }}>
                          {children}
                        </div>
                      </BrowserRouter>
                    </ThemeProvider>
                  </WorksheetProvider>
                </SearchProvider>
                {/* TODO: style toasts with bootstrap using https://fkhadra.github.io/react-toastify/how-to-style/ */}
                <ToastContainer toastClassName="rounded" />
              </WindowDimensionsProvider>
            </UserProvider>
          </FerryProvider>
        </ApolloProvider>
      </GapiProvider>
      {/* </React.StrictMode> */}
    </CustomErrorBoundary>
  );
}

export default Globals;
