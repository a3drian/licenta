// Heroku:
import { MongoDriver } from '@mikro-orm/mongodb';
const cors = require('cors');
// Heroku^

const express = require('express');
import { Application, Router, Request, Response, NextFunction } from 'express';

import { env } from './env';

import { IExpressError } from './interfaces/IExpressError';
import { IExpressRequest } from './interfaces/IExpressRequest';
import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import entities from './entities';

import { ERROR_MESSAGES, STATUS_CODES } from 'foodspy-shared';

import { setUserRoute } from './routes/users.route';
// Authentication:
import { setRegisterRoute } from './routes/register.route';
import { setLoginRoute } from './routes/login.route';
import { log } from './shared/Logger';

let app: Application;

async function makeApp(): Promise<Application> {
  if (app) { return app; }

  app = express();
  app.use(cors());

  app.use(express.static('build'));

  const orm = await MikroORM.init<MongoDriver>({
    metadataProvider: ReflectMetadataProvider,
    cache: { enabled: false },
    entities: entities,
    dbName: env.DB_NAME,
    clientUrl: env.MONGO_URL,
    type: 'mongo'
  });

  // make the entity manager available in request
  app.use(
    (req: IExpressRequest, _res: Response, next: NextFunction) => {
      req.em = orm.em.fork();	// em = entity manager
      next();
    }
  );

  log('app.ts', makeApp.name, 'env:', env);

  // middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // routes
  app.use(env.USERS_ROUTE, setUserRoute(Router()));
  app.use(env.REGISTER_ROUTE, setRegisterRoute(Router()));
  app.use(env.LOGIN_ROUTE, setLoginRoute(Router()));

  // 404
  app.use(
    (_req: Request, _res: Response, next: NextFunction) => {
      const err = new Error(ERROR_MESSAGES.NOT_FOUND) as IExpressError;
      err.status = STATUS_CODES.NOT_FOUND;
      next(err);
    }
  );

  // 500
  app.use(
    (err: IExpressError, _req: Request, res: Response, _next: NextFunction) => {
      res
        .status(err.status || STATUS_CODES.SERVER_ERROR)
        .send(env.NODE_ENV === 'development' ? err : {});
    }
  );

  return app;
}

export { makeApp };
