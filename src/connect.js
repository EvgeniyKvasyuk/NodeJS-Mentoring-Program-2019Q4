import Sequelize from 'sequelize';
import { log } from './logger';

export const sequelize = new Sequelize('node_js_mp_2019_q4', 'postgres', 'postgres', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});

sequelize.sync()
  .then(() => { console.log('DB successfully connected'); })
  .catch((error) => { log(error); });
