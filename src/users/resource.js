// controller
import express from 'express';

import { UsersService } from './service';
import { UsersModel } from './model';
import { paramsValidator, validationErrorHandler } from './validation';
import { DEFAULT_ERROR_STATUS, errorCodesToStatusCodesMap, DEFAULT_ERROR_RES } from '../constants';

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
    try {
      const result = await users.get(req.query);
      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result?.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }
  })
  .get('/:id', async (req, res) => {
    try {
      const result = await users.getById(req.params.id);
      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result?.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }
  })
  .post('/', paramsValidator, async (req, res) => {
    try {
      const result = await users.add(req.body);
      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result?.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }

  })
  .put('/:id', paramsValidator, async (req, res) => {
    try {
      const result = await users.update(req.params.id, req.body);
      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result?.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }
  })
  .delete('/:id', async (req, res) => {
    try {
      const result = await users.delete(req.params.id, req.body);
      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result?.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }
  })
  .use(validationErrorHandler);

