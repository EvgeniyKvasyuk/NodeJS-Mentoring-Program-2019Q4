import { Op } from 'sequelize';

import { CustomError } from '../customeError';
import { CODES, DEFAULT_SUCCESS_RESULT } from '../constants';

import { DEFAULT_LIMIT } from './constants';

export class UsersService {
  constructor(usersModel) {
    this.users = usersModel;
    this.users.sync();
  }

  async existsByLogin(login) {
    return this.users.findOne({ where: { login } });
  }

  async existsById(id) {
    return this.users.findByPk(id);
  }

  async add({ login, password, age }) {
    try {
      if (await this.existsByLogin(login)) {
        throw new CustomError({ code: CODES.BAD_DATA, message: 'Login exists', service: 'users', method: 'add' });
      }
      const createdUser = await this.users.create({ login, password, age });
      return {
        ...DEFAULT_SUCCESS_RESULT,
        data: { id: createdUser.id, login: createdUser.login, age: createdUser.age }
      };
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'users', method: 'add' });
    }
  }

  async update(id, { login, password, age }) {
    try {
      if (await this.existsById(id)) {
        if (await this.existsByLogin(login)) {
          throw new CustomError({ code: CODES.BAD_DATA, message: 'Login exists', service: 'users', method: 'update' });
        }
        await this.users.update({ login, password, age }, { where: { id } });
        return DEFAULT_SUCCESS_RESULT;
      }
      throw new CustomError({ code: CODES.NOT_FOUND, message: 'User not found', service: 'users', method: 'update' });
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'users', method: 'update' });
    }
  }

  async delete(id) {
    try {
      if (await this.existsById(id)) {
        await this.users.update({ isDeleted: true }, { where: { id } });
        return DEFAULT_SUCCESS_RESULT;
      }
      throw new CustomError({ code: CODES.NOT_FOUND, message: 'User not found', service: 'users', method: 'delete' });
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'users', method: 'delete' });
    }
  }

  async getById(id) {
    try {
      const user = await this.existsById(id);
      if (user) {
        return { ...DEFAULT_SUCCESS_RESULT, data: user };
      }
      throw new CustomError({ code: CODES.NOT_FOUND, message: 'User not found', service: 'users', method: 'getById' });
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'users', method: 'getById' });
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
      return { ...DEFAULT_SUCCESS_RESULT, data: users };
    } catch (error) {
      throw new CustomError({ message: error.message, service: 'users', method: 'get' });
    }
  }
}
