# Remember: the context for this build is the root of the monorepo,
# not the api folder

# TODO: we only use bun as a dependency manager, but api is still executed with
# node. We should eventually get rid of node
FROM oven/bun:slim as base
WORKDIR /usr/src/app

FROM node:slim as runtime
WORKDIR /usr/src/app
RUN apt-get update -y && apt-get install -y openssl

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
# Install openssl for prisma
RUN apt-get update -y && apt-get install -y openssl
RUN mkdir -p /temp/dev/api
COPY package.json bun.lockb /temp/dev/
COPY api/package.json /temp/dev/api/package.json
COPY frontend/package.json /temp/dev/frontend/package.json
RUN cd /temp/dev && bun install --frozen-lockfile

# Copy dependencies and source code into final image
FROM runtime AS final
RUN mkdir -p api/static/catalogs
COPY --from=install /temp/dev/node_modules node_modules
COPY api api
COPY tsconfig.json .
ENTRYPOINT ["./api/entry.sh"]
