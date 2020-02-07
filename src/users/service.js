import { Op } from 'sequelize';

import { DEFAULT_LIMIT } from './constants';
import { CODES } from '../constants';

export class UsersService {
  constructor(usersModel) {
    this.users = usersModel;
    this.users.sync();
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
        return { success: false, code: CODES.BAD_DATA, message: 'Login exists' };
      }
      await this.users.create({ login, password, age });
      return { success: true, code: CODES.SUCCESS };
    } catch (e) {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }

  async update(id, { login, password, age }) {
    try {
      if (await this.isExistById(id)) {
        if (await this.isExistByLogin(login)) {
          return { success: false, code: CODES.BAD_DATA, message: 'Login exists' };
        }
        await this.users.update({ login, password, age }, { where: { id } });
        return { success: true, code: CODES.SUCCESS };
      }
      return { success: false, code: CODES.NOT_FOUND, message: 'User not found' };
    } catch {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }

  async delete(id) {
    try {
      if (await this.isExistById(id)) {
        await this.users.update({ isDeleted: true }, { where: { id } });
        return { success: true, code: CODES.SUCCESS };
      }
      return { success: false, code: CODES.NOT_FOUND, message: 'User not found' };
    } catch {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }

  async getById(id) {
    try {
      const user = await this.isExistById(id);
      if (user) {
        return { success: true, code: CODES.SUCCESS, data: user };
      }
      return { success: false, code: CODES.NOT_FOUND, message: 'User not found' };
    } catch {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }

  }

  async get({ partOfLogin, limit = DEFAULT_LIMIT }) {
    try {
      let users;
      // autosuggest by login
      if (partOfLogin) {
        users = await this.users.findAll({
          where: { login: { [Op.like]: `%${partOfLogin}` }, isDeleted: false },
          limit: limit < 0 ? DEFAULT_LIMIT : limit,
        });
      } else {
        // get all
        users = await this.users.findAll({ where: { isDeleted: false } });
      }
      return { success: true, code: CODES.SUCCESS, data: users };
    } catch {
      return { success: false, code: CODES.SOMETHING_WENT_WRONG, message: 'Something went wrong' };
    }
  }
}
