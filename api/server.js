import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { PORT } from './config/constants.js';

// import routes
import challenge from './routes/challenge.routes.js';

const app = express();
// Enable url-encoding
app.use(bodyParser.urlencoded({ extended: true }));
// Enable request logging.
app.use(morgan('tiny'));

// apply routes
challenge(app);

app.listen(PORT, () => {
  console.log(`Challenge API listening at http://localhost:${PORT}`);
});
