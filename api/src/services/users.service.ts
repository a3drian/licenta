import { EntityManager } from '@mikro-orm/core';

import { User } from '../entities/user.entity';

export {
   addUser,
   getUsers,
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
      console.log(`ERROR: users.service.ts, getUsers(): em is not instanceof EntityManager`);
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

async function getUserByUsername(
   em: EntityManager,
   username: string
): Promise<Error | User | null> {
   if (!(em instanceof EntityManager)) {
      console.log(`ERROR: users.service.ts, getUserByUsername(): em is not instanceof EntityManager`);
      return Error('invalid request');
   }

   if (!username || typeof username !== 'string') {
      return Error('invalid params');
   }

   console.log('');
   console.log('user.service.ts, getUserByUsername():');
   console.log('username:', username);

   try {

      const user = await em
         .findOne(
            User,
            { username: username }
         );

      console.log('user:', user);
      console.log('user.service.ts, getUserByUsername()^');
      console.log('');

      return user;
   } catch (ex) {
      return ex;
   }
}

// POST
async function addUser(
   em: EntityManager,
   user: Partial<User>
): Promise<Error | User> {
   if (!(em instanceof EntityManager)) {
      console.log(`ERROR: users.service.ts, addUser(): em is not instanceof EntityManager`);
      return Error('invalid request');
   }

   if (!user || typeof user !== 'object' || user.id) {
      return Error('invalid params');
   }

   try {
      const addedUser = new User(user);

      console.log('');
      console.log('users.service.ts, addUser():');
      console.log('addedUser:', addedUser);
      console.log('users.service.ts, addUser()^');
      console.log('');

      await em.persistAndFlush(addedUser);
      return addedUser;
   } catch (ex) {
      return ex;
   }
}