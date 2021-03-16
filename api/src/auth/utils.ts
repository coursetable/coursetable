import express from 'express';

/**
 * Middleware to verify request headers
 *
 * @prop req - express request object
 * @prop res - express response object
 * @prop next - express next object
 */

export const verifyNetID = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // get authentication headers
  const netid = req.header('x-coursetable-netid'); // user's NetID
  const authd = req.header('x-coursetable-authd'); // if user is logged in

  // require NetID authentication
  if (authd !== 'true' || !netid) {
    return res.status(401).json({
      error: 'NOT_AUTHENTICATED',
    });
  }

  return next();
};
