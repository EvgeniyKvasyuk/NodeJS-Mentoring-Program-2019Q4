export const CODES = {
  SUCCESS: 'SUCCESS',
  NOT_FOUND: 'NOT_FOUND',
  BAD_DATA: 'BAD_DATA',
  SOMETHING_WENT_WRONG: 'SOMETHING_WENT_WRONG',
  DEFAULT: 'SOMETHING_WENT_WRONG',
};
export const codesToStatusCodesMap = {
  [CODES.SUCCESS]: 200,
  [CODES.BAD_DATA]: 400,
  [CODES.NOT_FOUND]: 404,
  [CODES.SOMETHING_WENT_WRONG]: 500,
  [CODES.DEFAULT]: 500,
};

export const DEFAULT_ERROR_STATUS = codesToStatusCodesMap[CODES.DEFAULT];
export const SUCCESS_STATUS = codesToStatusCodesMap[CODES.SUCCESS];
export const DEFAULT_ERROR_RES = { success: false, code: CODES.DEFAULT, message: 'Something went wrong' };
