import type express from 'express';

import { postEvents } from './events.handlers.js';

export default (app: express.Express): void => {
  app.post('/api/events', postEvents);
};
