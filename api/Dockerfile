# Remember: the context for this build is the root of the monorepo,
# not the api folder

# We need Node to run prisma generate. See https://github.com/oven-sh/bun/issues/3827
# TODO: switch to oven/bun-node:slim
FROM imbios/bun-node:latest-current-slim as base
WORKDIR /usr/src/app
# Install openssl for prisma
RUN apt-get update -y && apt-get install -y openssl

FROM base as install

RUN mkdir -p /temp/dev/api /temp/dev/frontend
COPY package.json bun.lockb /temp/dev/
COPY api/package.json /temp/dev/api/package.json
COPY frontend/package.json /temp/dev/frontend/package.json
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base as release

RUN mkdir -p api/static/catalogs
COPY --from=install /temp/dev/node_modules node_modules
# Avoid copying static folder / anything else unneeded
COPY api/src/ ./api/src/
COPY api/prisma/ ./api/prisma/
COPY api/entry.sh api/package.json api/tsconfig.json ./api/
COPY tsconfig.json ./

ENTRYPOINT ["./api/entry.sh"]
