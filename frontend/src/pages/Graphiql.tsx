import { API_ENDPOINT } from '../config';

import GraphiQL from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';

const fetcher = createGraphiQLFetcher({
  url: `${API_ENDPOINT}/ferry/v1/graphql`,
  fetch: (url, args) => {
    return fetch(url, { ...args, credentials: 'include' });
  },
});

const Graphiql = () => (
  <div style={{ height: '90vh' }}>
    <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
    <GraphiQL fetcher={fetcher} defaultSecondaryEditorOpen />
  </div>
);
export default Graphiql;
