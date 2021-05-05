import { IFood } from 'foodspy-shared';

export class Food implements IFood {
   
   id!: string;
   name!: string;
   energy!: number;
   fats!: number;
   saturates!: number;
   carbohydrates!: number;
   sugars!: number;
   proteins!: number;
   salt!: number;

   public constructor(partial?: Partial<Food>) {
      Object.assign(this, partial);
   }
}