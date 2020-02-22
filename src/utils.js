import { codesToStatusCodesMap, DEFAULT_SUCCESS_STATUS } from './constants';

export const sendResponse = (response, result) => {
  if (result.success) {
    response.status(codesToStatusCodesMap[result?.code || DEFAULT_SUCCESS_STATUS]).json(result);
    return;
  }
  throw new Error();
};
