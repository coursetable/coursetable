import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';

import { PORT } from './config/constants.js';

// import routes
import challenge from './routes/challenge.routes.js';
import catalog from './routes/catalog.routes.js';

import { verifyNetID } from './utils.js';

// import catalog fetch function (same as /api/catalog/refresh)
import { fetchCatalog } from './utils.js';

const app = express();
// Enable url-encoding
app.use(bodyParser.urlencoded({ extended: true }));
// Enable request logging.
app.use(morgan('tiny'));

// apply routes
challenge(app);
catalog(app);

// Mount static files route and require NetID authentication
app.use(
  '/api/static',
  verifyNetID,
  express.static(path.join(path.resolve(), './static'), {
    cacheControl: true,
    maxAge: '1h',
    lastModified: true,
    etag: true,
  })
);

console.log('Updating static catalog');

const overwriteCatalog = process.env.OVERWRITE_CATALOG || false;

fetchCatalog(overwriteCatalog).then(() => {
  app.listen(PORT, () => {
    console.log(`Express API listening at http://localhost:${PORT}`);
  });
});
