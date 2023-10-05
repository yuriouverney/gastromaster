/* eslint-disable */
const winston = require('winston');

const { combine, timestamp, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack ? stack : message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    // new winston.transports.Http({ host: 'your-log-server.com', port: 9001 }), // example of a remote log transport
  ],
});

function errorHandler(err, req, res, next) {
  logger.error(`Error: ${err.message}`, { stack: err.stack, request: { url: req.url, method: req.method, headers: req.headers } });
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`Request Body: ${JSON.stringify(req.body)}`);
  }
  res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
}

module.exports = errorHandler;