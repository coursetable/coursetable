/** PostgreSQL error code for unique_violation */
export const PG_UNIQUE_VIOLATION = '23505';

/**
 * Returns true if the error is a PostgreSQL error with the given code.
 * Handles both direct errors and wrapped errors (e.g. from async/await).
 */
export function hasPgCode(err: unknown, code: string): boolean {
  const e = err as { code?: string; cause?: { code?: string } };
  return e.code === code || e.cause?.code === code;
}
