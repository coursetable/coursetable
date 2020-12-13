import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { PORT } from './config';

// import routes
import challenge from './challenge/challenge.routes.js';
import catalog from './catalog/catalog.routes.js';

const app = express();
// Enable url-encoding
app.use(bodyParser.urlencoded({ extended: true }));
// Enable request logging.
app.use(morgan('tiny'));

// We use the IIFE pattern so that we can use await.
(async () => {
  // Setup routes.
  app.get('/api/ping', (req, res) => {
    res.json('pong');
  });
  await challenge(app);
  await catalog(app);

  // Once routes have been created, start listening.
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
})();
