import { Router, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/core';
// Interfaces:
import { IExpressRequest } from '../interfaces/IExpressRequest';
// Models:
import { User } from '../entities/user.entity';
// Services:
import * as userService from '../services/users.service';
// Shared:
import { STATUS_CODES } from 'foodspy-shared';
import { log } from '../shared/Logger';

const CLASS_NAME = 'users.route.ts';

export { setUserRoute };

function setUserRoute(router: Router): Router {
   router.get('/', getUsers);
   router.post('/', postUser);
   /*
   router.get('/:id', getUser);
   router.put('/:id', putUser);
   router.delete('/:id', removeUser);
   */
   return router;
}

// GET
async function getUsers(
   req: IExpressRequest,
   res: Response,
   next: NextFunction
) {
   if (!req.em || !(req.em instanceof EntityManager)) {
      log(CLASS_NAME, getUsers.name, 'req.em is not instanceof EntityManager');
      return next(Error('EntityManager not available'));
   }

   console.log('');
   log(CLASS_NAME, getUsers.name, '');
   log(CLASS_NAME, getUsers.name, 'req.baseUrl:', req.baseUrl);
   log(CLASS_NAME, getUsers.name, 'req.originalUrl:', req.originalUrl);
   log(CLASS_NAME, `${getUsers.name}^`, '');
   console.log('');

   let response: Error | User[] | null;

   try {
      response = await userService.getUsers(req.em);
   } catch (ex) {
      return next(ex);
   }

   if (response instanceof Error) {
      return next(response);
   }

   return res.status(STATUS_CODES.OK).json(response);
}

// POST
async function postUser(
   req: IExpressRequest,
   res: Response,
   next: NextFunction
) {
   if (!req.em || !(req.em instanceof EntityManager)) {
      log(CLASS_NAME, postUser.name, 'req.em is not instanceof EntityManager');
      return next(Error('EntityManager not available'));
   }

   console.log('');
   log(CLASS_NAME, postUser.name, '');
   log(CLASS_NAME, postUser.name, 'req.baseUrl:', req.baseUrl);
   log(CLASS_NAME, postUser.name, 'req.originalUrl:', req.originalUrl);
   log(CLASS_NAME, `${postUser.name}^`, '');
   console.log('');

   let response: Error | User;
   try {
      response = await userService
         .registerUser(
            req.em,
            req.body
         );
   } catch (ex) {
      return next(ex);
   }

   if (response instanceof Error) {
      return next(response);
   }

   return res.status(STATUS_CODES.CREATED).json(response);
}
