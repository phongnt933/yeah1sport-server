import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http';
import httpStatus from 'http-status';
import { Response } from 'express';

import { accessTokenSettings } from '../configs';
import { RequestPayload } from '../@types';
import { getApiResponse } from '../utils';
import { messages } from '../constants';

const getToken = (headers: IncomingHttpHeaders): string => {
  const { authorization } = headers;
  if (authorization == null) {
    throw new Error('Invalid header');
  }
  const [tokenType, token] = authorization.split(' ');
  if (tokenType !== 'Bearer' || token === undefined || token === '') {
    throw new Error('Invalid header');
  }
  return token;
};

export const verifyToken = (req: RequestPayload, res: Response, next: any) => {
  try {
    const token = getToken(req.headers);
    const payload = jwt.verify(token, accessTokenSettings.accessSecret);
    req.payload = payload as jwt.JwtPayload;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(getApiResponse(messages.ACCESS_TOKEN_EXPIRED));
    }
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(getApiResponse(messages.ACCESS_TOKEN_INVALID));
  }
};
