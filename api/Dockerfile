# Remember: the context for this build is the root of the monorepo,
# not the api folder

FROM oven/bun:1.2.20-slim AS base
WORKDIR /usr/src/app

FROM node:24-slim AS runtime
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev/api /temp/dev/frontend
COPY package.json bun.lock /temp/dev/
COPY api/package.json /temp/dev/api/
COPY frontend/package.json /temp/dev/frontend/package.json
RUN cd /temp/dev && bun install --frozen-lockfile

FROM runtime AS release
RUN mkdir -p api/static/catalogs
COPY --from=install /temp/dev/node_modules node_modules
# Avoid copying static folder / anything else unneeded
COPY api/src/ ./api/src/
COPY api/drizzle/ ./api/drizzle/
COPY api/entry.sh api/package.json api/tsconfig.json api/drizzle.config.ts api/graphql-codegen.ts ./api/
COPY tools/ ./tools/
COPY tsconfig.json .prettierrc.json ./

ENTRYPOINT ["./api/entry.sh"]
