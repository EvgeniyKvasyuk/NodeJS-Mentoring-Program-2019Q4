// controller
import express from 'express';

import { UsersModel } from '../users';
import { GroupsModel, UserGroupModel } from './models';
import { GroupsService } from './service';
import { codesToStatusCodesMap, DEFAULT_ERROR_STATUS, DEFAULT_ERROR_RESULT, CODES } from '../constants';

const groups = new GroupsService(GroupsModel, UsersModel, UserGroupModel);

export const groupsResource = express.Router();

const { SUCCESS } = CODES;

groupsResource
  .use((req, res, next) => {
    res.set({
      'Content-Type': 'application/json;charset=UTF-8',
    });
    next();
  })
  .get('/', async (req, res) => {
    try {
      const result = await groups.get();
      res.status(codesToStatusCodesMap[result?.code || SUCCESS]).json(result);
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RESULT);
    }
  })
  .get('/:id', async (req, res) => {
    try {
      const result = await groups.getById(req.params.id);
      res.status(codesToStatusCodesMap[result?.code || SUCCESS]).json(result);
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RESULT);
    }
  })
  .post('/', async (req, res) => {
    try {
      const result = await groups.add(req.body);
      res.status(codesToStatusCodesMap[result?.code || SUCCESS]).json(result);
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RESULT);
    }
  })
  .post('/addUserToGroup', async (req, res) => {
    try {
      const result = await groups.addUserToGroup(req.body);
      res.status(codesToStatusCodesMap[result?.code || SUCCESS]).json(result);
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RESULT);
    }
  })
  .put('/:id', async (req, res) => {
    try {
      const result = await groups.update(req.params.id, req.body);
      res.status(codesToStatusCodesMap[result?.code || SUCCESS]).json(result);
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RESULT);
    }
  })
  .delete('/:id', async (req, res) => {
    try {
      const result = await groups.delete(req.params.id, req.body);
      res.status(codesToStatusCodesMap[result?.code || SUCCESS]).json(result);
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RESULT);
    }
  });
