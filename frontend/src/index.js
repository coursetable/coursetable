// import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

import { UserProvider } from './user';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { InMemoryCache, ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: '/ferry/v1/graphql',
  // default cache for now
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <UserProvider>
        <App />
      </UserProvider>
    </ApolloProvider>
    {/* TODO: style toasts with bootstrap using https://fkhadra.github.io/react-toastify/how-to-style/ */}
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);
