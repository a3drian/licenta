import { IUnit } from '../interfaces/IUnit';

export class Unit implements IUnit {
   unit!: string;

   public constructor(partial?: Partial<Unit>) {
      Object.assign(this, partial);
   }
}