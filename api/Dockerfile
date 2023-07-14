FROM node:latest as build

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src ./src

# Copy Prisma schema file
COPY prisma ./prisma


# Change the ownership of all files to the `node` user
RUN chown -R node:node /app

# Change to `node` user
USER node

# Give permissions to Prisma schema file
RUN chmod 644 /app/prisma/schema.prisma

RUN yarn install

ENV NODE_ENV=production
CMD ["yarn", "start"]
