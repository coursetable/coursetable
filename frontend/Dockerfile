FROM node:latest as build

WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . ./

# Declare args required for React build.
ARG REACT_APP_UMAMI_WEBSITE_ID
ARG REACT_APP_POSTHOG_TOKEN
ARG REACT_APP_SENTRY_RELEASE

# Verify args are provided.
# Via https://stackoverflow.com/a/42144033/5004662.
RUN test -n "${REACT_APP_UMAMI_WEBSITE_ID}"
RUN test -n "${REACT_APP_POSTHOG_TOKEN}"
RUN test -n "${REACT_APP_SENTRY_RELEASE}"

# Build with variables present.
RUN REACT_APP_UMAMI_WEBSITE_ID=${REACT_APP_UMAMI_WEBSITE_ID} \
    REACT_APP_POSTHOG_TOKEN=${REACT_APP_POSTHOG_TOKEN}       \
    REACT_APP_SENTRY_RELEASE=${REACT_APP_SENTRY_RELEASE}     \
    yarn run build

# production environment
FROM node

RUN npm install -g serve
WORKDIR /content
COPY --from=build /app/build /content
EXPOSE 5000
CMD ["serve", "-s"]

