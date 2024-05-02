import { createGraphiQLFetcher } from '@graphiql/toolkit';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

import { CUR_SEASON, GRAPHQL_API_ENDPOINT } from '../config';

const fetcher = createGraphiQLFetcher({
  url: `${GRAPHQL_API_ENDPOINT}/v1/graphql`,
  fetch(url, args) {
    return fetch(url, { ...args, credentials: 'include' });
  },
});

function Graphiql() {
  return (
    <div style={{ height: '90vh' }}>
      <div className="px-3 py-2 text-primary bg-light">
        All of our course data is available for Yale students through GraphQL.
        Note that we truncate each query to 1,000 items for performance reasons.
      </div>
      <GraphiQL
        fetcher={fetcher}
        defaultQuery={`{
  computed_listing_info(where: { season_code: { _eq: "${CUR_SEASON}" } }) {
    all_course_codes
    credits
    crn
    professor_names
    times_by_day
    title
  }
}`}
      />
    </div>
  );
}
export default Graphiql;
