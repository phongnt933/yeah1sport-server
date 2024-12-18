// eslint-disable-next-line import/no-cycle
import { emitter } from '../configs';
import { EVENTS } from '../constants';
import mongo from './mongo';

const connect = (): void => {
  emitter.on(EVENTS.MONGO_CONNECTED, (uri: string) => {
    console.info(`[database]-[mongo] connected ${uri}`);
    emitter.emit(EVENTS.DB_CONNECTED);
  });
  mongo.connect();
};

export default { connect };
