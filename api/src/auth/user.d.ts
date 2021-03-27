/**
 * @file User type declarations.
 */

import 'express';
import 'passport';
import { User as UserModel } from '../models/student';

export {};
declare global {
  namespace Express {
    type User = UserModel;
  }
}
