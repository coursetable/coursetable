// import React from 'react';
// import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Playground, store } from 'graphql-playground-react';

const Graphiql = () => (
  <div>
    <link
      rel="stylesheet"
      href="//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css"
    />
    <Provider store={store}>
      <Playground
        endpoint="https://localhost:3001/ferry/v1/graphql"
        settings={{ 'editor.theme': 'light', 'request.credentials': 'include' }}
      />
    </Provider>
  </div>
);
export default Graphiql;
