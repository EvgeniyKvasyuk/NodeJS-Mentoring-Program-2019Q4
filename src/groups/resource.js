// controller
import express from 'express';

import { UsersModel } from '../users';
import { GroupsModel, UserGroupModel } from './models';
import { GroupsService } from './service';
import { errorCodesToStatusCodesMap, DEFAULT_ERROR_STATUS, DEFAULT_ERROR_RES } from '../constants';

const groups = new GroupsService(GroupsModel, UsersModel, UserGroupModel);

export const groupsResource = express.Router();

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
      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }
  })
  .get('/:id', async (req, res) => {
    try {
      const result = await groups.getById(req.params.id);
      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }
  })
  .post('/', async (req, res) => {
    try {
      const result = await groups.add(req.body);
      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result?.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }
  })
  .post('/addUserToGroup', async (req, res) => {
    try {
      const result = await groups.addUserToGroup(req.body);

      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result?.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }
  })
  .put('/:id', async (req, res) => {
    try {
      const result = await groups.update(req.params.id, req.body);

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
      const result = await groups.delete(req.params.id, req.body);
      if (result?.success) {
        res.status(200).json(result);
      } else {
        res.status(errorCodesToStatusCodesMap[result?.code]).json(result);
      }
    } catch {
      res.status(DEFAULT_ERROR_STATUS).json(DEFAULT_ERROR_RES);
    }

  });
