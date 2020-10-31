import { refreshCatalog } from '../controllers/catalog.controllers.js';

export default (app) => {
  app.get('/api/catalog/refresh', refreshCatalog);
};
