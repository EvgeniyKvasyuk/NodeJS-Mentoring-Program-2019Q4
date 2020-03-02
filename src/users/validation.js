import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';

import { log } from '../logger';
import { CODES } from '../constants';

import { MIN_AGE, MAX_AGE, PASSWORD_PATTERN } from './constants';

const validator = createValidator({ passError: true });
const validationSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().pattern(PASSWORD_PATTERN).required(),
  age: Joi.number().min(MIN_AGE).max(MAX_AGE).required(),
});

export const paramsValidator = validator.body(validationSchema);

export const validationErrorHandler = (err, req, res, next) => {
  console.log('sdsdsdsd');
  if (err?.error?.isJoi) {
    const message = err?.error?.details?.reduce((acc, current) => {
      acc[current.path[0]] = current.message;
      return acc;
    }, {});
    log({ message: JSON.stringify(message), code: CODES.BAD_DATA });
    res
      .status(400)
      .json(message);
  } else {
    console.log('ушел в следующий мидлвар');
    next(err);
  }
};
