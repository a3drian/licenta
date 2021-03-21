import {
   Entity,
   // MongoEntity,   // might not be needed anymore
   SerializedPrimaryKey,
   PrimaryKey,
   Property
} from '@mikro-orm/core';
import { ObjectId } from 'mongodb';

import { IFood } from '../interfaces/IFood';

@Entity()
export class Food implements IFood {

   @PrimaryKey()
   _id!: ObjectId;

   @SerializedPrimaryKey()
   id!: string;

   @Property()
   name!: string;

   @Property()
   qty!: number;

   @Property()
   unit!: string;

   // immutable properties
   @Property()
   calories!: number;
   @Property()
   fats!: number;
   @Property()
   carbs!: number;
   @Property()
   proteins!: number;

   public constructor(partial?: Partial<Food>) {
      Object.assign(this, partial);
   }

}