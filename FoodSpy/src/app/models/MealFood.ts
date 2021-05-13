import { IMealFood } from 'foodspy-shared';

export class MealFood implements IMealFood {

   mfid!: string;
   quantity!: number;
   unit!: string;

   public constructor(partial?: Partial<MealFood>) {
      Object.assign(this, partial);
   }

}