import fs from 'node:fs';
import https from 'node:https';
import express from 'express';
import * as Sentry from '@sentry/node';
import RedisStore from 'connect-redis';
import cors from 'cors';
import session from 'express-session';
import { createProxyMiddleware } from 'http-proxy-middleware';
import passport from 'passport';
import { createClient } from 'redis';

// Import this at the top before any user modules
import './sentry-instrument.js';

import { passportConfig } from './auth/auth.handlers.js';
import casAuth from './auth/auth.routes.js';
import canny from './canny/canny.routes.js';
import catalog from './catalog/catalog.routes.js';
import { fetchCatalog } from './catalog/catalog.utils.js';
import challenge from './challenge/challenge.routes.js';
import {
  SECURE_PORT,
  INSECURE_PORT,
  SESSION_SECRET,
  CORS_OPTIONS,
  REDIS_HOST,
  NUM_SEASONS,
} from './config.js';
import friends from './friends/friends.routes.js';
import linkPreview from './link-preview/link-preview.routes.js';
import morgan from './logging/morgan.js';
import winston from './logging/winston.js';
import user from './user/user.routes.js';

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
    host: REDIS_HOST,
  },
});
// eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
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
    saveUninitialized: true,

    cookie: {
      // Cookie lifetime of one year.
      maxAge: 365 * 24 * 60 * 60 * 1000,

      secure: true,
    },
  }),
);

// Rate limit
// const authRateLimiter = rateLimit({
// windowMs: 15 * 60 * 1000, // 15 minutes
// max: 100, // Limit each IP to 100 requests per windowMs
// standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// message: 'Too many requests, please try again later',
// });

// Configuring passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.authenticate('session'));

// Add the authentication header to the request
// Proxy initial HTTP requests to Ferry
app.use(
  '/ferry',
  (req, res, next) => {
    const hasuraRole = req.isAuthenticated() ? 'student' : 'anonymous';
    // Important: all headers must be lowercase; otherwise it will not override
    // existing headers on the request.
    req.headers['x-hasura-role'] = hasuraRole;
    req.headers['x-hasura-admin-secret'] =
      process.env.HASURA_GRAPHQL_ADMIN_SECRET!;
    next();
  },
  createProxyMiddleware({
    target: 'http://graphql-engine:8080',
    pathRewrite: { '^/ferry/': '/' },
    xfwd: true,
  }),
);

// Enable request logging.
app.use(morgan);

// Has to go after Ferry because it consumes the request body stream
// and the http-proxy needs a stream to consume.
app.use(express.json());

// Activate catalog and CAS authentication
challenge(app);
catalog(app);
casAuth(app);
friends(app);
canny(app);
user(app);
linkPreview(app);

app.get('/api/ping', (req, res) => {
  res.json('pong');
});

// The error handler must be registered before
// any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction,
  ) => {
    winston.error(err);
    // TODO: maybe this is not necessary given the errorHandler above?
    res.status(500).json({ error: String(err) });
  },
);

winston.info('Finished updating static catalog');
// Once catalogs have been created, start listening.
app.listen(INSECURE_PORT, () => {
  winston.info(`Insecure API listening on port ${INSECURE_PORT}`);
});

// Serve dev with SSL.
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

// Generate the static catalog on start.
winston.info('Updating static catalog');
const overwriteCatalog = process.env.OVERWRITE_CATALOG === 'true';

void fetchCatalog(overwriteCatalog, NUM_SEASONS).catch((err: unknown) => {
  winston.error('Error updating static catalog');
  winston.error(err);
});
