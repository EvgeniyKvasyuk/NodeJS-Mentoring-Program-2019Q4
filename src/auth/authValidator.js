import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import util from 'util';

import { CustomError } from '../customError';
import { CODES, SECRET } from '../constants';

export const authValidator = asyncHandler(async (request, response, next) => {
  const authToken = request.headers.auth_token;
  const verify = util.promisify(jwt.verify);

  if (!authToken) {
    throw new CustomError({ code: CODES.UNAUTHORIZED_ERROR, message: 'No auth token' });
  }

  try {
    await verify(authToken, SECRET);
  } catch {
    throw new CustomError({ code: CODES.INCORRECT_TOKEN, message: 'Incorrect token' });
  }

  next();
});
