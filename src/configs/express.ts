import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import timeout from 'connect-timeout';
import methodOverride from 'method-override';
import morgan from 'morgan';
import path from 'path';

import { emitter } from './event-emitter';
import { vars } from './vars';
import { EVENTS } from '../constants';
import database from '../database';
import routerV1 from '../routers/v1';
import { notFound, errorConverter } from '../middlewares';

const app: Express = express();
const haltOnTimedout = (req: Request, _res: Response, next: any): void => {
  if (!req.timedout) {
    next();
  }
};

const initApp = (app: express.Express): void => {
  app.use(timeout('10s'));
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(helmet());
  app.use(cors());
  app.use(
    '/static',
    express.static(path.join(__dirname, '..', '..', 'public')),
  );

  app.use('/api', routerV1);
  app.get('/', (_req: Request, res: Response) => {
    res.send('OK');
  });
  app.use(notFound);
  app.use(haltOnTimedout);
  app.use(errorConverter);
};

export const start = (): void => {
  emitter.on(EVENTS.DB_CONNECTED, () => {
    initApp(app);
    app.listen(vars.port, () => {
      console.info(`[server] listen on port ${vars.port}`);
    });
  });
  database.connect();
};
