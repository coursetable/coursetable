import type express from 'express';
import asyncHandler from 'express-async-handler';

import {
  dispatchCourseAlerts,
  getCourseAlertStatus,
  listCourseAlerts,
  subscribeCourseAlert,
  unsubscribeCourseAlert,
} from './courseAlerts.handlers.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.get(
    '/api/courseAlerts/status',
    authBasic,
    asyncHandler(getCourseAlertStatus),
  );
  app.get('/api/courseAlerts', authBasic, asyncHandler(listCourseAlerts));
  app.post(
    '/api/courseAlerts/subscribe',
    authBasic,
    asyncHandler(subscribeCourseAlert),
  );
  app.post(
    '/api/courseAlerts/unsubscribe',
    authBasic,
    asyncHandler(unsubscribeCourseAlert),
  );
  app.post('/api/courseAlerts/dispatch', asyncHandler(dispatchCourseAlerts));
};
