import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IMeal } from '../interfaces/IMeal';
import { ISearchOptions } from '../interfaces/searchOptions/ISearchOptions';
import { Meal } from '../models/Meal';
import { SearchByEmail } from '../models/searchOptions/SearchByEmail';

@Injectable({
   providedIn: 'root'
})
export class MealsService {

   readonly BASE_URL: string = '/api/meals';
   readonly SEARCH_URL: string = '/api/meals/search/';

   meals: IMeal[] =
      [
         new Meal({ type: 'Breakfast' }),
         new Meal({ type: 'Lunch' }),
         new Meal({ type: 'Dinner' }),
         new Meal({ type: 'Snack' })
      ];

   constructor(private http: HttpClient) { }

   getMealTypes(): IMeal[] {
      return this.meals;
   }

   // ADD
   addMeal(meal: IMeal): Observable<IMeal> {
      console.log('addMeal(meal: IMeal):');

      const request = this.http
         .post<IMeal>(
            this.BASE_URL,
            meal
         )
         .pipe(
            tap(
               () => {
                  console.log('Item "', meal.type, '"was created!');
               }
            )
         );

      return request;
   }

   // Get meal by ID
   getMealById(id: string): Observable<IMeal> {
      console.log('getDataById(id: string):');
      const url = `${this.BASE_URL}/${id}`;
      console.log('url:', url);

      const request = this.http.get<IMeal>(url)
         .pipe(
            tap(
               (response) => {
                  console.log('Meal fetched:', response);
               }
            )
         );
      return request;
   }
   
}