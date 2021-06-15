// Heroku:
import { MongoDriver } from '@mikro-orm/mongodb';
const cors = require('cors');
// Heroku^

const express = require('express');
import { Application, Router, Request, Response, NextFunction } from 'express';
import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';

import { env } from './env';

// Interfaces:
import { IExpressError } from './interfaces/IExpressError';
import { IExpressRequest } from './interfaces/IExpressRequest';
// Entities:
import entities from './entities';
import { setUserRoute } from './routes/users.route';
// Authentication:
import jwt from 'express-jwt';
import { setRegisterRoute } from './routes/register.route';
import { setLoginRoute } from './routes/login.route';
// Shared:
import { Constants } from './shared/Constants';
import { ERROR_MESSAGES, STATUS_CODES } from 'foodspy-shared';
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
    dbName: env.TEST_DB_NAME,
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

  if (env.NODE_ENV === Constants.PRODUCTION_MODE) {
    // JWT
    app.use(
      jwt(
        {
          secret: env.TOKEN_SECRET,
          algorithms: ['HS256'],
        }
      ).unless({ path: [Constants.APIEndpoints.LOGIN_URL, Constants.APIEndpoints.REGISTER_URL] })
    );
  }

  // routes
  app.use(env.USERS_ROUTE, setUserRoute(Router()));
  app.use(env.REGISTER_ROUTE, setRegisterRoute(Router()));
  app.use(env.LOGIN_ROUTE, setLoginRoute(Router()));

  if (env.NODE_ENV === Constants.PRODUCTION_MODE) {
    
  }

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
        .send(env.NODE_ENV === Constants.PRODUCTION_MODE ? {} : err);
    }
  );

  return app;
}

export { makeApp };
