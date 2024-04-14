import type express from 'express';
import asyncHandler from 'express-async-handler';

import { generateLinkPreview } from './link-preview.handlers.js';

export default (app: express.Express): void => {
  // This path is reachable via our Cloud Flare redirect rule. If you want to
  // support more social media bots, edit the UA matching rule on CF.
  app.get('/api/link-preview', asyncHandler(generateLinkPreview));
};
