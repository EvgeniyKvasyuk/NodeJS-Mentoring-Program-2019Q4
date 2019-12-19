import express from 'express';
import users from './Users.js';
import { paramsValidator, validationErrorHandler } from './validation';
import { ERROR_CODES } from './constants';

const errorCodesToStatusCodesMap = {
  [ERROR_CODES.BAD_DATA]: 400,
  [ERROR_CODES.NOT_FOUND]: 404,
};

export const usersResource = express.Router();

usersResource
  .use((req, res, next) => {
    res.set({
      'Content-Type': 'application/json;charset=UTF-8',
    });
    next();
  })
  .get('/', (req, res) => {
    res.status(200).json(req.query.partOfLogin
      ? users.getAutoSuggestUsers(req.query.partOfLogin, req.query.limit)
      : users.get()
    );
  })
  .get('/:id', (req, res) => {
    const result = users.getById(req.params.id);
    if (result.success) {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result.user);
    } else {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result);
    }
  })
  .post('/', paramsValidator, (req, res) => {
    const result = users.add(req.body);
    if (result.success) {
      res.status(200).end();
    } else {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result);
    }
  })
  .put('/:id', paramsValidator, (req, res) => {
    const result = users.update(req.params.id, req.body);
    if (result.success) {
      res.status(200).end();
    } else {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result);
    }

  })
  .delete('/:id', (req, res) => {
    const result = users.delete(req.params.id, req.body);
    if (result.success) {
      res.status(200);
    } else {
      res.status(errorCodesToStatusCodesMap[result.code]).json(result);
    }
    res.end();
  })
  .use(validationErrorHandler);

