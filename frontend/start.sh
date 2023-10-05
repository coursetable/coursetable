export VITE_POSTHOG_TOKEN='nothing'
export NODE_ENV='development'

doppler setup -p coursetable -c dev

doppler run bun
doppler run --command "HTTPS=true yarn start"