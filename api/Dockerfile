ARG HOT_RELOAD

FROM node:latest as build_hr_false
RUN curl -fsSL https://bun.sh/install | bash
WORKDIR /app
ONBUILD COPY src ./src

FROM node:latest as build_hr_true
RUN curl -fsSL https://bun.sh/install | bash
WORKDIR /app

FROM build_hr_${HOT_RELOAD}

COPY package.json bun.lockb tsconfig.json ./
RUN mkdir -p static/catalogs

# Copy Prisma schema file
COPY prisma ./prisma

# Give permissions to Prisma schema file
RUN chmod 644 /app/prisma/schema.prisma

RUN ~/.bun/bin/bun install

# Set non-root user and adjust ownership
# RUN chown -R node:node /app/node_modules/@prisma /app/node_modules/prisma /app/static/ /app/prisma/schema.prisma
# USER node

ENTRYPOINT ["npm", "start"]
