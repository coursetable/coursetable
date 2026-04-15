import { defineConfig } from 'drizzle-kit';

const die = (err: string) => {
  throw new Error(`env config missing: ${err}`);
};

const getEnv = (name: string) => process.env[name] ?? die(name);

const config = {
  dialect: 'postgresql' as const,
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dbCredentials: {
    url: getEnv('DB_URL'),
  },
};

export default defineConfig(config);
