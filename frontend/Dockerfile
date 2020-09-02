FROM node:latest as build

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn run build

# production environment
FROM node

RUN npm install -g serve
WORKDIR content
COPY --from=build /app/build /content
EXPOSE 5000
CMD ["serve", "-s"]

