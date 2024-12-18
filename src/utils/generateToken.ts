import jwt from 'jsonwebtoken';
import { accessTokenSettings } from '../configs';
import { ROLE } from '../constants';

export const generateAccessToken = (payload: {
  id: string;
  role: ROLE;
}): string => {
  const token = jwt.sign(payload, accessTokenSettings.accessSecret, {
    expiresIn: '365d',
  });
  return token;
};

export const generateRefreshToken = (payload: {
  id: string;
  role: ROLE;
}): string => {
  const token = jwt.sign(payload, accessTokenSettings.refreshSecret, {
    expiresIn: '365d',
  });
  return token;
};

export const generateForgotPassToken = (id: string): string => {
  const token = jwt.sign({ id }, accessTokenSettings.accessSecret, {
    expiresIn: '1h',
  });
  return token;
};
