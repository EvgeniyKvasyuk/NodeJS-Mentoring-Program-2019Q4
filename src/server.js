import express from 'express';
import { usersResource } from './users';

const PORT = process.env.PORT || 4000;
const server = express();

server.use(express.json()); // for parsing application/json
server.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

server.use('/users', usersResource);
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`); // eslint-disable-line no-console
});
