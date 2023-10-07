FROM node:latest as build

WORKDIR /app
COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./
COPY src ./src

# Copy Prisma schema file
COPY prisma ./prisma

# Give permissions to Prisma schema file
RUN chmod 644 /app/prisma/schema.prisma
RUN bun install

# Set non-root user and adjust ownership
RUN chown node:node /app/prisma/schema.prisma
USER node

ENV NODE_ENV=production
CMD ["npm", "start"]
