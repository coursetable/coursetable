import React from 'react';
import * as Sentry from '@sentry/react';
import { Row } from 'react-bootstrap';
import {
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { MDXProvider } from '@mdx-js/react';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'core-js/proposals/array-grouping-v2';
import 'core-js/proposals/change-array-by-copy-stage-4';

import ErrorPage from './components/ErrorPage';
import { components } from './components/markdown';
import { isDev, API_ENDPOINT } from './config';
import { FerryProvider } from './contexts/ferryContext';
import { GapiProvider } from './contexts/gapiContext';
import { SearchProvider } from './contexts/searchContext';
import { WishlistProvider } from './contexts/wishlistContext';

import './index.css';

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
          <FerryProvider>
            {/* SearchProvider must be inside WorksheetProvider because the
                  former depends on the currently viewed worksheet */}
            <WishlistProvider>
              <SearchProvider>
                <MDXProvider components={components}>
                  <div id="base">{children}</div>
                </MDXProvider>
              </SearchProvider>
            </WishlistProvider>
            <ToastContainer toastClassName="rounded" />
          </FerryProvider>
        </ApolloProvider>
      </GapiProvider>
      {/* </React.StrictMode> */}
    </CustomErrorBoundary>
  );
}

export default Globals;
