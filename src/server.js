import express from 'express';
import cors from 'cors';

import { errorsHandler } from './errorsHandler';
import { usersResource } from './users';
import { groupsResource } from './groups';
import { authResource, authValidator } from './auth';

const PORT = process.env.PORT || 4000;
const server = express();

server.use(cors());
server.use(express.json()); // for parsing application/json
server.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

server.use('/login', authResource);
server.use(authValidator);
server.use('/users', usersResource);
server.use('/groups', groupsResource);
server.use(errorsHandler);
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // eslint-disable-line no-console
});

