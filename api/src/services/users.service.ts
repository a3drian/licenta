import { EntityManager } from '@mikro-orm/core';
// Models:
import { User } from '../entities/user.entity';
// Shared:
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
      log(CLASS_NAME, getUsers.name, '');
      log(CLASS_NAME, getUsers.name, 'existingUsers:', existingUsers);
      log(CLASS_NAME, getUsers.name, 'existingUsers.length:', existingUsers.length);
      log(CLASS_NAME, `${getUsers.name}^`, '');
      console.log('');

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
   log(CLASS_NAME, getUserByEmail.name, '');
   log(CLASS_NAME, getUserByEmail.name, 'email:', email);

   try {

      const user = await em
         .findOne(
            User,
            { email: email }
         );

      log(CLASS_NAME, getUserByEmail.name, 'user:', user);
      log(CLASS_NAME, `${getUserByEmail.name}^`, '');
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
      log(CLASS_NAME, registerUser.name, '');
      log(CLASS_NAME, registerUser.name, 'registeredUser:', registeredUser);
      log(CLASS_NAME, `${registerUser.name}^`, '');
      console.log('');

      await em.persistAndFlush(registeredUser);
      return registeredUser;
   } catch (ex) {
      return ex;
   }
}