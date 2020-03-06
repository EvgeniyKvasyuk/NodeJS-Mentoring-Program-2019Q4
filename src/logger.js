import { createLogger, transports, format } from 'winston';

import { BUSINESS_EXCEPTION_CODES } from './constants';

const systemErrorLogger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  level: 'warn',
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

export const log = (error) => {
  let level = 'error';
  let logData = { message: error.message, stack: error.stack };
  if (error.code) {
    logData = { message: error.message, method: error.method, service: error.service };
    if (BUSINESS_EXCEPTION_CODES[error.code]) {
      level = 'warn';
    }
  }
  systemErrorLogger.log(level, logData);
};
