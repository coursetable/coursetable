const die = (err: string) => {
  throw new Error(`env config missing: ${err}`);
};

export const PORT = 4096;
export const INSECURE_PORT = process.env.PORT || 3001;

export const MYSQL_STUDENTS_CONFIG = {
  host: process.env.MYSQL_HOST || die('mysql host'),
  port: parseInt(process.env.MYSQL_PORT || die('mysql port'), 10),
  user: process.env.MYSQL_USER || die('mysql username'),
  password: process.env.MYSQL_PASSWORD || die('mysql password'),
  database: process.env.STUDENTS_DB || die('students db'),
};

export const MYSQL_COURSES_CONFIG = {
  host: process.env.MYSQL_HOST || die('mysql host'),
  port: parseInt(process.env.MYSQL_PORT || die('mysql port'), 10),
  user: process.env.MYSQL_USER || die('mysql username'),
  password: process.env.MYSQL_PASSWORD || die('mysql password'),
  database: process.env.COURSES_DB || die('courses db'),
};

export const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT || die('graphql endpoint');

const PHP_URI = 'http://nginx:8080';

export const CORS_OPTIONS = {
  origin: [
    'http://localhost:3000',
    'https://coursetable.com',
    'https://beta.coursetable.com',
    'https://alpha.coursetable.com',
  ],
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
