import {
  verifyHeaders,
  refreshCatalog,
} from '../controllers/catalog.controllers.js';

export default (app) => {
  app.get('/api/catalog/refresh', verifyHeaders, refreshCatalog);
};
