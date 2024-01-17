import morgan, { type StreamOptions } from 'morgan';

import winston from './winston';
import { isDev } from '../config';

// Override the stream method by telling Morgan to use our custom logger instead
// of the console.log.
const stream: StreamOptions = {
  // Use the http severity
  write: (message) => winston.http(message),
};

// Skip all the Morgan HTTP log if the application is not running in
// development mode.

// This method is not really needed here - we already told to the logger that it
// should print only warning and error messages in production.
const skip = () => !isDev;

// Build the morgan middleware
const morganMiddleware = morgan(
  // Define message format string (this is the default one).
  // The message format is made from tokens, and each token is
  // defined inside the Morgan library.
  // You can create your custom token to show what do you want from a request.
  ':method :url :status :res[content-length] - :response-time ms',
  // Options: in this case, I overwrote the stream and the skip logic.
  // See the methods above.
  { stream, skip },
);

export default morganMiddleware;
