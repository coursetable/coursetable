# Using GraphQL

CourseTable heavily relies on GraphQL to interact with course data. Here are some tricks to integrate your GraphQL queries with the TypeScript code.

## Writing queries

Here are all useful resources to help you write GraphQL queries:

- [GraphQL documentation](https://graphql.org/learn/) for the general query structure.
- [Hasura Postgres queries](https://hasura.io/docs/latest/queries/postgres/index/) for Hasura specific queries—you will see `where(season_code: { _eq: $seasonCode })` very often.
- [Ferry DB diagram](https://github.com/coursetable/ferry/blob/master/docs/db_diagram.pdf) for the database schema. For example, because there's a relationship between `listings` and `courses`, both of the following queries are valid:

  ```graphql
  query {
    listings {
      course {
        title
      }
    }
  }
  ```

  ```graphql
  query {
    courses {
      listings {
        crn
      }
    }
  }
  ```

  The diagram cannot tell you the exact naming of the relationship, though. To find out more details, you can use the [Ferry models config](https://github.com/coursetable/ferry/blob/master/ferry/database/models.py).

- [GraphiQL playground](https://coursetable.com/graphiql) to test your queries. On the left sidebar, you can see the schema and the documentation for each field.

## Generating SDKs

> [!NOTE]
> SDKs are generated against the local dev GraphQL engine. This may not reflect the production schema.
>
> Every time you run codegen (which means every time you start the API), make sure that the generated changes are intended. If you see unexpected changes, you may need to update your local schema. To make sure they are in sync, refer to the [containers & DB docs](./containers.md).

### API

On the API side, SDKs are collocated with the API endpoints that use them.

1. Create a file `src/my-api/my-api.queries.graphql`. Write your query, for example:

   ```graphql
   query courseMetadata($seasonCode: String!, $crn: Int!) {
     listings(
       where: { season_code: { _eq: $seasonCode }, crn: { _eq: $crn } }
     ) {
       course_code
       section
       course {
         title
         description
       }
     }
   }
   ```

2. Start the API service with `./start.sh -d`. This does two things:

   - It starts the GraphQL server.
   - It runs `graphql-codegen` to generate strongly-typed query SDKs located at `src/my-api/my-api.queries.ts`.

3. Import the generated SDK in your API file:

   ```ts
   import { getSdk } from './my-api.queries.js';
   import { graphqlClient } from '../config.js';

   const data = await getSdk(graphqlClient).courseMetadata({
     seasonCode: '202201',
     crn: 12345,
   });
   ```

Note that the generated SDK is committed to git, which allows CI/CD to run without having to re-generate.

### Frontend

On the frontend side, SDKs are all located in `src/generated`.

1. Write your query in `src/queries/queries.graphql`. For example:

   ```graphql
   query CourseMetadata($seasonCode: String!, $crn: Int!) {
     listings(
       where: { season_code: { _eq: $seasonCode }, crn: { _eq: $crn } }
     ) {
       course_code
       section
       course {
         title
         description
       }
     }
   }
   ```

2. Start the API service with `./start.sh -d`. The frontend codegen talks to the GraphQL server exposed by the API.
3. In frontend, run `bun codegen`. This step needs to be done manually every time you change the query. Note that the codegen relies on the admin secret environment, so make sure you run: `doppler setup -p coursetable -c dev && doppler run --command "bun codegen"`.

   > [!NOTE]
   > We recommend you run `bun codegen` regularly because we also copy the `infoAttributes.json` and `seasons.json` files which are constantly changing.

4. Import the generated SDK in your frontend file:

   ```ts
   import { useCourseMetadataQuery } from '../queries/graphql-queries';

   const { data, loading, error } = useCourseMetadataQuery({
     variables: {
       seasonCode: '202201',
       crn: 12345,
     },
   });
   ```
