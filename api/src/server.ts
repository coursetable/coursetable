import express from 'express';

import morgan from './logging/morgan';
import winston from './logging/winston';

import session from 'cookie-session';
import fs from 'fs';
import https from 'https';
import cors from 'cors';

import {
  SECURE_PORT,
  INSECURE_PORT,
  SESSION_SECRET,
  CORS_OPTIONS,
  PHP_URI,
  STATIC_FILE_DIR,
} from './config';

import { createProxyMiddleware } from 'http-proxy-middleware';

// import routes
import catalog from './catalog/catalog.routes';
import { authWithEvals, passportConfig } from './auth/auth.handlers';
import cas_auth from './auth/auth.routes';
import facebook from './facebook/facebook.routes';
import user from './user/user.routes';

import passport from 'passport';

import * as Sentry from '@sentry/node';

Sentry.init({
  dsn:
    'https://9360fd2ff7f24865b74e92602d0a1a30@o476134.ingest.sentry.io/5665141',

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// Initialize the app
const app = express();

// Enable Cross-Origin Resource Sharing
// (i.e. let the frontend call the API when it's on a different domain)
app.use(cors(CORS_OPTIONS));
// Enable request logging.
app.use(morgan);
// Enable url-encoding
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Trust the proxy.
// See https://expressjs.com/en/guide/behind-proxies.html.
app.set('trust proxy', true);

// Strip all headers matching X-COURSETABLE-* from incoming requests.
app.use((req, _, next) => {
  Object.keys(req.headers).forEach((header) => {
    if (header.startsWith('x-coursetable-')) {
      delete req.headers[header];
    }
  });

  next();
});

// Redirection routes for historical pages.
app.get('/Blog', (_, res) => {
  res.redirect('https://legacy.coursetable.com/Blog.html');
});
app.get('/recommendations.htm', (_, res) => {
  res.redirect('https://legacy.coursetable.com/recommendations.htm');
});

// Setup sessions.
app.use(
  session({
    secret: SESSION_SECRET,

    // Cookie lifetime of one year.
    maxAge: 365 * 24 * 60 * 60 * 1000,

    // We currently set this to false because our logout process involves
    // the client-side JS clearing all cookies.
    httpOnly: false,

    // Not enabling this yet since it could have unintended consequences.
    // Eventually we should enable this.
    // secure: true,
  })
);

// Serve with SSL.
https
  .createServer(
    {
      key: fs.readFileSync('./src/keys/server.key'),
      cert: fs.readFileSync('./src/keys/server.cert'),
    },
    app
  )
  .listen(SECURE_PORT, () => {
    winston.info(`Secure dev proxy listening on port ${SECURE_PORT}`);
  });

// We use the IIFE pattern so that we can use await.
(async () => {
  // Configuring passport
  passportConfig(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  // Activate catalog and CAS authentication
  await catalog(app);
  await cas_auth(app);
  await facebook(app);
  await user(app);

  // Mount static files route and require NetID authentication
  app.use(
    '/api/static',
    authWithEvals,
    express.static(STATIC_FILE_DIR, {
      cacheControl: true,
      maxAge: '1h',
      lastModified: true,
      etag: true,
    })
  );

  // Setup routes.
  app.get('/api/ping', (req, res) => {
    res.json('pong');
  });

  app.use(
    ['/legacy_api', '/index.php'],
    createProxyMiddleware({
      target: PHP_URI,
      pathRewrite: {
        '^/legacy_api': '/', // remove base path
      },
      xfwd: true,
    })
  );

  // Restrict GraphQL access for authenticated Yale students only
  app.use('/ferry', authWithEvals);
  app.use(
    '/ferry',
    createProxyMiddleware({
      target: 'http://graphql-engine:8080',
      pathRewrite: {
        '^/ferry': '/', // remove base path
      },
      ws: true,
    })
  );

  // Once routes have been created, start listening.
  app.listen(INSECURE_PORT, () => {
    winston.info(`Insecure API listening on port ${INSECURE_PORT}`);
  });
})();
