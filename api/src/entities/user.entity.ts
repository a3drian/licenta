import {
   Entity,
   // MongoEntity,   // might not be needed anymore
   SerializedPrimaryKey,
   PrimaryKey,
   Property
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';

// import { IUser } from '../../../foodspy-shared/IUser';
// import { IUser } from 'foodspy-shared';
import { IUser } from '../interfaces/IUser';

@Entity()
export class User implements IUser {

   @PrimaryKey()
   _id!: ObjectId;

   @SerializedPrimaryKey()
   id!: string;

   @Property()
   username!: string;
   @Property()
   password!: string;

   public constructor(partial?: Partial<User>) {
      Object.assign(this, partial);
   }
}