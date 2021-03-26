/**
 * @file Global server configurations
 */

const { PrismaClient } = require('@prisma/client');

const die = (err: string) => {
  throw new Error(`env config missing: ${err}`);
};

const getEnv = (name: string) => {
  return process.env[name] || die(name);
};

// If running in dev mode
export const isDev = process.env.NODE_ENV !== 'production';

// Networking
export const SECURE_PORT = process.env.SECURE_PORT || 3001;
export const INSECURE_PORT = process.env.INSECURE_PORT || 4096;

// Keys for SSL
export const KEY_PATH = getEnv('KEY_PATH');
export const CERT_PATH = getEnv('CERT_PATH');

// Facebook Graph API endpoint
export const FACEBOOK_API_ENDPOINT = getEnv('FACEBOOK_API_ENDPOINT');

// MySQL config for students database
export const MYSQL_STUDENTS_CONFIG = {
  host: getEnv('MYSQL_HOST'),
  port: parseInt(getEnv('MYSQL_PORT'), 10),
  user: getEnv('MYSQL_USER'),
  password: getEnv('MYSQL_PASSWORD'),
  database: getEnv('STUDENTS_DB'),
};

// MySQL config for courses database (just worksheets)
export const MYSQL_COURSES_CONFIG = {
  host: getEnv('MYSQL_HOST'),
  port: parseInt(getEnv('MYSQL_PORT'), 10),
  user: getEnv('MYSQL_USER'),
  password: getEnv('MYSQL_PASSWORD'),
  database: getEnv('COURSES_DB'),
};

const studentDatabase = new PrismaClient({
  datasources: {
    db: {
      url: `mysql://${getEnv('MYSQL_HOST')}:${getEnv(
        'MYSQL_PASSWORD'
      )}@${getEnv('MYSQL_HOST')}:${getEnv('MYSQL_PORT')}/${getEnv(
        'STUDENTS_DB'
      )}`,
    },
  },
});

// const coursesDatabase = new PrismaClient({
//   datasources: {
//     db: {
//       url: `mysql://${getEnv('MYSQL_HOST')}:${getEnv(
//         'MYSQL_PASSWORD'
//       )}@${getEnv('MYSQL_HOST')}:${getEnv('MYSQL_PORT')}/${getEnv(
//         'COURSES_DB'
//       )}`,
//     },
//   },
// });

// API key for interfacing with the yalies.io API
export const YALIES_API_KEY = getEnv('YALIES_API_KEY');

// Ferry GraphQL endpoint
export const GRAPHQL_ENDPOINT = getEnv('GRAPHQL_ENDPOINT');

// Legacy PHP URI
export const PHP_URI = 'http://nginx:8080';

// Frontend server endpoint (used for redirects)
export const FRONTEND_ENDPOINT = isDev
  ? 'https://localhost:3000'
  : process.env.FRONTEND_ENDPOINT;

// CORS options so frontend can interface with server
export const CORS_OPTIONS = {
  origin: FRONTEND_ENDPOINT,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Secret for session cookie signing.
export const SESSION_SECRET = getEnv('SESSION_SECRET');

// Note that an existing but empty FERRY_SECRET is meaningful,
// as it enables us to bypass the header requirement in development.
export const FERRY_SECRET = process.env['FERRY_SECRET'];

// Location of statically generated files. This is relative
// to the working directory, which is api.
export const STATIC_FILE_DIR = './static';
