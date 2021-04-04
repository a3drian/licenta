import { ISearchOptions } from 'src/app/interfaces/searchOptions/ISearchOptions';

export class SearchByEmail implements ISearchOptions {
   email!: string;

   public constructor(partial?: Partial<SearchByEmail>) {
      Object.assign(this, partial);
   }
}