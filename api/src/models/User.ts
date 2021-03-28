import { IUser } from "../interfaces/IUser";

export class User implements IUser {
   username!: string;
   password!: string;

   public constructor(partial?: Partial<User>) {
      Object.assign(this, partial);
   }
}