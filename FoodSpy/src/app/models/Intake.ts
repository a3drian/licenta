import { IMeal } from '../interfaces/IMeal';
import { IIntake } from '../interfaces/IIntake';

export class Intake implements IIntake {
   email!: string;
   createdAt!: Date;
   meals!: IMeal[];

   public constructor(partial?: Partial<Intake>) {
      Object.assign(this, partial);
   }
}