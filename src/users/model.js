import Sequelize from 'sequelize';

import { sequelize } from '../connect';

export const UsersModel = sequelize.define('users', {
  // attributes
  login: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
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
