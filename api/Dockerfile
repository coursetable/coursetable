ARG HOT_RELOAD

FROM node:latest as build_hr_false
WORKDIR /app
ONBUILD COPY src ./src

FROM node:latest as build_hr_true
WORKDIR /app
ONBUILD RUN echo "Hot reload is enabled"

FROM build_hr_${HOT_RELOAD}

COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./

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
