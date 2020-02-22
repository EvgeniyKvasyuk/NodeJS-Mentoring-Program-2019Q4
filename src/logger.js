import { createLogger, transports, format } from 'winston';

import { BUSINESS_EXCEPTION_CODES } from './constants';

const systemErrorLogger = createLogger({
  level: 'error',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.simple(),
      ) }),
    new transports.File({ filename: './logs/systemErrors.log' }),
  ]
});

const businessExceptionsLogger = createLogger({
  level: 'error',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.simple(),
      ) }),
    new transports.File({ filename: './logs/businessExceptions.log' }),
  ]
});

export const log = (error) => {
  let logger = systemErrorLogger;
  let logData = { message: error.message, stack: error.stack };
  if (error.code) {
    logData = { message: error.message, method: error.method, service: error.service };
    if (BUSINESS_EXCEPTION_CODES[error.code]) {
      logger = businessExceptionsLogger;
    }
  }
  logger.error(logData);
};
