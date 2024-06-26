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
  courses(where: { season_code: { _eq: "${CUR_SEASON}" } }) {
    title
    credits
    times_by_day
    # Get information about professors that teach this course
    course_professors {
      professor {
        name
      }
    }
    # Get information about all listings associated with this course
    listings {
      crn
      course_code
      section
    }
  }
}`}
      />
    </div>
  );
}
export default Graphiql;
