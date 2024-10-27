# Containers & DB

CourseTable uses the following Docker containers for core functionality, so they must be running for the app to work:

- `express`: this contains the Express app code for running the API.
- `db`: this is a Postgres database that stores user data.
- `graphql-engine`: this is a Hasura engine that wraps the Postgres database created by Ferry. The engine exposes a GraphQL API for querying the data.
- `redis`: this is a Redis stack server that stores all user sessions from Express.
- `pgadmin`: this is a pgadmin instance that allows you to view the Postgres database managed by API. It is useful for debugging and DB manipulation.

Note that we have two databases: a database managed by API, which stores user data, and a database managed by Ferry, which stores course data. The latter is exposed as a GraphQL API by the Hasura engine, while the former is accessed directly by the Express app via Drizzle.

In `coursetable/api`, we only manage the `express` container. We do provide development versions of the `db`, `pgadmin`, `graphql-engine`, and `redis` containers, which should mirror the setup and table schema used in prod, but the actual prod configuration is located at [`coursetable/infra`](https://github.com/coursetable/infra/).

Here's the data flow for course data:

1. Ferry writes course data to [`ferry-data`](https://github.com/coursetable/ferry-data) in JSON.
2. Ferry then writes the data to a Postgres database on the prod server.
3. The prod database is regularly dumped into an endpoint. The dev `start.sh` script will pull data from this endpoint to populate the local Postgres database, if invoking `start.sh` with the `--ferry_seed` (`-f`) flag.
4. During development and prod, we spin up a Hasura engine that wraps the Postgres database and exposes a GraphQL API.
   <details>
   <summary>Additional Details</summary>

   > For security purposes, the Hasura Engine is only exposed to the localhost loopback interface (`127.0.0.1`). Therefore, the production Hasura Engine cannot be directly accessed from the Internet.
   >
   > When modifying the development Hasura Engine through the console at `localhost:8085`, configuration changes are synced to a special schema in the Ferry database. To sync the changes to the production Hasura Engine, we only need to restart its container.

   </details>

5. The Express app queries the GraphQL API and generates static JSON again, located in the `api/static` folder. This data is only overwritten in dev by running `start.sh` with the `--overwrite` (`-o`) flag, or in prod by Ferry requesting the `/api/catalog/refresh` endpoint. The idea of this step is to aggressively cache the GQL responses so every frontend request doesn't have to hit the GQL API. It also powers the client-side course search.
6. The frontend requests the Express endpoint, which serves these JSON files.

And for user data:

1. In dev, we always create a new Postgres database; in prod, we use the existing one.
2. The API directly connects to this database using Drizzle.
3. The frontend requests the Express endpoint, which then makes DB calls.
4. If you want to make DB changes, you can do so directly from pgadmin.

Therefore, there are a few points to watch out for:

1. Any DB modification must also update `api/drizzle/schema.ts`. Please note that prod deployment must also be manual in this case. To sync DB modifications, run `npm run db:push` in `express` (in a separate terminal session):

   ```bash
   docker exec -it express "cd api && npm run db:push"
   ```

2. If you shut down the local containers and start them again, the DB is now empty. On the dev frontend, you need to log in again. If you don't want to go through the challenge process, you can visit http://localhost:8081 and modify the database. (The credentials can be found on Doppler; look for `PGADMIN_EMAIL`, `PGADMIN_PASSWORD`, and `DB_ROOT_PASSWORD`.)
