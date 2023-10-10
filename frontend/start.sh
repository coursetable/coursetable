export NODE_ENV='development'

doppler setup -p coursetable -c dev

doppler run bun install
doppler run --command "HTTPS=true npm start"
