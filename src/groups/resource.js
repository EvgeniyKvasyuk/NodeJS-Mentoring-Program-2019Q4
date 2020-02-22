// controller
import express from 'express';
import asyncHandler from 'express-async-handler';

import { sendResponse } from '../utils';
import { errorsHandler } from '../errorsHandler';

import { UsersModel } from '../users';
import { GroupsModel, UserGroupModel } from './models';
import { GroupsService } from './service';

const groups = new GroupsService(GroupsModel, UsersModel, UserGroupModel);

export const groupsResource = express.Router();

groupsResource
  .use((req, res, next) => {
    res.set({
      'Content-Type': 'application/json;charset=UTF-8',
    });
    next();
  })
  .get('/', asyncHandler(async (req, res) => {
    const result = await groups.get();
    sendResponse(res, result);
  }))
  .get('/:id', asyncHandler(async (req, res) => {
    const result = await groups.getById(req.params.id);
    sendResponse(res, result);
  }))
  .post('/', asyncHandler(async (req, res) => {
    const result = await groups.add(req.body);
    sendResponse(res, result);
  }))
  .post('/addUserToGroup', asyncHandler(async (req, res) => {
    const result = await groups.addUserToGroup(req.body);
    sendResponse(res, result);
  }))
  .put('/:id', asyncHandler(async (req, res) => {
    const result = await groups.update(req.params.id, req.body);
    sendResponse(res, result);
  }))
  .delete('/:id', asyncHandler(async (req, res) => {
    const result = await groups.delete(req.params.id, req.body);
    sendResponse(res, result);
  }))
  .use(errorsHandler);
