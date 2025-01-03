import { drizzle } from 'drizzle-orm/postgres-js';
import { GraphQLClient } from 'graphql-request';
import postgres from 'postgres';
import { createClient } from 'redis';
import * as schema from '../drizzle/schema.js';

function getEnv(name: string, type?: 'string'): string;
function getEnv<const K extends string[]>(name: string, type: K): K[number];
function getEnv(name: string, type: 'boolean'): boolean;
function getEnv(
  name: string,
  type: 'boolean' | 'string' | string[] = 'string',
): string | boolean {
  const val = process.env[name];
  if (val === undefined) throw new Error(`env config missing: ${name}`);
  if (type === 'boolean') {
    switch (val) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        throw new Error(`env config ${name} must be a boolean, got '${val}'`);
    }
  }
  if (type === 'string') return val;
  if (Array.isArray(type)) {
    if (!type.includes(val)) {
      throw new Error(
        `env config ${name} must be one of: ${type.join(', ')}, got '${val}'`,
      );
    }
    return val;
  }
  return val;
}

// Read all env vars and validate them. No other code should read process.env
// directly. You can make sure that this corresponds 1:1 with the env passed
// from the docker compose files.
export const API_PORT = getEnv('API_PORT');
export const CANNY_KEY = getEnv('CANNY_KEY');
export const CHALLENGE_PASSWORD = getEnv('CHALLENGE_PASSWORD');

const pool = postgres(getEnv('DB_URL'));
export const db = drizzle(pool, { schema });

export const FERRY_RELOAD_SECRET = getEnv('FERRY_RELOAD_SECRET');
// Frontend server endpoint (used for redirects)
export const FRONTEND_ENDPOINT = getEnv('FRONTEND_ENDPOINT');
const GRAPHQL_ENDPOINT = getEnv('GRAPHQL_ENDPOINT');
export const HASURA_GRAPHQL_ADMIN_SECRET = getEnv(
  'HASURA_GRAPHQL_ADMIN_SECRET',
);

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
  },
});

const NODE_ENV = getEnv('NODE_ENV', ['development', 'production']);
export const isDev = NODE_ENV !== 'production';

export const OVERWRITE_CATALOG = getEnv('OVERWRITE_CATALOG', 'boolean');
export const redisClient = createClient({
  socket: {
    host: getEnv('REDIS_HOST'),
  },
});

export const SENTRY_DSN = getEnv('SENTRY_DSN');
export const SENTRY_ENVIRONMENT = getEnv('SENTRY_ENVIRONMENT');
// Secret for session cookie signing.
export const SESSION_SECRET = getEnv('SESSION_SECRET');
// API key for interfacing with the yalies.io API
export const YALIES_API_KEY = getEnv('YALIES_API_KEY');

export const NUM_CHALLENGE_COURSES = 3; // Number of courses to select for the challenge
// Season to select the challenge from. Note that OCE removes old seasons so
// you need to keep this new.
export const CHALLENGE_SEASON = '202303';
export const MAX_CHALLENGE_REQUESTS = 100; // Maximum number of allowed challenge tries

// Location of statically generated files. This is relative
// to the working directory, which is api.
export const STATIC_FILE_DIR = './static';
export const SITEMAP_DIR = `${STATIC_FILE_DIR}/sitemaps`;
// Latest number of seasons to refresh the static files for
export const NUM_SEASONS = isDev ? 0 : 4;

export const COURSETABLE_ORIGINS = [
  FRONTEND_ENDPOINT,
  'https://coursetable.com',
  'https://www.coursetable.com',
  /^https:\/\/.+\.coursetable\.com$/u,
  /^https:\/\/.+-preview\.coursetable\.pages\.dev$/u,
];
