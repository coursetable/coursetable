import type { Config } from 'drizzle-kit';

const die = (err: string) => {
  throw new Error(`env config missing: ${err}`);
};

const getEnv = (name: string) => process.env[name] ?? die(name);

export default {
  schema: './drizzle/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: getEnv('DB_URL'),
  },
} satisfies Config;
