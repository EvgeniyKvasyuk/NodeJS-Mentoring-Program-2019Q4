import Sequelize from 'sequelize';

import { sequelize } from '../connect';

export const UsersModel = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    defaultValue: Sequelize.SERIAL,
  },
  login: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'users'
});
