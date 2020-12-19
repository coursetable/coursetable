export {};

import 'express';
import 'passport';
import { User as UserModel } from '../models/student';

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}
