import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ValidationError } from 'express-validation';

import { APIError, NotFound } from '../@types';
import { getApiResponse } from '../utils';
import { validationMessages } from '../constants';

const errorHandler = (err: APIError, _req: Request, res: Response) => {
  return res.status(err.status).json(getApiResponse(err));
};

export const errorConverter = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let convertedError = err;
  if (err instanceof ValidationError) {
    convertedError = new APIError({
      ec: validationMessages.ERROR.ec,
      message: err.error,
      msg: err.details,
      status: err.statusCode,
    });
  }
  return errorHandler(convertedError as APIError, req, res);
};

export const notFound = (req: Request, res: Response) => {
  const err = new NotFound({
    status: httpStatus.NOT_FOUND,
  });
  return errorHandler(err, req, res);
};
