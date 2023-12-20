import express from 'express';

import morgan from './logging/morgan';
import winston from './logging/winston';

import cookieSession from 'cookie-session';
import fs from 'fs';
import https from 'https';
import cors from 'cors';

import {
  SECURE_PORT,
  INSECURE_PORT,
  SESSION_SECRET,
  CORS_OPTIONS,
  STATIC_FILE_DIR,
} from './config';

import { createProxyMiddleware } from 'http-proxy-middleware';

// import routes
import catalog from './catalog/catalog.routes';
import { authWithEvals, passportConfig } from './auth/auth.handlers';
import casAuth from './auth/auth.routes';
import friends from './friends/friends.routes';
import canny from './canny/canny.routes';
import user from './user/user.routes';
import challenge from './challenge/challenge.routes';

import passport from 'passport';

import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://9360fd2ff7f24865b74e92602d0a1a30@o476134.ingest.sentry.io/5665141',

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
  cookieSession({
    secret: SESSION_SECRET,

    // Cookie lifetime of one year.
    maxAge: 365 * 24 * 60 * 60 * 1000,

    // We currently set this to false because our logout process involves
    // the client-side JS clearing all cookies.
    httpOnly: false,

    // Not enabling this yet since it could have unintended consequences.
    // Eventually we should enable this.
    // secure: true,
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

// We use the IIFE pattern so that we can use await.
(async () => {
  // Configuring passport
  passportConfig(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  // Restrict GraphQL access for authenticated Yale students only
  app.use('/ferry', authWithEvals);
  app.use('/ferry', (req, res, next) => {
    // Use read-only student role for all Hasura queries
    req.headers['X-Hasura-Role'] = 'student';
    return next();
  });
  app.use(
    '/ferry',
    createProxyMiddleware({
      target: 'http://graphql-engine:8080',
      pathRewrite: {
        '^/ferry/': '/', // remove base path
      },
      ws: true,
    }),
  );
  // Enable request logging.
  app.use(morgan);

  // figure out how to make this work with Ferry (has to go after Ferry currently)
  app.use(express.json());

  // Activate catalog and CAS authentication
  await challenge(app);
  await catalog(app);
  await casAuth(app);
  await friends(app);
  await canny(app);
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
    }),
  );

  // Setup routes.
  app.get('/api/ping', (req, res) => {
    res.json('pong');
  });

  // Once routes have been created, start listening.
  app.listen(INSECURE_PORT, () => {
    winston.info(`Insecure API listening on port ${INSECURE_PORT}`);
  });
})();
