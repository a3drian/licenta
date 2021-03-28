import { Router, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { IExpressRequest } from '../interfaces/IExpressRequest';
import * as userService from '../services/users.service';

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
      console.log(`ERROR: users.route.ts, postUser(): req.em is not instanceof EntityManager`);
      return next(Error('EntityManager not available'));
   }

   console.log('');
   console.log('user.route.ts, getUsers():');
   console.log('req.baseUrl:', req.baseUrl);
   console.log('req.originalUrl:', req.originalUrl);
   console.log('user.route.ts, getUsers()^');
   console.log('');

   let users: Error | User[] | null;

   try {
      users = await userService.getUsers(req.em);
   } catch (ex) {
      return next(ex);
   }

   if (users instanceof Error) {
      return next(users);
   }

   return res.status(200).json(users);
}

// POST
async function postUser(
   req: IExpressRequest,
   res: Response,
   next: NextFunction
) {
   if (!req.em || !(req.em instanceof EntityManager)) {
      console.log(`ERROR: users.route.ts, postUser(): req.em is not instanceof EntityManager`);
      return next(Error('EntityManager not available'));
   }

   console.log('');
   console.log('users.route.ts, postUser():');
   console.log('req.baseUrl:', req.baseUrl);
   console.log('req.originalUrl:', req.originalUrl);
   console.log('users.route.ts, postUser()^');
   console.log('');

   let user: Error | User;
   try {
      user = await userService
         .addUser(
            req.em,
            req.body
         );
   } catch (ex) {
      return next(ex);
   }

   if (user instanceof Error) {
      return next(user);
   }

   return res.status(201).json(user);
}
