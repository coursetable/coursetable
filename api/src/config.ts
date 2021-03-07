/**
 * @file Global server configurations
 */

const die = (err: string) => {
  throw new Error(`env config missing: ${err}`);
};

// If running in dev mode
export const isDev = process.env.NODE_ENV !== 'production';

// Networking
export const SECURE_PORT = process.env.SECURE_PORT || 4096;
export const INSECURE_PORT = process.env.INSECURE_PORT || 3001;

// Keys for SSL
export const KEY_PATH = process.env.KEY_PATH || 'server.key'
export const CERT_PATH = process.env.CERT_PATH || 'server.cert'

// MySQL config for students database
export const MYSQL_STUDENTS_CONFIG = {
  host: process.env.MYSQL_HOST || die('mysql host'),
  port: parseInt(process.env.MYSQL_PORT || die('mysql port'), 10),
  user: process.env.MYSQL_USER || die('mysql username'),
  password: process.env.MYSQL_PASSWORD || die('mysql password'),
  database: process.env.STUDENTS_DB || die('students db'),
};

// MySQL config for courses database (just worksheets)
export const MYSQL_COURSES_CONFIG = {
  host: process.env.MYSQL_HOST || die('mysql host'),
  port: parseInt(process.env.MYSQL_PORT || die('mysql port'), 10),
  user: process.env.MYSQL_USER || die('mysql username'),
  password: process.env.MYSQL_PASSWORD || die('mysql password'),
  database: process.env.COURSES_DB || die('courses db'),
};

// API key for interfacing with the yalies.io API
export const YALIES_API_KEY =
  process.env.YALIES_API_KEY || die('yalies api key');

// Ferry GraphQL endpoint
export const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || die('graphql endpoint');

// Legacy PHP URI
export const PHP_URI = 'http://nginx:8080';

// Frontend server endpoint (used for redirects)
export const FRONTEND_ENDPOINT = isDev
  ? 'http://localhost:3000'
  : process.env.FRONTEND_ENDPOINT;

// CORS options so frontend can interface with server
export const CORS_OPTIONS = {
  origin: FRONTEND_ENDPOINT,
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Secret for session cookie signing.
export const SESSION_SECRET =
  process.env.SESSION_SECRET ?? die('session secret');

// Note that an existing but empty FERRY_SECRET is meaningful,
// as it enables us to bypass the header requirement in development.
export const FERRY_SECRET = process.env.FERRY_SECRET ?? die('ferry secret');

// Location of statically generated files. This is relative
// to the working directory, which is api.
export const STATIC_FILE_DIR = './static';
