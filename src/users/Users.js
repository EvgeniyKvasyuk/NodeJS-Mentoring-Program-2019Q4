import { User } from './User';
import { DEFAULT_LIMIT } from './constants';

class Users {
  constructor() {
    this.users = new Map();
  }

  add(userData) {
    const user = new User(userData);

    this.users.set(user.id, user);
  }

  update(id, userData) {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, ...userData });
      return true;
    }
    return false;
  }

  delete(id) {
    const user = this.users.get(id);
    if (user) {
      this.users.set(id, { ...user, idDeleted: true });
      return true;
    }
    return false;
  }

  getById(id) {
    return this.users.get(id);
  }

  getAutoSuggestUsers(substr, limit = DEFAULT_LIMIT) {
    return Array.from(this.users.values())
      .filter(user => user.login.includes(substr))
      .slice(0, limit);
  }

  get() {
    return Array.from(this.users.values());
  }
}

export default new Users();
