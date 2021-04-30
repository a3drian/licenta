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
}