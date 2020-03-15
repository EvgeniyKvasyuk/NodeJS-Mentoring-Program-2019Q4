import jwt from 'jsonwebtoken';

import { CustomError } from '../customError';
import { CODES, DEFAULT_SUCCESS_RESULT, SECRET } from '../constants';

export class AuthService {
  constructor(usersModel) {
    this.users = usersModel;
  }

  async existsByLoginAndPassword(login, password) {
    return this.users.findOne({ where: { login, password } });
  }

  async login({ login, password }) {
    try {
      const user = await this.existsByLoginAndPassword(login, password);
      if (!user) {
        throw new CustomError({ code: CODES.BAD_DATA, message: 'Login isn`t exists or password incorrect', service: 'auth', method: 'login' });
      }

      const token = await jwt.sign({ login }, SECRET, { expiresIn: '1h' });
      return {
        ...DEFAULT_SUCCESS_RESULT,
        data: { auth_token: token }
      };
    } catch (error) {
      if (error.code) {
        throw error;
      }
      throw new CustomError({ message: error.message, service: 'auth', method: 'add' });
    }
  }
}
