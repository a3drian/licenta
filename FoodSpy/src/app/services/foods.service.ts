import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IFood } from '../interfaces/IFood';
import { AuthService } from '../auth/auth.service';

@Injectable({
   providedIn: 'root'
})
export class FoodsService {
   readonly BASE_URL: string = '/api/foods';
   readonly SEARCH_BY_NAME_URL: string = this.BASE_URL + '/search?name=';

   constructor(
      private http: HttpClient,
      private authService: AuthService
   ) { }

   // GET
   getFoods(
      foodName = ''
   ): Observable<IFood[] | null> {

      let params = new HttpParams()
         .set('name', foodName.toString());

      console.log('getFoods():');
      console.log('params:', params);

      const keys = params.keys();

      keys.forEach(element => {
         const value = params.getAll(element);
         console.log(element, '\t', value);
      });

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
                  console.log('Foods fetched:', response.body);
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

      console.log('search(term: string):');

      return this.http
         .get<IFood[]>(`${this.SEARCH_BY_NAME_URL}${term}`)
         .pipe(
            tap(
               (x) => {
                  x.length ?
                     console.log(`found ${x.length} items matching '${term}'`) :
                     console.log(`no items matching '${term}'`)
               }
            )
         );
   }

}