import { IFood, IMealFood, IMeal } from 'foodspy-shared';

export class Meal implements IMeal {

   id!: string;
   type!: string;
   createdAt!: Date;
   modifiedAt?: Date | undefined;
   mealFoods!: IMealFood[];
   foods!: IFood[];

   public constructor(partial?: Partial<Meal>) {
      Object.assign(this, partial);
   }

   get numberOfMealFoods(): number {
      let meals: number = 0;
      if (this.mealFoods) {
         this.mealFoods.forEach(
            (mealFood) => {
               if (mealFood.mfid) {
                  meals = meals + 1;
               }
            }
         );
      }

      return meals;
   }
}