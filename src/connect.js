import Sequelize from 'sequelize';
import dotenv from 'dotenv';

import { log } from './logger';

dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  port: process.env.DB_PORT,
  dialect: 'postgres',
});

sequelize.authenticate()
  .then(() => { console.log('DB successfully connected'); })
  .catch((error) => { log(error); });
