import uniqueId from 'lodash/uniqueId';

export class User {
  constructor({ login, password, age }) {
    this.id = uniqueId();
    this.login = login;
    this.password = password;
    this.age = age;
    this.isDeleted = false;
  }
}
