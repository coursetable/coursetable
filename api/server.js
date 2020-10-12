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

/**
 * Generates and returns a user challenge.
 */
// app.get('/api/challenge/request', requestChallenge);

/**
 * Generates and returns a user challenge.
 */
// app.post('/api/challenge/verify', verifyChallenge);

challenge(app);

app.listen(PORT, () => {
  console.log(`Challenge API listening at http://localhost:${PORT}`);
});
