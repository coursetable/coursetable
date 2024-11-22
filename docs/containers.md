# Containers & DB

CourseTable uses the following Docker containers for core functionality, so they must be running for the app to work:

- `express`: this contains the Express app code for running the API.
- `db`: this is a Postgres database that stores user data.
- `graphql-engine`: this is a Hasura engine that wraps the Postgres database created by Ferry. The engine exposes a GraphQL API for querying the data.
- `redis`: this is a Redis stack server that stores all user sessions from Express.
- `pgadmin`: this is a pgadmin instance that allows you to view the Postgres database managed by API. It is useful for debugging and DB manipulation.

In `coursetable/api`, we only manage the `express` container. We do provide development versions of the `db`, `pgadmin`, `graphql-engine`, and `redis` containers, which should mirror the setup and table schema used in prod, but the actual prod configuration is located at [`coursetable/infra`](https://github.com/coursetable/infra/).

## Working with the database

You can directly interface with our database via pgadmin. In development, you can visit `http://localhost:8081`. All credentials can be found on Doppler, by checking out the "dev" environment. You will first need to log into the dashboard, the credentials for which are the `PGADMIN_EMAIL` and `PGADMIN_PASSWORD` environment variables. Then, when you are inside, you can expand the "Servers" dropdown in the left sidebar—which should ask you for the password to connect to the DB, which is the `DB_ROOT_PASSWORD` environment variable. In prod, the steps are the same, and the dashboard is at https://pgadmin.coursetable.com/ (only admins have access to the credentials).

When you go to "Servers > Local > Databases", you will notice that we have two databases:

- `coursetable` is the user database managed by the API. This is accessed directly by the Express app via Drizzle.
- `postgres` is the course database managed by Ferry. This is exposed as a GraphQL API by the Hasura engine.

Under the hood, these are both stored in the `db` Postgres container.

### Working with user data

Here's the data flow for user data:

1. In dev, we always create a new Postgres database; in prod, we use the existing one.
2. The API directly connects to this database using Drizzle.
3. The frontend requests the Express endpoint, which then makes DB calls.

If you want to make changes to the DB schema, you can do so by modifying the `api/drizzle/schema.ts` file. This file is used to generate the DB schema and the TypeScript types for the API. For every update, and also for the initial setup, you need to run `npm run db:push` in the `express` container. You can do this by running:

```bash
docker exec -it express "cd api && npm run db:push"
```

Note that if you delete the local container images and start them again, the DB is now empty. You need to run `db:push` to re-initialize the DB. Then, on the dev frontend, you need to log in again because your user record does not exist anymore. If you don't want to go through the challenge process, you can visit `http://localhost:8081` and modify the database, in `studentBluebookSettings#evaluationsEnabled`.

### Working with course data

Here's the data flow for course data:

1. Ferry writes course data to [`ferry-data`](https://github.com/coursetable/ferry-data) in JSON. This data is used to ensure reproducibility and to allow for easy debugging; it does not correspond to the actual DB schema.
2. Ferry then writes the data to the `postgres` DB on the prod server.
3. The prod database is regularly dumped into an endpoint. The dev `start.sh` script will pull data from this endpoint to populate the local Postgres database, if invoking `start.sh` with the `--ferry_seed` (`-f`) flag.
4. During development and prod, we spin up a Hasura engine that wraps the Postgres database and exposes a GraphQL API.
5. The Express app queries the GraphQL API and generates static JSON again, located in the `api/static` folder. This data is only overwritten in dev by running `start.sh` with the `--overwrite` (`-o`) flag, or in prod by Ferry requesting the `/api/catalog/refresh` endpoint. The idea of this step is to aggressively cache the GQL responses so every frontend request doesn't have to hit the GQL API. It also powers the client-side course search.
6. The frontend requests the Express endpoint, which serves these JSON files. The frontend also requests the GraphQL API directly for more complex queries.

The Hasura Engine dashboard is available at `http://localhost:8085`. In production, it is at `https://gql.coursetable.com/`. To access the dashboard, you need to log in with the `HASURA_GRAPHQL_ADMIN_SECRET` environment variable. You can find this secret in Doppler.

If you want to make changes to the courses DB schema, you would need to start by modifying Ferry, which is the only actor that can write into the DB. Then, once Ferry has done one recrawl, the DB will contain the data you want (you can go to pgadmin to make sure). Then, you can do the following to cascade this change:

- Sync the prod GQL schema with the DB schema by going to the Hasura dashboard and clicking "Track all" on the `public` schema.
- Sync the dev DB with the prod DB by running `./start.sh -f`.
- Sync the dev GQL schema with the dev DB by doing the same steps as 1, but on the dev Hasura dashboard.

For more changes related to GraphQL, such as how the SDKs are generated and how to make sure the SDK types reflect the latest DB schema, refer to the [GraphQL](./graphql.md) docs.
