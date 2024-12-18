import httpStatus from 'http-status';

class ExtendableError extends Error {
  name: string;
  message: string;
  ec: number;
  status: number;
  stack: any;
  errors: any;
  msg: string;
  constructor({ message, errors, stack, ec, status, msg }: any) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.ec = ec;
    this.status = status;
    this.stack = stack;
    this.errors = errors;
    this.msg = msg;
  }
}

export class APIError extends ExtendableError {
  constructor({
    message,
    errors,
    stack,
    ec,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    msg,
  }: any) {
    super({ message, errors, stack, ec, status, msg });
  }
}

export class NotFound extends ExtendableError {
  constructor({
    message,
    errors,
    stack,
    ec,
    status = httpStatus.NOT_FOUND,
    msg,
  }: any) {
    super({ message, errors, stack, ec, status, msg });
  }
}
