import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IFood } from 'foodspy-shared';
import { AuthService } from '../auth/auth.service';
import { log } from '../shared/Logger';
import { Constants } from '../shared/Constants';

@Injectable({
   providedIn: 'root'
})
export class FoodsService {
   readonly BASE_URL: string = Constants.APIEndpoints.FOODS_BASE_URL;
   readonly SEARCH_BY_NAME_URL: string = this.BASE_URL + Constants.APIEndpoints.FOODS_SERACH_URL;

   constructor(
      private http: HttpClient,
      private authService: AuthService
   ) { }

   // GET
   getFoods(
      foodName = ''
   ): Observable<IFood[] | null> {

      const params = new HttpParams()
         .set('name', foodName.toString());

      return this.http
         .get<IFood[]>(this.BASE_URL,
            {
               params: params,
               observe: 'response'
            }
         )
         .pipe(
            tap(
               (response) => {
                  log('foods.service.ts', this.getFoods.name, 'Foods fetched:', response.body);
               }
            ),
            map(
               (response) => {
                  return response.body;
               }
            )
         );
   }

   // FILTER
   search(term: string): Observable<IFood[]> {

      log('foods.service.ts', this.search.name, '');

      return this.http
         .get<IFood[]>(`${this.SEARCH_BY_NAME_URL}${term}`)
         .pipe(
            tap(
               (searchResults) => {
                  searchResults.length ?
                     log('foods.service.ts', this.search.name, `Found ${searchResults.length} items matching: `, term) :
                     log('foods.service.ts', this.search.name, 'No items matching: ', term);
               }
            )
         );
   }

}