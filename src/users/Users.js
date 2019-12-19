import { User } from './User';
import { DEFAULT_LIMIT } from './constants';

class Users {
  constructor() {
    this.users = new Map();
    this.logins = new Set();
  }

  add(userData) {
    const user = new User(userData);

    if (this.logins.has(userData.login)) {
      return { success: false, message: 'Login exists' };
    }

    this.users.set(user.id, user);
    this.logins.add(user.login);
    return { success: true };
  }

  update(id, userData) {
    if (this.users.has(id)) {
      if (this.logins.has(userData.login)) {
        return { success: false, message: 'Login exists' };
      }
      this.users.set(id, { ...this.users.get(id), ...userData });
      return { success: true };
    }
    return { success: false, message: 'User not found' };
  }

  delete(id) {
    if (this.users.has(id)) {
      this.users.set(id, { ...this.users.get(id), idDeleted: true });
      return { success: true };
    }
    return { success: false, message: 'User not found' };
  }

  getById(id) {
    if (this.users.has(id)) {
      return { success: true, user: this.users.get(id) };
    }

    return { success: false, message: 'User not found' };
  }

  getAutoSuggestUsers(partOfLogin, limit = DEFAULT_LIMIT) {
    limit = limit < 0 && DEFAULT_LIMIT;
    return Array.from(this.users.values())
      .filter(user => user.login.includes(partOfLogin))
      .slice(0, limit);
  }

  get() {
    return Array.from(this.users.values());
  }
}

export default new Users();
