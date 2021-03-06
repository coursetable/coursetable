import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import session from 'cookie-session';

import { PORT, SESSION_SECRET } from './config';

// import routes
import catalog from './catalog/catalog.routes.js';
import cas_auth from './auth/cas_auth.routes';

const app = express();

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

// We use the IIFE pattern so that we can use await.
(async () => {
  // Setup routes.
  app.get('/api/ping', (req, res) => {
    res.json('pong');
  });
  await catalog(app);
  await cas_auth(app);

  // Once routes have been created, start listening.
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
})();
