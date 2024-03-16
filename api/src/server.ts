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
  REDIS_HOST,
} from './config.js';
import morgan from './logging/morgan.js';
import winston from './logging/winston.js';

// Import routes
import catalog from './catalog/catalog.routes.js';
import { authWithEvals, passportConfig } from './auth/auth.handlers.js';
import casAuth from './auth/auth.routes.js';
import friends from './friends/friends.routes.js';
import canny from './canny/canny.routes.js';
import user from './user/user.routes.js';
import challenge from './challenge/challenge.routes.js';

import { fetchCatalog } from './catalog/catalog.utils.js';

const app = express();

Sentry.init({
  dsn: 'https://0ceb92b3c55a418131f3fcf02eabf00d@o476134.ingest.us.sentry.io/4506913066975232',
  integrations: [
    // Enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // Enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

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
    req.headers['X-Hasura-Role'] = hasuraRole;
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

// Evals data require NetID authentication
app.use(
  '/api/static/catalogs/evals',
  authWithEvals,
  express.static(`${STATIC_FILE_DIR}/catalogs/evals`, {
    cacheControl: true,
    maxAge: '1h',
    lastModified: true,
    etag: true,
  }),
);

// Serve public catalog files without authentication
app.use(
  '/api/static',
  express.static(STATIC_FILE_DIR, {
    cacheControl: true,
    maxAge: '1h',
    lastModified: true,
    etag: true,
  }),
);

app.get('/api/ping', (req, res) => {
  res.json('pong');
});

// The error handler must be registered before
// any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

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
    Sentry.captureException(err, { user: req.user });
    res.status(500).json({ error: String(err) });
  },
);

// Once routes have been created, start listening.
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
void fetchCatalog(overwriteCatalog);
