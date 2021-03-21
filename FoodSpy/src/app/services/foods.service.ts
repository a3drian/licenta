import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { IFood } from '../interfaces/IFood';

@Injectable({
   providedIn: 'root'
})
export class FoodsService {
   readonly BASE_URL: string = '/db/foods';

   constructor(private http: HttpClient) { }

   // GET
   getData(
      name = ''
   ): Observable<[IFood[] | null]> {

      let params = new HttpParams()
         .set('name', name.toString());

      console.log('getData():');
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
                  return [
                     response.body
                  ];
               }
            )
         );
   }

   // FILTER
   search(term: string): Observable<IFood[]> {

      console.log('search(term: string):');

      return this.http
         .get<IFood[]>(`${this.BASE_URL}?name=${term}`)
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