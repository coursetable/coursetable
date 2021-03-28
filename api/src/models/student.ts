/**
 * @file User object type for authentication.
 */

import { Request } from 'express';

export interface User {
  netId: string;
  evals: boolean;
  profile?: any;
}
