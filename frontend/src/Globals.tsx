import React from 'react';
import { Row } from 'react-bootstrap';
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

function Globals({ children }: { readonly children: React.ReactNode }) {
  return (
    <CustomErrorBoundary>
      {/* TODO: re-enable StrictMode later */}
      {/* <React.StrictMode> */}
      <GapiProvider>
        <ApolloProvider client={client}>
          {/* FerryProvider must be inside UserProvider because the former
            depends on login status */}
          <UserProvider>
            <FerryProvider>
              <WindowDimensionsProvider>
                {/* SearchProvider must be inside WorksheetProvider because the
                  former depends on the currently viewed worksheet */}
                <WorksheetProvider>
                  <SearchProvider>
                    <ThemeProvider>
                      <div id="base">{children}</div>
                    </ThemeProvider>
                  </SearchProvider>
                </WorksheetProvider>
                {/* TODO: style toasts with bootstrap using https://fkhadra.github.io/react-toastify/how-to-style/ */}
                <ToastContainer toastClassName="rounded" />
              </WindowDimensionsProvider>
            </FerryProvider>
          </UserProvider>
        </ApolloProvider>
      </GapiProvider>
      {/* </React.StrictMode> */}
    </CustomErrorBoundary>
  );
}

export default Globals;
