# Maintenance

## New Season (Courses)

This section outlines the process for retrieving a new season's course data. Follow the steps below to ensure a smooth update:

1. Update [`ferry`](https://github.com/coursetable/ferry)

   Modify [`ferry/config/release_fetch.yml`](https://github.com/coursetable/ferry/blob/master/config/release_fetch.yml) file - add the new season details and/or remove old seasons.

1. Run `ferry` Locally

   Follow the steps in [`ferry/.github/workflows/ferry.yml`](https://github.com/coursetable/ferry/blob/master/.github/workflows/ferry.yml) as a template. It may be optimal to run this locally first to manually resolve any errors that may occur.

1. [Run DB Snapshot Workflow](https://github.com/coursetable/infra/actions/workflows/ferry_db_snapshot.yml)

   Trigger the database snapshot workflow in the [`infra`](https://github.com/coursetable/infra) repo to back up the current course db.

1. Start API

   Run `./start.sh -f` in the `api` directory to fetch the latest snapshot with the new season's course data.

1. Generate Frontend Code

   Run `doppler setup -p coursetable -c dev && doppler run --command "bun codegen"` in the `frontend` directory to regenerate the frontend code. See [`graphql.md`](./graphql.md) for further details.

1. Update `frontend/src/config.ts`

   In general, you should modify `CUR_SEASON`, `CUR_YEAR`, and `academicCalendars`. See [this PR](https://github.com/coursetable/coursetable/pull/1811/files#diff-fa2c9e63d85b91989ec85c89b8143cfc9c5cf949ec4fee597c7923d4c57c1727) for an example.
