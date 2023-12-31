FROM oven/bun:slim as base
WORKDIR /usr/src/app

FROM node:slim as runtime
WORKDIR /usr/src/app
RUN apt-get update -y && apt-get install -y openssl

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
# install openssl for prisma
RUN apt-get update -y && apt-get install -y openssl 
# install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb prisma/ /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# copy dependencies and source code into final image
FROM runtime AS final
RUN mkdir -p static/catalogs
COPY --from=install /temp/dev/node_modules node_modules
# copy src/ and prisma/ for production (doesn't impact volume live reload in dev)
COPY src/ prisma/ entry.sh package.json tsconfig.json ./
ENTRYPOINT ["./entry.sh"]
