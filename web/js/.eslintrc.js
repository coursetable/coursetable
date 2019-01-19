const config = require('../eslintrc.es6');
config.globals = {
  window: true,
  document: true,
  location: true,

  // Included in BluebookPerUser.tpl
  EJS: true,
  FB: true,

  // Injected in BluebookPerUser.tpl
  courseIndices: true,
  jsonForSeason: true,
  facebookDataRetrieved: true,
  facebookNeedsUpdate: true,
  showNotice: true,
};

module.exports = config;
