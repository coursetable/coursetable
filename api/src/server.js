import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'cookie-session';
import fs from 'fs';
import https from 'https';
import cors from 'cors';

import { PORT, INSECURE_PORT, SESSION_SECRET, CORS_OPTIONS } from './config';

const { createProxyMiddleware } = require('http-proxy-middleware');

// import routes
import catalog from './catalog/catalog.routes.js';
import cas_auth, { casCheck, evalsCheck } from './auth/cas_auth.routes';

const app = express();

app.use(cors(CORS_OPTIONS));

// Redirection routes for historical pages.
app.get('/Blog', (_, res) => {
  res.redirect('https://legacy.coursetable.com/Blog.html');
});
app.get('/recommendations.htm', (_, res) => {
  res.redirect('https://legacy.coursetable.com/recommendations.htm');
});

// Enable url-encoding
app.use(bodyParser.urlencoded({ extended: true }));
// Enable request logging.
app.use(morgan('tiny'));
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

// Trust the proxy.
// See https://expressjs.com/en/guide/behind-proxies.html.
app.set('trust proxy', true);

// restrict GraphQL access for authenticated Yale students only
app.use('/ferry', casCheck, evalsCheck);
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

// Serve with SSL.
https
  .createServer(
    {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert'),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Secure dev proxy listening on port ${PORT}`);
  });

// We use the IIFE pattern so that we can use await.
(async () => {
  // Setup routes.
  app.get('/api/ping', (req, res) => {
    res.json('pong');
  });
  await catalog(app);
  await cas_auth(app);

  // Once routes have been created, start listening.
  app.listen(INSECURE_PORT, () => {
    console.log(`Insecure API listening on port ${INSECURE_PORT}`);
  });
})();
