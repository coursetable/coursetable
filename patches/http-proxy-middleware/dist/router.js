Object.defineProperty(exports, '__esModule', { value: true });
exports.getTarget = void 0;
const isPlainObj = require('is-plain-obj');
const logger_1 = require('./logger');

const logger = (0, logger_1.getInstance)();
async function getTarget(req, config) {
  let newTarget;
  const { router } = config;
  if (isPlainObj(router)) newTarget = getTargetFromProxyTable(req, router);
  else if (typeof router === 'function') newTarget = await router(req);

  return newTarget;
}
exports.getTarget = getTarget;
function getTargetFromProxyTable(req, table) {
  let result;
  const { host } = req.headers;
  const path = req.url;
  const hostAndPath = host + path;
  for (const [key] of Object.entries(table)) {
    if (containsPath(key)) {
      if (hostAndPath.indexOf(key) > -1) {
        // Match 'localhost:3000/api'
        result = table[key];
        logger.debug('[HPM] Router table match: "%s"', key);
        break;
      }
    } else if (key === host) {
      // Match 'localhost:3000'
      result = table[key];
      logger.debug('[HPM] Router table match: "%s"', host);
      break;
    }
  }
  return result;
}
function containsPath(v) {
  return v.indexOf('/') > -1;
}
