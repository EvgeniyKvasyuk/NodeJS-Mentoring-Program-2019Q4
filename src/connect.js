import Sequelize from 'sequelize';

export const sequelize = new Sequelize('node_js_mp_2019_q4', 'postgres', 'postgres', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});
