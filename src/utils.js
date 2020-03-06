import { CustomError } from './customError';
import { codesToStatusCodesMap, DEFAULT_SUCCESS_STATUS } from './constants';

export const sendResponse = (response, result, service, method) => {
  if (result.success) {
    response.status(codesToStatusCodesMap[result?.code || DEFAULT_SUCCESS_STATUS]).json(result);
  } else {
    throw new CustomError({ message: 'error.message', service, method });
  }
};
