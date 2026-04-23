import type express from 'express';
import asyncHandler from 'express-async-handler';

import { getWorksheetDemand } from './demand.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.get('/api/demand/worksheet', authBasic, asyncHandler(getWorksheetDemand));
};
