// controller
import express from 'express';

import { UsersService } from './service';
import { UsersModel } from './model';
import { paramsValidator, validationErrorHandler } from './validation';
import { ERROR_CODES } from './constants';

const errorCodesToStatusCodesMap = {
  [ERROR_CODES.BAD_DATA]: 400,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.SOMETHING_WENT_WRONG]: 500,
};

const users = new UsersService(UsersModel);

export const usersResource = express.Router();

usersResource
  .use((req, res, next) => {
    res.set({
      'Content-Type': 'application/json;charset=UTF-8',
    });
    next();
  })
  .get('/', async (req, res) => {
    const result = await users.get(req.query);
    if (result.success) {
      res.status(200).json(result.users);
    } else {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result);
    }
  })
  .get('/:id', async (req, res) => {
    const result = await users.getById(req.params.id);
    if (result.success) {
      res.status(200).json(result.user);
    } else {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result);
    }
  })
  .post('/', paramsValidator, async (req, res) => {
    const result = await users.add(req.body);
    if (result.success) {
      res.status(200).end();
    } else {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result);
    }
  })
  .put('/:id', paramsValidator, async (req, res) => {
    const result = await users.update(req.params.id, req.body);
    if (result.success) {
      res.status(200).end();
    } else {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result);
    }

  })
  .delete('/:id', async (req, res) => {
    const result = await users.delete(req.params.id, req.body);
    if (result.success) {
      res.status(200);
    } else {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result);
    }
    res.end();
  })
  .use(validationErrorHandler);

