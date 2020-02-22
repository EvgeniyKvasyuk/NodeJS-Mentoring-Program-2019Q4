import { codesToStatusCodesMap, DEFAULT_ERROR_STATUS, CODES } from './constants';
import { log } from './logger';

const DEFAULT_MESSAGE = 'Something went wrong';

export const errorsHandler = (error, request, res, next) => {
  log(error);
  res
    .status(codesToStatusCodesMap[error.code || DEFAULT_ERROR_STATUS])
    .json({
      success: false, message: error.message || DEFAULT_MESSAGE, code: error.code || CODES.SOMETHING_WENT_WRONG
    });
  next(error);
};
