import { verifyHeaders, refreshCatalog } from './catalog.controllers.js';

export default (app) => {
  app.get('/api/catalog/refresh', verifyHeaders, refreshCatalog);
};
