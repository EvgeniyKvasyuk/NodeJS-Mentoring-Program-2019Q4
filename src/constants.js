export const ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  BAD_DATA: 'BAD_DATA',
  SOMETHING_WENT_WRONG: 'SOMETHING_WENT_WRONG',
  DEFAULT: 'SOMETHING_WENT_WRONG',
};
export const errorCodesToStatusCodesMap = {
  [ERROR_CODES.BAD_DATA]: 400,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.SOMETHING_WENT_WRONG]: 500,
  [ERROR_CODES.DEFAULT]: 500,
};

export const DEFAULT_ERROR_STATUS = errorCodesToStatusCodesMap[ERROR_CODES.DEFAULT];
export const DEFAULT_ERROR_RES = { success: false, code: ERROR_CODES.DEFAULT, message: 'Something went wrong' };
