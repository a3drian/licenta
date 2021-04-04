import { IFood } from './IFood';

export interface IMeal {
   email: string;
   type: string;
   foods: IFood[];
   createdAt?: Date;
}