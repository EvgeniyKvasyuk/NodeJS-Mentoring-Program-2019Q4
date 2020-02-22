// controller
import express from 'express';
import asyncHandler from 'express-async-handler';

import { errorsHandler } from '../errorsHandler';
import { sendResponse } from '../utils';

import { UsersService } from './service';
import { UsersModel } from './model';
import { paramsValidator, validationErrorHandler } from './validation';

const users = new UsersService(UsersModel);

export const usersResource = express.Router();

usersResource
  .use((req, res, next) => {
    res.set({
      'Content-Type': 'application/json;charset=UTF-8',
    });
    next();
  })
  .get('/', asyncHandler(async (req, res) => {
    const result = await users.get(req.query);
    sendResponse(res, result);
  }))
  .get('/:id', asyncHandler(async (req, res) => {
    const result = await users.getById(req.params.id);
    sendResponse(res, result);
  }))
  .post('/', paramsValidator, asyncHandler(async (req, res) => {
    const result = await users.add(req.body);
    sendResponse(res, result);
  }))
  .put('/:id', paramsValidator, asyncHandler(async (req, res) => {
    const result = await users.update(req.params.id, req.body);
    sendResponse(res, result);
  }))
  .delete('/:id', asyncHandler(async (req, res) => {
    const result = await users.delete(req.params.id, req.body);
    sendResponse(res, result);
  }))
  .use(validationErrorHandler)
  .use(errorsHandler);

