import { PrismaClient } from '@prisma/client';

const die = (err: string) => {
  throw new Error(`env config missing: ${err}`);
};

const getEnv = (name: string) => process.env[name] ?? die(name);

// If running in dev mode
export const isDev = process.env.NODE_ENV !== 'production';

// Networking
export const SECURE_PORT = getEnv('SECURE_PORT');
export const INSECURE_PORT = getEnv('INSECURE_PORT');

// API key for interfacing with the yalies.io API
export const YALIES_API_KEY = getEnv('YALIES_API_KEY');

// Ferry GraphQL endpoint
export const GRAPHQL_ENDPOINT = getEnv('GRAPHQL_ENDPOINT');

export const CHALLENGE_ALGORITHM = 'aes-256-ctr';
export const CHALLENGE_PASSWORD = getEnv('CHALLENGE_PASSWORD');

export const NUM_CHALLENGE_COURSES = 3; // Number of courses to select for the challenge
export const CHALLENGE_SEASON = '202101'; // Season to select the challenge from
export const MAX_CHALLENGE_REQUESTS = 100; // Maximum number of allowed challenge tries

// Secret for Canny SSO
export const CANNY_KEY = getEnv('CANNY_KEY');

// TODO make sure the frontend port is synchronized with this;
// we should use the same script to start both frontend and backend
const port = process.env.FRONT_END_PORT ?? 3000;

// Frontend server endpoint (used for redirects)
export const FRONTEND_ENDPOINT = isDev
  ? `https://localhost:${port}`
  : process.env.FRONTEND_ENDPOINT ?? 'https://coursetable.com';

// CORS options so frontend can interface with server
export const CORS_OPTIONS = {
  origin: [
    `https://localhost:${port}`,
    `https://localhost:${port}`,
    'https://coursetable.com',
    'https://www.coursetable.com',
    /\.coursetable\.com$/u,
    /\.yaleapps\.com$/u,
    /\.vercel\.app$/u,
  ],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Secret for session cookie signing.
export const SESSION_SECRET = getEnv('SESSION_SECRET');

// Note that an existing but empty FERRY_SECRET is meaningful,
// as it enables us to bypass the header requirement in development.
export const { FERRY_SECRET } = process.env;

// Location of statically generated files. This is relative
// to the working directory, which is api.
export const STATIC_FILE_DIR = './static';

export const prisma = new PrismaClient();
