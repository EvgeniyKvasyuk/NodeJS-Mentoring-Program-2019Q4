// controller
import express from 'express';
import asyncHandler from 'express-async-handler';

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
    sendResponse(res, result, 'users', 'get');
  }))
  .get('/:id', asyncHandler(async (req, res) => {
    const result = await users.getById(req.params.id);
    sendResponse(res, result, 'users', 'getById');
  }))
  .post('/', paramsValidator, asyncHandler(async (req, res) => {
    const result = await users.add(req.body);
    sendResponse(res, result, 'users', 'add');
  }))
  .put('/:id', paramsValidator, asyncHandler(async (req, res) => {
    const result = await users.update(req.params.id, req.body);
    sendResponse(res, result, 'users', 'update');
  }))
  .delete('/:id', asyncHandler(async (req, res) => {
    const result = await users.delete(req.params.id, req.body);
    sendResponse(res, result, 'users', 'delete');
  }))
  .use(validationErrorHandler);

