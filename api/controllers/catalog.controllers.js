import { GRAPHQL_ENDPOINT, FERRY_SECRET } from '../config/constants.js';

import { fetchCatalog } from '../utils.js';

/**
 * Middleware to verify request headers
 *
 * @prop req - express request object
 * @prop res - express response object
 * @prop next - express next object
 */
export const verifyHeaders = (req, res, next) => {
  // get authentication headers
  const authd = req.header('x-ferry-secret'); // if user is logged in

  // require NetID authentication
  if (authd !== FERRY_SECRET) {
    return res.status(401).json({
      error: 'NOT_AUTHENTICATED',
    });
  }

  next();
};

/**
 * Endpoint to refresh static catalog JSONs
 *
 * @prop req - express request object
 * @prop res - express response object
 * @prop next - express next object
 */
export const refreshCatalog = async (req, res, next) => {
  await fetchCatalog();

  return res.status(200).json({
    status: 'OK',
  });
};
