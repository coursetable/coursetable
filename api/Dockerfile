FROM node:latest as build

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src ./src

RUN yarn install

ENV NODE_ENV=production
CMD ["yarn", "start"]
