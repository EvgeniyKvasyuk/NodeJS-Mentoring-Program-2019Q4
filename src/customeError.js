import { CODES } from './constants';

export class CustomError {
  constructor({ code = CODES.SOMETHING_WENT_WRONG, message = 'Something went wrong', systemMessage, service, method }) {
    this.succes = false;
    this.message = message;
    this.code = code;

    if (method) {
      this.method = method;
    }
    if (service) {
      this.service = service;
    }
    if (systemMessage) {
      this.systemMessage = systemMessage;
    }
  }
}
