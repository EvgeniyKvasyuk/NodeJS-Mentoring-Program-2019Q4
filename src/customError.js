import { CODES } from './constants';

export class CustomError {
  constructor({ code = CODES.SOMETHING_WENT_WRONG, message = 'Something went wrong', service, method }) {
    this.succes = false;
    this.message = message;
    this.code = code;
    this.method = method;
    this.service = service;
  }
}
