import { createLogger, transports, format } from 'winston';

import { BUSINESS_EXCEPTION_CODES } from './constants';

const systemErrorLogger = createLogger({
  level: 'error',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: './logs/systemErrors.log', level: 'error' }),
  ]
});

const businessExceptionsLogger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: './logs/businessExceptions.log', level: 'info' }),
  ]
});

export const log = (error) => {
  let logger = systemErrorLogger;
  let logData = { message: error.message, stack: error.stack };
  let level = 'error';
  if (error.code) {
    logData = { message: error.message, method: error.method, service: error.service };
    if (BUSINESS_EXCEPTION_CODES[error.code]) {
      logger = businessExceptionsLogger;
      level = 'info';
    }
  }
  logger.log(level, logData);
};
