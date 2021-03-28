import { IMeal } from '../interfaces/IMeal';

export class Meal implements IMeal {
   name!: string;

   public constructor(partial?: Partial<Meal>) {
		Object.assign(this, partial);
	}
}