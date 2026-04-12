import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Row } from 'react-bootstrap';
import {
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { MDXProvider } from '@mdx-js/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import 'sonner/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'core-js/proposals/array-grouping-v2';
import 'core-js/proposals/change-array-by-copy-stage-4';

import ErrorPage from './components/ErrorPage';
import { GapiLoader } from './components/GapiLoader';
import { components } from './components/markdown';
import { isDev, API_ENDPOINT } from './config';
import { SearchBootstrap } from './search/SearchBootstrap';

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
      <BrowserRouter>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_DEV_GCAL_CLIENT_ID}>
          <GapiLoader />
          <ApolloProvider client={client}>
            {/* SearchBootstrap syncs search filters and catalog data into Zustand */}
            <SearchBootstrap>
              <MDXProvider components={components}>
                <div id="base">{children}</div>
              </MDXProvider>
            </SearchBootstrap>
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={5000}
            />
          </ApolloProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
      {/* </React.StrictMode> */}
    </CustomErrorBoundary>
  );
}

export default Globals;
