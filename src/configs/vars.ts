import dotenv from 'dotenv';

import { ENVS } from '../constants';

dotenv.config();

const env = process.env.ENV ?? ENVS.DEV;

export const vars = {
  port: process.env.PORT ?? 3000,
  env,
  mongo: {
    servers: process.env.MONGO_SERVERS ?? '127.0.0.1:27017',
    dbName:
      env === ENVS.TEST
        ? process.env.MONGO_DB_NAME_TEST ?? 'db-test'
        : process.env.MONGO_DB_NAME ?? 'jep',
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    repls: process.env.MONGO_REPLS,
  },
};

export const mongodbURI = process.env.MONGO_URI;

export const accessTokenSettings = {
  accessSecret: process.env.ACCESS_TOKEN_SECRET ?? 'secret_1',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET ?? 'secret_2',
  expireTime: process.env.ACCESS_TOKEN_SECRET
    ? Number(process.env.ACCESS_TOKEN_SECRET)
    : 1, // day
};

export const paypalInfo = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  api: process.env.PAYPAL_API,
};
