export {};

import 'express';

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface User {
      netId: string;
    }
  }
}
