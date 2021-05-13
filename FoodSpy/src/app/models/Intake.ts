import { IMeal } from 'foodspy-shared';
import { IIntake } from 'foodspy-shared';

export class Intake implements IIntake {

   id!: string;
   email!: string;
   createdAt!: Date;
   mealIDs!: string[];
   meals!: IMeal[];

   public constructor(partial?: Partial<Intake>) {
      Object.assign(this, partial);
   }

   get numberOfMeals(): number {
      let meals: number = 0;
      if (this.mealIDs) {
         this.mealIDs.forEach(
            (mealFood) => {
               if (mealFood) {
                  meals = meals + 1;
               }
            }
         );
      }

      return meals;
   }
}