import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import WindowDimensionsProvider from './components/WindowDimensionsProvider';
import SeasonsProvider from './components/SeasonsProvider';

import { UserProvider } from './user';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { InMemoryCache, ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const client = new ApolloClient({
  uri: '/ferry/v1/graphql',
  // default cache for now
  cache: new InMemoryCache(),
});

function Globals({ children }) {
  return (
    <>
      {/* TODO: reenable StrictMode later */}
      {/* <React.StrictMode> */}
      <ApolloProvider client={client}>
        <UserProvider>
          <WindowDimensionsProvider>
            <SeasonsProvider>
              <Router>
                <div id="base">{children}</div>
              </Router>
              {/* TODO: style toasts with bootstrap using https://fkhadra.github.io/react-toastify/how-to-style/ */}
              <ToastContainer />
            </SeasonsProvider>
          </WindowDimensionsProvider>
        </UserProvider>
      </ApolloProvider>
      {/* </React.StrictMode> */}
    </>
  );
}

export default Globals;
