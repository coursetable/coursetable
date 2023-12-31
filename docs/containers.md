# Containers & DB

CourseTable uses the following Docker containers for core functionality, so they must be running for the app to work:

- `express`: this contains the Express app code for running the API.
- `mysql`: this is a MySQL database that stores user data.
- `graphql-engine`: this is a Hasura engine that wraps the Postgres database created by Ferry. Ferry dumps course data in it, and the engine exposes a GraphQL API for querying the data.
- `phpmyadmin`: this is a PHPMyAdmin instance that allows you to view the MySQL database managed by API. It is useful for debugging and DB manipulation.

Note that we have two databases: a MySQL database managed by API, which stores user data, and a Postgres database managed by Ferry, which stores course data. The latter is exposed as a GraphQL API by the Hasura engine. Therefore, you need to be connected to the Internet to even start CourseTable locally, because the GraphQL engine used in dev still communicates with the remote Postgres database.

In `coursetable/api`, we only manage the `express` and `graphql-engine` containers. We do provide development versions of the `mysql` and `phpmyadmin` containers, which should mirror the setup and table schema used in prod, but the actual prod configuration is located at [`coursetable/infra/mysql`](https://github.com/coursetable/infra/blob/main/mysql/docker-compose.yml).

Here's the data flow for course data:

1. Ferry writes course data to [`ferry-data`](https://github.com/coursetable/ferry-data) in JSON.
2. Ferry then writes the data to a Postgres database on the prod server.
3. The Postgres database exposes itself to the Internet.
4. During development and prod, we spin up a Hasura engine that wraps the Postgres database and exposes a GraphQL API.
5. The Express app queries the GraphQL API and generates static JSON again, located in the `api/static` folder. These are cached locally unless you run `./start.sh -d -o`.
6. The frontend requests the Express endpoint, which serves these JSON files.

And for user data:

1. In dev, we always create a new MySQL database; in prod, we use the existing one.
2. The API directly connects to this database using Prisma.
3. The frontend requests the Express endpoint, which then makes DB calls.
4. If you want to make DB changes, you can do so directly from PHPMyAdmin.

TODO: the course data workflow is overcomplicated. Get rid of Postgres and the entire "Ferry emits JSON" process. Maybe API can stop emitting plain JSON too (depends on whether the result can be cached), so that in the end it's Ferry writes to MySQL -> GraphQL wraps MySQL -> Frontend queries GraphQL.

Therefore, there are a few points to watch out for:

1. Any DB modification requires 3 changes:

   1. Updating `api/prisma/schema.prisma`
   2. Updating `api/mysql/database.sql`, which is used to create the DB in dev.
   3. Updating the prod DB, either by actually doing it in the prod docker, or through the PHPMyAdmin interface.

   TODO: you can see how it's obviously non-ideal. We should use Prisma to automatically generate initial DB and also migrate the prod DB.

2. If you shut down the local containers and start them again, the DB is now empty. On the dev frontend, you need to log in again. If you don't want to go through the challenge process, you can visit http://localhost:8081 and modify the database. (The login password is `MYSQL_ROOT_PASSWORD` which can be found on Doppler.)
