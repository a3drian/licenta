import { EntityManager } from '@mikro-orm/core';

import { User } from '../entities/user.entity';
import { log } from '../shared/Logger';

const CLASS_NAME = 'users.service.ts';

export {
   registerUser,
   getUsers,
   getUserByEmail,
   /*
   getUser,
   updateUser,
   removeUser,
   countUsers
   */
};

async function getUsers(
   em: EntityManager
): Promise<Error | User[]> {
   if (!(em instanceof EntityManager)) {
      log(CLASS_NAME, getUsers.name, 'req.em is not instanceof EntityManager');
      return Error('invalid request');
   }

   try {

      const existingUsers = await em
         .find(
            User,
            {}
         );

      await new Promise(
         (resolve) => { setTimeout(resolve, 500); }
      );

      console.log('');
      console.log('user.service.ts, getUsers():');
      console.log('existingUsers:', existingUsers);
      console.log('existingUsers.length:', existingUsers.length);
      console.log('user.service.ts, getUsers()^');

      return existingUsers;
   } catch (ex) {
      return ex;
   }
}

async function getUserByEmail(
   em: EntityManager,
   email: string
): Promise<Error | User | null> {
   if (!(em instanceof EntityManager)) {
      log(CLASS_NAME, getUserByEmail.name, 'req.em is not instanceof EntityManager');
      return Error('invalid request');
   }

   if (!email || typeof email !== 'string') {
      return Error('invalid params');
   }

   console.log('');
   console.log('user.service.ts, getUserByEmail():');
   console.log('email:', email);

   try {

      const user = await em
         .findOne(
            User,
            { email: email }
         );

      console.log('user:', user);
      console.log('user.service.ts, getUserByEmail()^');
      console.log('');

      return user;
   } catch (ex) {
      return ex;
   }
}

// POST
async function registerUser(
   em: EntityManager,
   user: Partial<User>
): Promise<Error | User> {
   if (!(em instanceof EntityManager)) {
      log(CLASS_NAME, registerUser.name, 'req.em is not instanceof EntityManager');
      return Error('invalid request');
   }

   if (!user || typeof user !== 'object' || user.id) {
      return Error('invalid params');
   }

   try {
      const registeredUser = new User(user);

      console.log('');
      console.log('register.service.ts, registerUser():');
      console.log('registeredUser:', registeredUser);
      console.log('register.service.ts, registerUser()^');
      console.log('');

      await em.persistAndFlush(registeredUser);
      return registeredUser;
   } catch (ex) {
      return ex;
   }
}