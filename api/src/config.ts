/**
 * @file Global server configurations
 */
import PostHog from 'posthog-node';
import { PrismaClient } from '@prisma/client';

const die = (err: string) => {
  throw new Error(`env config missing: ${err}`);
};

const getEnv = (name: string) => {
  return process.env[name] || die(name);
};

// If running in dev mode
export const isDev = process.env.NODE_ENV !== 'production';

// Networking
export const SECURE_PORT = getEnv('SECURE_PORT');
export const INSECURE_PORT = getEnv('INSECURE_PORT');

// Facebook Graph API endpoint
export const FACEBOOK_API_ENDPOINT = getEnv('FACEBOOK_API_ENDPOINT');

// API key for interfacing with the yalies.io API
export const YALIES_API_KEY = getEnv('YALIES_API_KEY');

// Ferry GraphQL endpoint
export const GRAPHQL_ENDPOINT = getEnv('GRAPHQL_ENDPOINT');

export const CHALLENGE_ALGORITHM = 'aes-256-ctr';
export const CHALLENGE_PASSWORD =
  process.env.CHALLENGE_PASSWORD || die('challenge password');

export const NUM_CHALLENGE_COURSES = 3; // number of courses to select for the challenge
export const CHALLENGE_SEASON = '201903'; // season to select the challenge from
export const MAX_CHALLENGE_REQUESTS = 100; // maximum number of allowed challenge tries

// Secret for Canny SSO
export const CANNY_KEY = getEnv('CANNY_KEY');

// Frontend server endpoint (used for redirects)
export const FRONTEND_ENDPOINT = isDev
  ? 'https://localhost:3000'
  : process.env.FRONTEND_ENDPOINT || 'https://coursetable.com';

// CORS options so frontend can interface with server
export const CORS_OPTIONS = {
  origin: [
    'https://localhost:3000',
    'https://coursetable.com',
    'https://www.coursetable.com',
    /\.coursetable\.com$/,
    /\.vercel\.app$/,
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Secret for session cookie signing.
export const SESSION_SECRET = getEnv('SESSION_SECRET');

// Note that an existing but empty FERRY_SECRET is meaningful,
// as it enables us to bypass the header requirement in development.
export const { FERRY_SECRET } = process.env;

// Location of statically generated files. This is relative
// to the working directory, which is api.
export const STATIC_FILE_DIR = './static';

export const POSTHOG_CLIENT = new PostHog(getEnv('POSTHOG_API_KEY'), {
  host: getEnv('POSTHOG_HOST'),
});

export const prisma = new PrismaClient();
