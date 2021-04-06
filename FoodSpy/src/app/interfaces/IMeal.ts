import { IFood } from './IFood';

export interface IMeal {
   type: string;
   foods: IFood[];
   createdAt?: Date;
}