FROM node:latest as build

WORKDIR /app

# Copying needed files
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
COPY start.sh ./

# Adjust permissions
USER root
RUN chmod +x start.sh

# Switch back to the node user
USER node

# Install dependencies
RUN yarn install

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["sh", "start.sh"]
