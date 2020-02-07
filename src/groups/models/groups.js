import Sequelize from 'sequelize';

import { sequelize } from '../../connect';

import { PERMISSIONS } from '../constants';

export const GroupsModel = sequelize.define('groups', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    defaultValue: Sequelize.SERIAL,
  },
  name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  permissions: {
    type: Sequelize.ARRAY(Sequelize.ENUM(Object.values(PERMISSIONS))),
    allowNull: true,
  },
}, {
  sequelize,
  timestamps: false,
  modelName: 'groups'
});
