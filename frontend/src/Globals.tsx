import React from 'react';
import { Row } from 'react-bootstrap';
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
          {/* FerryProvider must be inside UserProvider because the former
            depends on login status */}
          <UserProvider>
            <FerryProvider>
              <WindowDimensionsProvider>
                <SearchProvider>
                  <WorksheetProvider>
                    <ThemeProvider>
                      <GlobalStyles />
                      <div id="base" style={{ height: 'auto' }}>
                        {children}
                      </div>
                    </ThemeProvider>
                  </WorksheetProvider>
                </SearchProvider>
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
