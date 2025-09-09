import { createGraphiQLFetcher } from '@graphiql/toolkit';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

import { CUR_SEASON, GRAPHQL_API_ENDPOINT } from '../config';

const graphiqlFetch = Object.assign(
  (url: RequestInfo | URL, args?: RequestInit) =>
    fetch(url, { ...args, credentials: 'include' }),
  {
    preconnect: fetch.preconnect,
  },
);

const fetcher = createGraphiQLFetcher({
  url: `${GRAPHQL_API_ENDPOINT}/v1/graphql`,
  fetch: graphiqlFetch,
});

function Graphiql() {
  return (
    <div style={{ height: '90vh' }}>
      <div className="px-3 py-2 text-primary bg-light">
        All of our course data is available for Yale students through GraphQL.
        We have{' '}
        <a
          href="https://github.com/coursetable/coursetable/blob/master/docs/graphql.md"
          target="_blank"
          rel="noreferrer noopener"
        >
          some documentation
        </a>{' '}
        available to help you get started.
      </div>
      <GraphiQL
        fetcher={fetcher}
        defaultQuery={`{
  courses(where: { season_code: { _eq: "${CUR_SEASON}" } }) {
    title
    credits
    # Get information about the course's meetings
    course_meetings {
      days_of_week
      start_time
      end_time
      location {
        room
        building {
          code
        }
      }
    }
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
