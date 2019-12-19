import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';

import { MIN_AGE, MAX_AGE, PASSWORD_PATTERN } from './constants';

const validator = createValidator({ passError: true });
const validationSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().pattern(PASSWORD_PATTERN).required(),
  age: Joi.number().min(MIN_AGE).max(MAX_AGE).required(),
});

export const paramsValidator = validator.body(validationSchema);

export const validationErrorHandler = (err, req, res, next) => {
  if (err?.error?.isJoi) {
    const message = err?.error?.details?.reduce((acc, current) => {
      acc[current.path[0]] = current.message;
      return acc;
    }, {});
    res.status(400);
    res.json(message);
  }
  next(err);
};
