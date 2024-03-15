import path from 'path';
import winston from 'winston';
import { isDev } from '../config';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define logging colors
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
  // Support object logging
  winston.format.splat(),
  winston.format.json(),
);

const transports = [
  new winston.transports.Console({
    // Only colorize console logs
    format: winston.format.colorize({ all: true }),
  }),

  // Error-only file logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    handleExceptions: true, // Log unhandled exceptions
  }),

  // All logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/all.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    handleExceptions: true, // Log unhandled exceptions
  }),
];

const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  levels,
  format,
  transports,
});

export default logger;
