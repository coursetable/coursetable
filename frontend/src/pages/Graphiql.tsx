import { API_ENDPOINT } from '../config';

import GraphiQL from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';

import './Graphiql.css';

const fetcher = createGraphiQLFetcher({
  url: `${API_ENDPOINT}/ferry/v1/graphql`,
  fetch: (url, args) => {
    return fetch(url, { ...args, credentials: 'include' });
  },
});

const Graphiql = () => (
  <div style={{ height: '90vh' }}>
    <div className="px-3 py-2 text-primary bg-light">
      All of our course data are available for Yale students through GraphQL.
      Note that we truncate each query to 1,000 items for performance reasons.
    </div>
    <GraphiQL fetcher={fetcher} defaultSecondaryEditorOpen />
  </div>
);
export default Graphiql;
