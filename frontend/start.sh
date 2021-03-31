export REACT_APP_UMAMI_WEBSITE_ID='603e532b-7def-4cf0-ab2c-031157aa7966'
export REACT_APP_POSTHOG_TOKEN='nothing'
export NODE_ENV='development'

doppler setup -p coursetable -c dev

doppler run yarn
doppler run --command "HTTPS=true yarn start"