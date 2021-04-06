/**
 * @file User object type for authentication.
 */

export interface User {
  netId: string;
  evals: boolean;
  profile?: unknown;
  email?: string;
  firstName?: string;
  lastName?: string;
}
