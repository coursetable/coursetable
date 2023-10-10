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

RUN curl -fsSL https://bun.sh/install | bash
RUN ~/.bun/bin/bun install

RUN mkdir -p static/catalogs

# Set non-root user and adjust ownership
# RUN chown -R node:node /app/node_modules/@prisma /app/node_modules/prisma /app/static/ /app/prisma/schema.prisma
# USER node

ENTRYPOINT ["npm", "start"]
