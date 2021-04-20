import { IFood } from 'foodspy-shared';
import { IMeal } from 'foodspy-shared';

export class Meal implements IMeal {

   type!: string;
   foods!: IFood[];
   createdAt?: Date | undefined;

   public constructor(partial?: Partial<Meal>) {
      Object.assign(this, partial);
   }
}