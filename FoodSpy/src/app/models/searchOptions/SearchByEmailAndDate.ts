import { SearchByEmail } from './SearchByEmail';

export class SearchByEmailAndDate implements SearchByEmail {
   email!: string;
   createdAt!: Date;

   public constructor(partial?: Partial<SearchByEmailAndDate>) {
      Object.assign(this, partial);
   }
}