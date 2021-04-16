// import { Provider } from 'react-redux';
// import { Playground, store } from 'graphql-playground-react';

import { API_ENDPOINT } from '../config';

import GraphiQL from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';

const fetcher = createGraphiQLFetcher({
  url: `${API_ENDPOINT}/ferry/v1/graphql`,
});

const Graphiql = () => (
  <div style={{ height: '100vh' }}>
    {/* <link
      rel="stylesheet"
      href="//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css"
    />
    <Provider store={store}>
      <Playground
        endpoint={`${API_ENDPOINT}/ferry/v1/graphql`}
        settings={{ 'editor.theme': 'light', 'request.credentials': 'include' }}
      />
    </Provider> */}
    <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
    <GraphiQL fetcher={fetcher} editorTheme="dracula" />
  </div>
);
export default Graphiql;
