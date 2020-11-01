import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import axios from 'axios';
import path from 'path';

import { PORT, FERRY_SECRET } from './config/constants.js';

// import routes
import challenge from './routes/challenge.routes.js';
import catalog from './routes/catalog.routes.js';

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

app.use('/api/static', express.static(path.join(path.resolve(), 'static')));

console.log('Updating static catalog');
fetchCatalog().then(() => {
  app.listen(PORT, () => {
    console.log(`Express API listening at http://localhost:${PORT}`);
  });
});
