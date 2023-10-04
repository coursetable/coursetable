import appRoot from 'app-root-path';
import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// get logging level from env variables
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// define logging colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// global format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
  // support object logging
  winston.format.splat(),
  winston.format.json(),
);

const transports = [
  new winston.transports.Console({
    // only colorize console logs
    format: winston.format.colorize({ all: true }),
  }),

  // error-only file logs
  new winston.transports.File({
    filename: `${appRoot}/src/logs/error.log`,
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    handleExceptions: true, // log unhandled exceptions
  }),

  // all logs
  new winston.transports.File({
    filename: `${appRoot}/src/logs/all.log`,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    handleExceptions: true, // log unhandled exceptions
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;
