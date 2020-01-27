import { Op } from 'sequelize';

import { DEFAULT_LIMIT, ERROR_CODES } from './constants';

export class UsersService {
  constructor(usersModel) {
    this.users = usersModel;
  }

  async isExistByLogin(login) {
    return this.users.findOne({ where: { login } });
  }

  async isExistById(id) {
    return this.users.findByPk(id);
  }

  async add({ login, password, age }) {
    try {
      if (await this.isExistByLogin(login)) {
        return { success: false, code: ERROR_CODES.BAD_DATA, message: 'Login exists' };
      }
      await this.users.create({ login, password, age });
      return { success: true };
    } catch (e) {
      return { success: false, code: ERROR_CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }

  async update(id, { login, password, age }) {
    if (this.isExistById(id)) {
      try {
        if (await this.isExistByLogin(login)) {
          return { success: false, code: ERROR_CODES.BAD_DATA, message: 'Login exists' };
        }
        await this.users.update({ login, password, age }, { where: { id } });
        return { success: true };
      } catch {
        return { success: false, code: ERROR_CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
      }
    }
    return { success: false, code: ERROR_CODES.NOT_FOUND, message: 'User not found' };
  }

  async delete(id) {
    if (await this.isExistById(id)) {
      try {
        await this.users.update({ isDeleted: true }, { where: { id } });
        return { success: true };
      } catch {
        return { success: false, code: ERROR_CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
      }
    }
    return { success: false, code: ERROR_CODES.NOT_FOUND, message: 'User not found' };
  }

  async getById(id) {
    const user = await this.isExistById(id);
    if (await this.isExistById(id)) {
      return { success: true, user };
    }

    return { success: false, code: ERROR_CODES.NOT_FOUND, message: 'User not found' };
  }

  async get({ partOfLogin, limit = DEFAULT_LIMIT }) {
    try {
      let users;
      if (partOfLogin) {
        limit = limit < 0 ? DEFAULT_LIMIT : limit;
        users = await this.users.findAll({
          where: { login: { [Op.like]: `%${partOfLogin}` }, isDeleted: false },
          limit,
        });
      } else {
        users = await this.users.findAll({ where: { isDeleted: false } });
      }
      return { success: true, users };
    } catch {
      return { success: false, code: ERROR_CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }
}
