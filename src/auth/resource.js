// controller
import express from 'express';
import asyncHandler from 'express-async-handler';

import { UsersModel } from '../users';
import { sendResponse } from '../utils';
import { AuthService } from './service';

export const authResource = express.Router();
const auth = new AuthService(UsersModel);

authResource
  .use((req, res, next) => {
    res.set({
      'Content-Type': 'application/json;charset=UTF-8',
    });
    next();
  })
  .post('/', asyncHandler(async (request, response) => {
    const result = await auth.login({ login: request.body.login, password: request.body.password });
    sendResponse(response, result, 'auth', 'login');
  }));
