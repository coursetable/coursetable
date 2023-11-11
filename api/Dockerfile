FROM oven/bun:slim as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
# install openssl for prisma
RUN apt-get update -y && apt-get install -y openssl 
# install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# copy dependencies and source code into intermediate prisma generation image into temp directory
# this will cache them and speed up future builds
FROM node:slim AS prisma_gen
RUN mkdir -p /temp/dev
COPY --from=install /temp/dev/node_modules /temp/dev/node_modules
COPY package.json prisma/ /temp/dev/
RUN cd /temp/dev && npm run generate

# copy dependencies and source code into final image
FROM base AS final
RUN mkdir -p static/catalogs
COPY --from=prisma_gen /temp/dev/node_modules node_modules
# copy src/ for production (doesn't impact volume live reload in dev)
COPY src/ package.json .
# hot reloading is ok in prod
ENTRYPOINT ["bun", "start"]
