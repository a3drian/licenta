import { IFood } from '../interfaces/IFood';

export class Food implements IFood {
   id!: string;
   name!: string;
   quantity!: number;
   unit!: string;
   calories!: number;
   fats!: number;
   carbs!: number;
   proteins!: number;

   public constructor(partial?: Partial<Food>) {
      Object.assign(this, partial);
   }
}