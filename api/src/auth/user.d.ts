/**
 * @file User type declarations.
 */


import 'express';
import 'passport';
import { User as UserModel } from '../models/student';

export { };
declare global {
  namespace Express {
    interface User extends UserModel { }
  }
}
