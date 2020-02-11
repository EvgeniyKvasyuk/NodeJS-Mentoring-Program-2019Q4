import Sequelize from 'sequelize';

import { sequelize } from '../../connect';

export const UserGroupModel = sequelize.define('userGroupRelations', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    defaultValue: Sequelize.SERIAL,
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  timestamps: false,
  modelName: 'userGroupRelations'
});
