import { IFood } from 'foodspy-shared';
import { IMeal } from 'foodspy-shared';

export class Meal implements IMeal {

   id!: string;
   type!: string;
   createdAt?: Date | undefined;
   modifiedAt?: Date | undefined;
   foodIDs!: string[];
   foods!: IFood[];

   public constructor(partial?: Partial<Meal>) {
      Object.assign(this, partial);
   }
}