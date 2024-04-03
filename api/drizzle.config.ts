import type { Config } from 'drizzle-kit';

const die = (err: string) => {
  throw new Error(`env config missing: ${err}`);
};

const getEnv = (name: string) => process.env[name] ?? die(name);

export default {
  driver: 'mysql2',
  out: './drizzle',
  schema: './drizzle/schema.ts',
  dbCredentials: {
    uri: getEnv('MYSQL_URL'),
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
