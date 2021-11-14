import { IFood, IMealFood } from 'foodspy-shared';

export class MealFood implements IMealFood {

   mfid!: string;
   quantity!: number;
   unit!: string;
   food!: IFood;

   public constructor(partial?: Partial<MealFood>) {
      Object.assign(this, partial);
   }

}