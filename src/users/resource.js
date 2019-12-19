import express from 'express';
import users from './Users.js';
import { paramsValidator, validationErrorHandler } from './validation';

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
      res.status(200).json(result.user);
    } else {
      res.status(404).json(result);
    }
  })
  .post('/', paramsValidator, (req, res) => {
    const result = users.add(req.body);
    if (result.success) {
      res.status(200).end();
    } else {
      res.status(400).json(result);
    }
  })
  .put('/:id', paramsValidator, (req, res) => {
    const result = users.update(req.params.id, req.body);
    if (result.success) {
      res.status(200).end();
    } else {
      res.status(400).json(result);
    }

  })
  .delete('/:id', (req, res) => {
    const result = users.delete(req.params.id, req.body);
    if (result.success) {
      res.status(200);
    } else {
      res.status(400).json(result);
    }
    res.end();
  })
  .use(validationErrorHandler);

