import mongoose from 'mongoose';

import { MongoSettings } from '../@types';

import { vars, emitter, mongodbURI } from '../configs';
import { EVENTS, ENVS } from '../constants';

mongoose.Promise = Promise;

mongoose.connection.on('error', (err: Error) => {
  console.log(`[database]-[mongo] error ${err.message}`);
});

const makeMongoURI = (mongoSettings: MongoSettings): string => {
  const { servers, username, password, repls, dbName = '' } = mongoSettings;
  const hostURL = servers.split(' ').join(',');
  const loginOption =
    username != null && password != null ? `${username}:${password}@` : '';
  const replOption = repls != null ? `?replicaSet=${repls}` : '';

  return `mongodb://${loginOption}${hostURL}/${dbName}${replOption}`;
};

const connect = (): void => {
  const uri = mongodbURI ?? makeMongoURI(vars.mongo);

  if (vars.env === ENVS.DEV) {
    mongoose.set('debug', true);
  }
  console.log(uri);
  mongoose
    .connect(uri, {
      dbName: vars.mongo.dbName,
    })
    .then(() => {
      emitter.emit(EVENTS.MONGO_CONNECTED, uri);
    })
    .catch((err: Error) => {
      console.log(`[database]-[mongo] error ${err.message}`);
    });
};

export = { connect };
