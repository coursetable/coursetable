FROM node:latest as build

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . ./

ARG REACT_APP_UMAMI_WEBSITE_ID
ENV REACT_APP_UMAMI_WEBSITE_ID=${REACT_APP_UMAMI_WEBSITE_ID}
ARG REACT_APP_POSTHOG_TOKEN
ENV REACT_APP_POSTHOG_TOKEN=${REACT_APP_POSTHOG_TOKEN}
RUN yarn run build

# production environment
FROM node

RUN npm install -g serve
WORKDIR /content
COPY --from=build /app/build /content
EXPOSE 5000
CMD ["serve", "-s"]

