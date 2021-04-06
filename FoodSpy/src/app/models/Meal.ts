import { IFood } from '../interfaces/IFood';
import { IMeal } from '../interfaces/IMeal';

export class Meal implements IMeal {

   type!: string;
   foods!: IFood[];
   createdAt?: Date | undefined;

   public constructor(partial?: Partial<Meal>) {
      Object.assign(this, partial);
   }
}