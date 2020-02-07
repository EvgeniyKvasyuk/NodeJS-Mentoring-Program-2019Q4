import { sequelize } from '../connect';
import { CODES } from '../constants';

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

    this.users.sync();
    this.userGroup.sync();
    this.groups.sync();
  }

  async isExistByParams({ params, model = this.groups }) {
    return model.findOne({ where: params });
  }

  async isExistById({ id, params, model = this.groups }) {
    return model.findByPk(id, params);
  }

  async add({ name, permissions }) {
    try {
      if (await this.isExistByParams({ params: { name } })) {
        return { success: false, code: CODES.BAD_DATA, message: 'Name exists' };
      }
      await this.groups.create({ name, permissions });
      return { success: true, code: CODES.SUCCESS };
    } catch (e) {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }

  async update(id, { name, permissions }) {
    try {
      if (await this.isExistById({ id, model: this.groups })) {
        await this.groups.update({ name, permissions }, { where: { id } });
        return { success: true, code: CODES.SUCCESS };
      }
      return { success: false, code: CODES.NOT_FOUND, message: 'Group not found' };
    } catch {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }

  async delete(id) {
    let transaction;
    try {
      if (await this.isExistById({ id })) {
        transaction = await sequelize.transaction();
        await this.groups.destroy({ where: { id }, transaction });
        await this.userGroup.destroy({ where: { groupId: id }, transaction });
        await transaction.commit();
        return { success: true, code: CODES.SUCCESS };
      }
      return { success: false, code: CODES.NOT_FOUND, message: 'Groups not found' };
    } catch {
      if (transaction) {
        await transaction.rollback();
      }
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }

  async addUserToGroup({ userId, groupId }) {
    try {
      const user = await this.isExistById({ id: userId, model: this.users });
      const group = await this.isExistById({ id: groupId, model: this.groups });
      switch (true) {
        case (!!user && !!group): {
          if (await this.isExistByParams({ params: { userId, groupId }, model: this.userGroup })) {
            return { success: false, code: CODES.BAD_DATA, message: 'User is in group already' };
          }
          await this.userGroup.create({ userId, groupId });
          return { success: true, code: CODES.SUCCESS };
        }
        case (!!user && !group):
          return { success: false, code: CODES.NOT_FOUND, message: 'Group not found' };
        case (!!group && !user):
          return { success: false, code: CODES.NOT_FOUND, message: 'User not found' };
        default:
          return { success: false, code: CODES.NOT_FOUND, message: 'User and Group not found' };
      }
    } catch {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }

  async getById(id) {
    try {
      const group = await this.isExistById({
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
        return { success: true, code: CODES.SUCCESS, data: group };
      }
      return { success: false, code: CODES.NOT_FOUND, message: 'Group not found' };
    } catch {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
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
      return { success: true, code: CODES.SUCCESS, data: groups };
    } catch (e) {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }
}
