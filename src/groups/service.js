import { sequelize } from '../connect';
import { CODES, DEFAULT_SUCCESS_RESULT } from '../constants';
import { CustomError } from '../customError';

export class GroupsService {
  constructor(groupsModel, usersModel, userGroupModel) {
    this.users = usersModel;
    this.groups = groupsModel;
    this.userGroup = userGroupModel;

    this.groups.belongsToMany(this.users, {
      through: 'userGroupRelations',
      foreignKey: 'groupId',
      otherKey: 'userId',
      as: 'users',
    });

    this.users.belongsToMany(this.groups, {
      through: 'userGroupRelations',
      foreignKey: 'userId',
      otherKey: 'groupId',
      as: 'groups',
    });
  }

  async existsByParams({ params, model = this.groups }) {
    return model.findOne({ where: params });
  }

  async existsById({ id, params, model = this.groups }) {
    return model.findByPk(id, params);
  }

  async add({ name, permissions }) {
    try {
      if (await this.existsByParams({ params: { name } })) {
        throw new CustomError({ code: CODES.BAD_DATA, message: 'Name exists', service: 'groups', method: 'add' });
      }
      const createdGroup = await this.groups.create({ name, permissions });
      return { DEFAULT_SUCCESS_RESULT, data: createdGroup };
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'groups', method: 'add' });
    }
  }

  async update(id, { name, permissions }) {
    try {
      if (await this.existsById({ id, model: this.groups })) {
        await this.groups.update({ name, permissions }, { where: { id } });
        return DEFAULT_SUCCESS_RESULT;
      }
      throw new CustomError({ code: CODES.NOT_FOUND, message: 'Group not found', service: 'groups', method: 'update' });
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'groups', method: 'update' });
    }
  }

  async delete(id) {
    let transaction;
    try {
      if (await this.existsById({ id })) {
        transaction = await sequelize.transaction();
        try {
          await this.groups.destroy({ where: { id }, transaction });
          await this.userGroup.destroy({ where: { groupId: id }, transaction });
          await transaction.commit();
          return DEFAULT_SUCCESS_RESULT;
        } catch (error) {
          await transaction.rollback();
          throw new CustomError({ message: error.message, service: 'groups', method: 'delete' });
        }
      }
      throw new CustomError({ code: CODES.NOT_FOUND, message: 'Groups not found', service: 'groups', method: 'delete' });
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'groups', method: 'delete' });
    }
  }

  async addUserToGroup({ userId, groupId }) {
    try {
      const user = await this.existsById({ id: userId, model: this.users });
      const group = await this.existsById({ id: groupId, model: this.groups });
      switch (true) {
        case (!!user && !!group): {
          if (await this.existsByParams({ params: { userId, groupId }, model: this.userGroup })) {
            throw new CustomError({ code: CODES.BAD_DATA, message: 'User is in group already', service: 'groups', method: 'addUserToGroup' });
          }
          await this.userGroup.create({ userId, groupId });
          return DEFAULT_SUCCESS_RESULT;
        }
        case (!!user && !group):
          throw new CustomError({ code: CODES.NOT_FOUND, message: 'Group not found', service: 'groups', method: 'addUserToGroup' });
        case (!!group && !user):
          throw new CustomError({ code: CODES.NOT_FOUND, message: 'User not found', service: 'groups', method: 'addUserToGroup' });
        default:
          throw new CustomError({ code: CODES.NOT_FOUND, message: 'User and Group not found', service: 'groups', method: 'addUserToGroup' });
      }
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'groups', method: 'addUserToGroup' });
    }
  }

  async getById(id) {
    try {
      const group = await this.existsById({
        id,
        params: {
          include: [{
            model: this.users,
            as: 'users',
            required: false,
            attributes: ['login', 'age', 'id'],
          }],
        }
      });

      if (group) {
        return { ...DEFAULT_SUCCESS_RESULT, data: group };
      }

      throw new CustomError({ code: CODES.NOT_FOUND, message: 'Group not found', service: 'groups', method: 'getById' });
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'groups', method: 'getById' });
    }
  }

  async get() {
    try {
      const groups = await this.groups.findAll({
        include: [{
          model: this.users,
          as: 'users',
          required: false,
          attributes: ['login', 'age', 'id'],
          through: { attributes: [] }
        }],
      });
      return { ...DEFAULT_SUCCESS_RESULT, data: groups };
    } catch (error) {
      throw new CustomError({ message: error.message, service: 'users', method: 'get' });
    }
  }
}
