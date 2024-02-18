import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import passport from 'passport';
import * as Sentry from '@sentry/node';

import {
  SECURE_PORT,
  INSECURE_PORT,
  SESSION_SECRET,
  CORS_OPTIONS,
  STATIC_FILE_DIR,
} from './config';
import morgan from './logging/morgan';
import winston from './logging/winston';

// Import routes
import catalog from './catalog/catalog.routes';
import { authWithEvals, passportConfig } from './auth/auth.handlers';
import casAuth from './auth/auth.routes';
import friends from './friends/friends.routes';
import canny from './canny/canny.routes';
import user from './user/user.routes';
import challenge from './challenge/challenge.routes';

import { fetchCatalog } from './catalog/catalog.utils';

Sentry.init({
  dsn: 'https://9360fd2ff7f24865b74e92602d0a1a30@o476134.ingest.sentry.io/5665141',

  environment: process.env.NODE_ENV,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// Initialize the app
const app = express();
// Trust the proxy.
// See https://expressjs.com/en/guide/behind-proxies.html.
app.set('trust proxy', true);
// Enable url-encoding
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing
// (i.e. let the frontend call the API when it's on a different domain)
app.use(cors(CORS_OPTIONS));

// Strip all headers matching X-COURSETABLE-* from incoming requests.
app.use((req, _, next) => {
  Object.keys(req.headers).forEach((header) => {
    if (header.startsWith('x-coursetable-')) delete req.headers[header];
  });

  next();
});

// Setup session management.

// Initialize Redis client.
const redisClient = createClient({
  socket: {
    host: 'redis',
  },
});
redisClient.connect().catch(winston.error);

// Initialize Redis session store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:',
  ttl: 365 * 24 * 60 * 60, // 1 year
});

app.use(
  session({
    secret: SESSION_SECRET,

    // Recommended by the connect-redis documentation.
    store: redisStore,
    resave: false,
    saveUninitialized: false,

    cookie: {
      // Cookie lifetime of one year.
      maxAge: 365 * 24 * 60 * 60 * 1000,

      // We currently set this to false because our logout process involves
      // the client-side JS clearing all cookies.
      httpOnly: false,

      // Not enabling this yet since it could have unintended consequences.
      // Eventually we should enable this.
      // secure: true,
    },
  }),
);

// Serve with SSL.
https
  .createServer(
    {
      key: fs.readFileSync('./src/keys/server.key'),
      cert: fs.readFileSync('./src/keys/server.cert'),
    },
    app,
  )
  .listen(SECURE_PORT, () => {
    winston.info(`Secure dev proxy listening on port ${SECURE_PORT}`);
  });

// Configuring passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  '/ferry',
  // Restrict GraphQL access for authenticated Yale students only
  authWithEvals,
  (req, res, next) => {
    // Use read-only student role for all Hasura queries
    req.headers['X-Hasura-Role'] = 'student';
    next();
  },
  createProxyMiddleware({
    target: 'http://graphql-engine:8080',
    pathRewrite: {
      '^/ferry/': '/', // Remove base path
    },
    ws: true,
  }),
);
// Enable request logging.
app.use(morgan);

// Figure out how to make this work with Ferry (has to go after Ferry
// currently)
app.use(express.json());

// Activate catalog and CAS authentication
challenge(app);
catalog(app);
casAuth(app);
friends(app);
canny(app);
user(app);

// Mount static files route and require NetID authentication
app.use(
  '/api/static',
  authWithEvals,
  express.static(STATIC_FILE_DIR, {
    cacheControl: true,
    maxAge: '1h',
    lastModified: true,
    etag: true,
  }),
);

// Setup routes.
app.get('/api/ping', (req, res) => {
  res.json('pong');
});

app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction,
  ) => {
    winston.error(err);
    Sentry.captureException(err, { user: req.user });
    res.status(500).json({ error: String(err) });
  },
);

// Once routes have been created, start listening.
app.listen(INSECURE_PORT, () => {
  winston.info(`Insecure API listening on port ${INSECURE_PORT}`);
});

// Generate the static catalog on start.
winston.info('Updating static catalog');
const overwriteCatalog = process.env.OVERWRITE_CATALOG === 'true';
void fetchCatalog(overwriteCatalog);
