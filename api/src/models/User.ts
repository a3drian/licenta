import { IUser } from 'foodspy-shared';

export class User implements IUser {
   id!: string;
   email!: string;
   password!: string;
   targetCalories!: number;

   public constructor(partial?: Partial<User>) {
      Object.assign(this, partial);
   }
}