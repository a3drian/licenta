import { IFood } from '../interfaces/IFood';

export class Food implements IFood {
   id!: string;
   name!: string;
   quantity!: number;
   unit!: string;
   calories!: number;
   fats!: number;
   carbs!: number;
   proteins!: number;

   public constructor(partial?: Partial<Food>) {
      Object.assign(this, partial);
   }

   toString(): string {
      let output: string = '{' + '\n';

      output += `\t Id: ${this.id} \n`;
      output += `\t Name: ${this.name} \n`;
      output += `\t Quantity: ${this.quantity} \n`;
      output += `\t Unit: ${this.unit} \n`;

      output += '}' + '\n';

      return output;
   }
}