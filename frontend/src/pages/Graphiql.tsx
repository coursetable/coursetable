import React from 'react';
import GraphiQL from 'graphiql';
import { createGraphiQLFetcher } from '@graphiql/toolkit';

import { GRAPHQL_API_ENDPOINT } from '../config';
import './Graphiql.css';

const fetcher = createGraphiQLFetcher({
  url: `${GRAPHQL_API_ENDPOINT}/v1/graphql`,
  fetch(url, args) {
    // TODO @types/node and lib.dom are conflicting; we should try to exclude Node types
    return fetch(url as never, { ...args, credentials: 'include' });
  },
});

function Graphiql() {
  return (
    <div style={{ height: '90vh' }}>
      <div className="px-3 py-2 text-primary bg-light">
        All of our course data is available for Yale students through GraphQL.
        Note that we truncate each query to 1,000 items for performance reasons.
      </div>
      <GraphiQL fetcher={fetcher} />
    </div>
  );
}
export default Graphiql;
