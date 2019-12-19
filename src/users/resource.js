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
    res.status(200);
    res.json(req.query.substr
      ? users.getAutoSuggestUsers(req.query.substr, req.query.limit)
      : users.get()
    );
  })
  .get('/:id', (req, res) => {
    const user = users.getById(req.params.id);
    if (user) {
      res.status(200);
      res.json(user);
    } else {
      res.status(404);
      res.end();
    }
  })
  .post('/', paramsValidator, (req, res) => {
    users.add(req.body);
    res.status(200);
    res.end();
  })
  .put('/:id', paramsValidator, (req, res) => {
    if (users.update(req.params.id, req.body)) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.end();
  })
  .delete('/:id', (req, res) => {
    if (users.delete(req.params.id, req.body)) {
      res.status(200);
    } else {
      res.status(404);
    }
    res.end();
  })
  .use(validationErrorHandler);

