import type express from 'express';
import asyncHandler from 'express-async-handler';

import { lookupCourseNote, saveCourseNote } from './notes.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.post('/api/notes/lookup', authBasic, asyncHandler(lookupCourseNote));
  app.post('/api/notes/save', authBasic, asyncHandler(saveCourseNote));
};
