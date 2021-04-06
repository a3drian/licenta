import { IMeal } from './IMeal';

export interface IIntake {
   email: string;
   createdAt: Date;
   meals: IMeal[];
}